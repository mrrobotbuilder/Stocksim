import StockSearch from '@/app/_components/StockSearch'
import { getMultipleQuotes } from '@/app/lib/stocks'
import { formatCurrency, formatPercent, bgColorForChange } from '@/app/lib/format'
import Link from 'next/link'

const POPULAR_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'SPY', 'QQQ', 'BRK-B']

export default async function MarketPage() {
  const quotes = await getMultipleQuotes(POPULAR_TICKERS)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Market</h1>
        <p className="text-slate-400 text-sm">Search for any stock or browse popular picks.</p>
      </div>

      <StockSearch />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-white">Popular Stocks</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {POPULAR_TICKERS.map(ticker => {
            const q = quotes[ticker]
            if (!q) return null
            return (
              <Link
                key={ticker}
                href={`/stock/${ticker}`}
                className="flex items-center px-6 py-4 hover:bg-slate-800/50 transition-colors gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {ticker.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{ticker}</p>
                  <p className="text-slate-400 text-xs truncate">{q.companyName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(q.price)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${bgColorForChange(q.changePercent)}`}>
                    {formatPercent(q.changePercent)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
