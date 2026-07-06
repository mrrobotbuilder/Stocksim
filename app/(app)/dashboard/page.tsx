import Link from 'next/link'
import { redirect } from 'next/navigation'
import { TrendingUp, TrendingDown, DollarSign, BarChart2, AlertTriangle, RefreshCw } from 'lucide-react'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/db'
import { getMultipleQuotes } from '@/app/lib/stocks'
import { formatCurrency, formatPercent, colorForChange, bgColorForChange } from '@/app/lib/format'
import { DIFFICULTY_CONFIG, type Difficulty } from '@/app/lib/definitions'
import ResetButton from '@/app/_components/ResetButton'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.userId },
    include: { holdings: true },
  })
  if (!portfolio) redirect('/login')

  const config = DIFFICULTY_CONFIG[portfolio.difficulty as Difficulty]
  const tickers = portfolio.holdings.map(h => h.ticker)
  const quotes = await getMultipleQuotes(tickers)

  let holdingsValue = 0
  const holdingsWithPrices = portfolio.holdings.map(h => {
    const quote = quotes[h.ticker]
    const currentPrice = quote?.price ?? h.avgCostBasis
    const currentValue = currentPrice * h.shares
    const costBasis = h.avgCostBasis * h.shares
    const gainLoss = currentValue - costBasis
    const gainLossPercent = (gainLoss / costBasis) * 100
    holdingsValue += currentValue
    return { ...h, currentPrice, currentValue, gainLoss, gainLossPercent, quote }
  })

  const totalValue = portfolio.cashBalance + holdingsValue
  const totalReturn = totalValue - portfolio.startingCash
  const totalReturnPercent = (totalReturn / portfolio.startingCash) * 100
  const isBankrupt = totalValue <= config.bankruptcyThreshold

  return (
    <div className="space-y-6">
      {/* Bankruptcy warning */}
      {isBankrupt && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-red-300 font-semibold mb-1">Portfolio Bankrupt</h3>
            <p className="text-red-400/80 text-sm">
              Your portfolio value has dropped below {formatCurrency(config.bankruptcyThreshold)}. Reset to start over with {formatCurrency(config.startingCash)}.
            </p>
          </div>
          <ResetButton />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Value"
          value={formatCurrency(totalValue)}
          icon={<DollarSign size={18} />}
          accent="text-white"
        />
        <StatCard
          label="Cash Available"
          value={formatCurrency(portfolio.cashBalance)}
          icon={<DollarSign size={18} />}
          accent="text-slate-300"
        />
        <StatCard
          label="Invested"
          value={formatCurrency(holdingsValue)}
          icon={<BarChart2 size={18} />}
          accent="text-blue-400"
        />
        <StatCard
          label="Total Return"
          value={`${formatCurrency(totalReturn)} (${formatPercent(totalReturnPercent)})`}
          icon={totalReturn >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          accent={totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}
        />
      </div>

      {/* Difficulty badge */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span className="bg-slate-800 px-3 py-1 rounded-full">
          {config.label} Mode — Starting Cash: {formatCurrency(config.startingCash)}
        </span>
        {portfolio.resetCount > 0 && (
          <span className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1">
            <RefreshCw size={12} />
            {portfolio.resetCount} reset{portfolio.resetCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Holdings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Holdings</h2>
          <Link href="/market" className="text-sm text-emerald-400 hover:text-emerald-300">
            + Add stock
          </Link>
        </div>

        {holdingsWithPrices.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            <BarChart2 size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">You have no holdings yet.</p>
            <Link href="/market" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">
              Browse the market →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {holdingsWithPrices
              .sort((a, b) => b.currentValue - a.currentValue)
              .map(h => (
              <div key={h.ticker} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {h.ticker.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/stock/${h.ticker}`} className="font-semibold text-white hover:text-emerald-400 transition-colors">
                      {h.ticker}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${bgColorForChange(h.gainLossPercent)}`}>
                      {formatPercent(h.gainLossPercent)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs truncate">{h.companyName}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-slate-300 text-sm">{h.shares.toFixed(4)} shares</p>
                  <p className="text-slate-500 text-xs">avg {formatCurrency(h.avgCostBasis)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(h.currentValue)}</p>
                  <p className={`text-xs ${colorForChange(h.gainLoss)}`}>
                    {h.gainLoss >= 0 ? '+' : ''}{formatCurrency(h.gainLoss)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, accent }: {
  label: string
  value: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
        {icon}
        {label}
      </div>
      <p className={`font-bold text-lg leading-tight ${accent}`}>{value}</p>
    </div>
  )
}
