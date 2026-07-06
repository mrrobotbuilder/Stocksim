'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'

type Result = { ticker: string; companyName: string; exchange: string; type: string }

export default function StockSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 1) { setResults([]); return }
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        setResults(await res.json())
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search stocks by name or ticker (e.g. Apple, TSLA)..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
        />
        {loading && <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.map(r => (
            <button
              key={r.ticker}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left"
              onClick={() => {
                setOpen(false)
                setQuery('')
                router.push(`/stock/${r.ticker}`)
              }}
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {r.ticker.slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{r.ticker}</p>
                <p className="text-slate-400 text-xs truncate">{r.companyName}</p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{r.exchange}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
