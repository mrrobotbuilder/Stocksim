import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/db'
import { formatCurrency, bgColorForChange } from '@/app/lib/format'
import Link from 'next/link'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default async function PortfolioPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.userId },
    include: {
      transactions: { orderBy: { createdAt: 'desc' }, take: 100 },
    },
  })
  if (!portfolio) redirect('/login')

  const transactions = portfolio.transactions

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Portfolio</h1>
        <p className="text-slate-400 text-sm">Your complete transaction history.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-white">Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500 text-sm">
            No transactions yet.{' '}
            <Link href="/market" className="text-emerald-400 hover:text-emerald-300">
              Make your first trade →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {transactions.map(tx => (
              <div key={tx.id} className="px-6 py-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx.type === 'BUY' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                }`}>
                  {tx.type === 'BUY'
                    ? <ArrowUpRight size={16} className="text-emerald-400" />
                    : <ArrowDownLeft size={16} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/stock/${tx.ticker}`} className="font-semibold text-white hover:text-emerald-400 text-sm">
                      {tx.ticker}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tx.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    {tx.shares.toFixed(4)} shares @ {formatCurrency(tx.pricePerShare)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">{formatCurrency(tx.total)}</p>
                  <p className="text-slate-500 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
