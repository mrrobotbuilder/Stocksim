'use client'

import { useTransition } from 'react'
import { resetPortfolio } from '@/app/actions/trade'
import { RefreshCw } from 'lucide-react'

export default function ResetButton() {
  const [pending, startTransition] = useTransition()

  function handleReset() {
    if (!confirm('Reset your portfolio? All holdings and history will be wiped and you will start over.')) return
    startTransition(async () => {
      await resetPortfolio()
    })
  }

  return (
    <button
      onClick={handleReset}
      disabled={pending}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
    >
      <RefreshCw size={14} className={pending ? 'animate-spin' : ''} />
      {pending ? 'Resetting...' : 'Reset Portfolio'}
    </button>
  )
}
