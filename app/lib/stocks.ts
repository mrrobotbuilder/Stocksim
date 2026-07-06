import YahooFinance from 'yahoo-finance2'

const yf = new (YahooFinance as unknown as new (opts: Record<string, unknown>) => typeof YahooFinance)(
  { suppressNotices: ['yahooSurvey'] }
)

export type StockQuote = {
  ticker: string
  companyName: string
  price: number
  change: number
  changePercent: number
  marketCap?: number
  volume?: number
  avgVolume?: number
  high52?: number
  low52?: number
  peRatio?: number
  dividendYield?: number
  exchange?: string
}

export type SearchResult = {
  ticker: string
  companyName: string
  exchange: string
  type: string
}

export type ChartPoint = {
  date: string
  close: number
  open: number
  high: number
  low: number
  volume: number
}

export async function getStockQuote(ticker: string): Promise<StockQuote | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quote = await (yf as any).quote(ticker.toUpperCase()) as Record<string, unknown>
    if (!quote || !quote.regularMarketPrice) return null
    const dividendYield = quote.dividendYield as number | null
    return {
      ticker: (quote.symbol as string) ?? ticker,
      companyName: (quote.longName as string) ?? (quote.shortName as string) ?? ticker,
      price: quote.regularMarketPrice as number,
      change: (quote.regularMarketChange as number) ?? 0,
      changePercent: (quote.regularMarketChangePercent as number) ?? 0,
      marketCap: quote.marketCap as number | undefined,
      volume: quote.regularMarketVolume as number | undefined,
      avgVolume: quote.averageDailyVolume3Month as number | undefined,
      high52: quote.fiftyTwoWeekHigh as number | undefined,
      low52: quote.fiftyTwoWeekLow as number | undefined,
      peRatio: quote.trailingPE as number | undefined,
      dividendYield: dividendYield ? dividendYield * 100 : undefined,
      exchange: quote.exchange as string | undefined,
    }
  } catch {
    return null
  }
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await (yf as any).search(query, { newsCount: 0 }) as Record<string, unknown>
    const quotes = (results.quotes as Record<string, unknown>[]) ?? []
    return quotes
      .filter(q => q.isYahooFinance && (q.quoteType === 'EQUITY' || q.quoteType === 'ETF'))
      .slice(0, 10)
      .map(q => ({
        ticker: (q.symbol as string) ?? '',
        companyName: (q.longname as string) ?? (q.shortname as string) ?? (q.symbol as string) ?? '',
        exchange: (q.exchange as string) ?? '',
        type: (q.quoteType as string) ?? '',
      }))
      .filter(q => q.ticker)
  } catch {
    return []
  }
}

export async function getStockChart(
  ticker: string,
  range: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y' = '3mo'
): Promise<ChartPoint[]> {
  try {
    const intervalMap: Record<string, '1m' | '5m' | '1d' | '1wk'> = {
      '1d': '5m',
      '5d': '1d',
      '1mo': '1d',
      '3mo': '1d',
      '6mo': '1d',
      '1y': '1d',
      '5y': '1wk',
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (yf as any).chart(ticker.toUpperCase(), {
      period1: getRangeStart(range),
      interval: intervalMap[range],
    }) as Record<string, unknown>
    const quotes = (result.quotes as Record<string, unknown>[]) ?? []
    return quotes
      .filter(q => q.close != null)
      .map(q => ({
        date: new Date(q.date as string | number).toISOString(),
        close: (q.close as number) ?? 0,
        open: (q.open as number) ?? 0,
        high: (q.high as number) ?? 0,
        low: (q.low as number) ?? 0,
        volume: (q.volume as number) ?? 0,
      }))
  } catch {
    return []
  }
}

export async function getMultipleQuotes(tickers: string[]): Promise<Record<string, StockQuote>> {
  if (tickers.length === 0) return {}
  const results = await Promise.allSettled(tickers.map(t => getStockQuote(t)))
  const map: Record<string, StockQuote> = {}
  results.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value) map[tickers[i]] = r.value
  })
  return map
}

function getRangeStart(range: string): Date {
  const now = new Date()
  switch (range) {
    case '1d':  return new Date(now.setDate(now.getDate() - 1))
    case '5d':  return new Date(now.setDate(now.getDate() - 5))
    case '1mo': return new Date(now.setMonth(now.getMonth() - 1))
    case '3mo': return new Date(now.setMonth(now.getMonth() - 3))
    case '6mo': return new Date(now.setMonth(now.getMonth() - 6))
    case '1y':  return new Date(now.setFullYear(now.getFullYear() - 1))
    case '5y':  return new Date(now.setFullYear(now.getFullYear() - 5))
    default:    return new Date(now.setMonth(now.getMonth() - 3))
  }
}
