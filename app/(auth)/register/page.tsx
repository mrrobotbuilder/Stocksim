'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { register } from '@/app/actions/auth'

const difficulties = [
  { value: 'easy',   label: 'Easy',   cash: '$1,000',   desc: 'Best for beginners' },
  { value: 'medium', label: 'Medium', cash: '$10,000',  desc: 'Standard experience' },
  { value: 'hard',   label: 'Hard',   cash: '$100,000', desc: 'For the ambitious' },
]

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white">
            <TrendingUp className="text-emerald-400" size={24} />
            StockSim
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Create your free account</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <form action={action} className="space-y-5">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {state.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Choose Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((d, i) => (
                  <label key={d.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={d.value}
                      defaultChecked={i === 1}
                      className="sr-only peer"
                    />
                    <div className="border border-slate-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 rounded-xl p-3 text-center transition-all">
                      <div className="font-semibold text-white text-sm">{d.label}</div>
                      <div className="text-emerald-400 text-sm font-mono">{d.cash}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{d.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              {pending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
