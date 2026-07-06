import { prisma } from '@/app/lib/db'
import { getMultipleQuotes } from '@/app/lib/stocks'
import { formatCurrency, formatPercent, colorForChange } from '@/app/lib/format'
import { DIFFICULTY_CONFIG, type Difficulty } from '@/app/lib/definitions'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { Trophy, Medal } from 'lucide-react'

export default async function LeaderboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const portfolios = await prisma.portfolio.findMany({
    include: {
      user: { select: { username: true } },
      holdings: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  // Collect all tickers
  const allTickers = [...new Set(portfolios.flatMap(p => p.holdings.map(h => h.ticker)))]
  const quotes = await getMultipleQuotes(allTickers)

  const ranked = portfolios
    .map(p => {
      const holdingsValue = p.holdings.reduce((sum, h) => {
        const price = quotes[h.ticker]?.price ?? h.avgCostBasis
        return sum + price * h.shares
      }, 0)
      const totalValue = p.cashBalance + holdingsValue
      const returnPct = ((totalValue - p.startingCash) / p.startingCash) * 100
      const config = DIFFICULTY_CONFIG[p.difficulty as Difficulty]
      return {
        username: p.user.username,
        userId: p.userId,
        totalValue,
        returnPct,
        difficulty: config.label,
        startingCash: p.startingCash,
      }
    })
    .sort((a, b) => b.returnPct - a.returnPct)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
        <p className="text-slate-400 text-sm">Ranked by % return. All difficulty levels compete equally.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          {ranked.map((entry, i) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 px-6 py-4 ${entry.username === session.username ? 'bg-emerald-500/5 border-l-2 border-emerald-500' : ''}`}
            >
              <div className="w-8 text-center flex-shrink-0">
                {i === 0 ? <Trophy size={18} className="text-yellow-400 mx-auto" /> :
                 i === 1 ? <Medal size={18} className="text-slate-300 mx-auto" /> :
                 i === 2 ? <Medal size={18} className="text-amber-600 mx-auto" /> :
                 <span className="text-slate-500 text-sm">{i + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold text-sm ${entry.username === session.username ? 'text-emerald-400' : 'text-white'}`}>
                    {entry.username}
                    {entry.username === session.username && <span className="text-xs text-slate-400 font-normal ml-1">(you)</span>}
                  </p>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {entry.difficulty}
                  </span>
                </div>
                <p className="text-slate-500 text-xs">Started with {formatCurrency(entry.startingCash)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{formatCurrency(entry.totalValue)}</p>
                <p className={`text-sm font-semibold ${colorForChange(entry.returnPct)}`}>
                  {formatPercent(entry.returnPct)}
                </p>
              </div>
            </div>
          ))}

          {ranked.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500 text-sm">
              No players yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
