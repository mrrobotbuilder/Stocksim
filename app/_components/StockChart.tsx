'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { ChartPoint } from '@/app/lib/stocks'
import { formatCurrency } from '@/app/lib/format'

const RANGES = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '5y'] as const

function formatDate(iso: string, range: string): string {
  const d = new Date(iso)
  if (range === '1d') return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (range === '5d') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function StockChart({ data, ticker, range }: {
  data: ChartPoint[]
  ticker: string
  range: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const first = data[0]?.close ?? 0
  const last  = data[data.length - 1]?.close ?? 0
  const isUp  = last >= first
  const color = isUp ? '#10b981' : '#ef4444'

  const chartData = data.map(p => ({
    date: formatDate(p.date, range),
    price: p.close,
    fullDate: p.date,
  }))

  function setRange(r: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('range', r)
    router.replace(`/stock/${ticker}?${params.toString()}`)
  }

  const minPrice = Math.min(...data.map(p => p.close)) * 0.995
  const maxPrice = Math.max(...data.map(p => p.close)) * 1.005

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* Range selector */}
      <div className="flex gap-1 mb-4">
        {RANGES.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              range === r
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          No chart data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `$${v.toFixed(0)}`}
              width={55}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8', fontSize: 11 }}
              formatter={(value) => [formatCurrency(Number(value)), 'Price']}
              itemStyle={{ color: color }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#colorGrad)"
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
