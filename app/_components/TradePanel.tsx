'use client'

import { useState, useTransition } from 'react'
import { buyStock, sellStock } from '@/app/actions/trade'
import { formatCurrency } from '@/app/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

type Props = {
  ticker: string
  price: number
  companyName: string
  cashBalance: number
  holding: { shares: number; avgCostBasis: number } | null
}

export default function TradePanel({ ticker, price, companyName, cashBalance, holding }: Props) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [shares, setShares] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  const sharesNum = parseFloat(shares) || 0
  const total = sharesNum * price
  const maxBuyShares = Math.floor((cashBalance / price) * 10000) / 10000

  function handleSubmit() {
    if (sharesNum <= 0) return setMessage({ type: 'error', text: 'Enter a valid number of shares.' })
    setMessage(null)

    startTransition(async () => {
      const result = tab === 'buy'
        ? await buyStock(ticker, sharesNum)
        : await sellStock(ticker, sharesNum)

      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: `${tab === 'buy' ? 'Bought' : 'Sold'} ${sharesNum} shares of ${ticker}!` })
        setShares('')
      }
    })
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-20">
      <h3 className="font-semibold text-white">Trade {ticker}</h3>

      {/* Tab */}
      <div className="flex rounded-lg bg-slate-800 p-0.5 gap-0.5">
        <button
          onClick={() => setTab('buy')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'buy' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp size={14} /> Buy
        </button>
        <button
          onClick={() => setTab('sell')}
          disabled={!holding}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-30 ${
            tab === 'sell' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingDown size={14} /> Sell
        </button>
      </div>

      {/* Current holding info */}
      {holding && (
        <div className="bg-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>You own</span>
            <span className="text-white font-medium">{holding.shares.toFixed(4)} shares</span>
          </div>
          <div className="flex justify-between">
            <span>Avg cost</span>
            <span className="text-white font-medium">{formatCurrency(holding.avgCostBasis)}</span>
          </div>
          <div className="flex justify-between">
            <span>Current value</span>
            <span className="text-white font-medium">{formatCurrency(holding.shares * price)}</span>
          </div>
        </div>
      )}

      {/* Price info */}
      <div className="flex justify-between text-sm text-slate-400">
        <span>Market price</span>
        <span className="text-white font-semibold">{formatCurrency(price)}</span>
      </div>

      {/* Input */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Number of Shares</label>
        <input
          type="number"
          min="0"
          step="0.0001"
          value={shares}
          onChange={e => setShares(e.target.value)}
          placeholder="e.g. 5"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
        />
        {tab === 'buy' && (
          <button
            onClick={() => setShares(maxBuyShares.toString())}
            className="text-xs text-emerald-400 mt-1 hover:text-emerald-300"
          >
            Max: {maxBuyShares} shares
          </button>
        )}
        {tab === 'sell' && holding && (
          <button
            onClick={() => setShares(holding.shares.toString())}
            className="text-xs text-emerald-400 mt-1 hover:text-emerald-300"
          >
            Sell all: {holding.shares} shares
          </button>
        )}
      </div>

      {/* Cost estimate */}
      {sharesNum > 0 && (
        <div className="bg-slate-800 rounded-xl p-3 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>{tab === 'buy' ? 'Estimated cost' : 'Estimated proceeds'}</span>
            <span className="text-white font-semibold">{formatCurrency(total)}</span>
          </div>
          {tab === 'buy' && (
            <div className="flex justify-between text-slate-400 text-xs mt-1">
              <span>Cash after</span>
              <span className={cashBalance - total < 0 ? 'text-red-400' : 'text-white'}>
                {formatCurrency(cashBalance - total)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`text-sm px-3 py-2 rounded-lg ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Cash balance */}
      <div className="text-xs text-slate-500 text-center">
        Available: {formatCurrency(cashBalance)}
      </div>

      <button
        onClick={handleSubmit}
        disabled={pending || sharesNum <= 0}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 ${
          tab === 'buy'
            ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
            : 'bg-red-500 hover:bg-red-400 text-white'
        }`}
      >
        {pending ? 'Processing...' : tab === 'buy' ? `Buy ${ticker}` : `Sell ${ticker}`}
      </button>
    </div>
  )
}
