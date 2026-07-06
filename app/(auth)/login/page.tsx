'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
            <TrendingUp className="text-emerald-400" size={24} />
            StockSim
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Username or Email
              </label>
              <input
                name="identifier"
                type="text"
                required
                autoComplete="username"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              {pending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            No account?{' '}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
