import { redirect, notFound } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/db'
import { getStockQuote, getStockChart } from '@/app/lib/stocks'
import { formatCurrency, formatPercent, formatNumber, colorForChange, bgColorForChange } from '@/app/lib/format'
import StockChart from '@/app/_components/StockChart'
import TradePanel from '@/app/_components/TradePanel'

export default async function StockPage({
  params,
  searchParams,
}: {
  params: Promise<{ ticker: string }>
  searchParams: Promise<{ range?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { ticker } = await params
  const { range = '3mo' } = await searchParams
  const validRange = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '5y'].includes(range)
    ? (range as '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y')
    : '3mo'

  const [quote, chart, portfolio] = await Promise.all([
    getStockQuote(ticker.toUpperCase()),
    getStockChart(ticker.toUpperCase(), validRange),
    prisma.portfolio.findUnique({
      where: { userId: session.userId },
      include: { holdings: { where: { ticker: ticker.toUpperCase() } } },
    }),
  ])

  if (!quote) notFound()
  if (!portfolio) redirect('/login')

  const holding = portfolio.holdings[0] ?? null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">{quote.ticker}</h1>
            <span className={`text-sm px-2.5 py-1 rounded-full ${bgColorForChange(quote.changePercent)}`}>
              {formatPercent(quote.changePercent)}
            </span>
          </div>
          <p className="text-slate-400">{quote.companyName}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold text-white">{formatCurrency(quote.price)}</span>
            <span className={`text-lg ${colorForChange(quote.change)}`}>
              {quote.change >= 0 ? '+' : ''}{formatCurrency(quote.change)} today
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 space-y-4">
          <StockChart data={chart} ticker={quote.ticker} range={validRange} />

          {/* Key stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatRow label="Market Cap" value={quote.marketCap ? formatLargeNumber(quote.marketCap) : '—'} tooltip="Total value of all shares outstanding. Tells you the company's size." />
              <StatRow label="Volume" value={quote.volume ? formatNumber(quote.volume) : '—'} tooltip="Number of shares traded today. High volume means high investor interest." />
              <StatRow label="P/E Ratio" value={quote.peRatio ? quote.peRatio.toFixed(1) : '—'} tooltip="Price-to-Earnings: how much you pay per $1 of company profit. Lower often = better value." />
              <StatRow label="52W High" value={quote.high52 ? formatCurrency(quote.high52) : '—'} tooltip="Highest price in the last 52 weeks." />
              <StatRow label="52W Low" value={quote.low52 ? formatCurrency(quote.low52) : '—'} tooltip="Lowest price in the last 52 weeks." />
              <StatRow label="Div Yield" value={quote.dividendYield ? `${quote.dividendYield.toFixed(2)}%` : '—'} tooltip="Annual dividend as % of price. Income you earn just by holding the stock." />
            </div>
          </div>
        </div>

        {/* Trade panel */}
        <div>
          <TradePanel
            ticker={quote.ticker}
            price={quote.price}
            companyName={quote.companyName}
            cashBalance={portfolio.cashBalance}
            holding={holding ? { shares: holding.shares, avgCostBasis: holding.avgCostBasis } : null}
          />
        </div>
      </div>
    </div>
  )
}

function StatRow({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <div className="group relative">
      <p className="text-slate-400 text-xs mb-0.5 flex items-center gap-1">
        {label}
        <span className="w-3.5 h-3.5 rounded-full bg-slate-700 text-slate-400 text-[9px] flex items-center justify-center cursor-help">?</span>
      </p>
      <p className="text-white font-semibold text-sm">{value}</p>
      <div className="absolute bottom-full left-0 mb-1 w-56 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {tooltip}
      </div>
    </div>
  )
}

function formatLargeNumber(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString()}`
}
