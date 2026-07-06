import Link from 'next/link'
import { TrendingUp, BookOpen, Shield, BarChart2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-slate-200">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <TrendingUp className="text-emerald-400" size={24} />
          StockSim
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors font-medium">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-2 rounded-full mb-6">
          <Shield size={14} />
          100% Risk-Free — No Real Money
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Learn to invest<br />
          <span className="text-emerald-400">before you invest.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Trade real stocks with virtual money. Build your skills, make mistakes safely,
          and gain the confidence to invest the real thing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold text-lg transition-colors">
            Start Trading for Free
          </Link>
          <Link href="/learn" className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl font-semibold text-lg transition-colors">
            Learn the Basics
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Choose Your Difficulty', desc: 'Start with $1K (Easy), $10K (Medium), or $100K (Hard). Each level challenges you differently.' },
            { step: '2', title: 'Trade Real Stocks', desc: 'Search and trade any real company on the market — Apple, Tesla, S&P 500 ETFs, and thousands more.' },
            { step: '3', title: 'Learn From Results', desc: 'Watch your portfolio grow or shrink. When you go bankrupt, reset and apply what you learned.' },
          ].map(item => (
            <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: BarChart2, title: 'Real Market Data', desc: 'Live prices, charts, and company data — the same info professional investors use.' },
            { icon: BookOpen, title: 'Built-in Education', desc: 'Every financial term explained. Learn what P/E ratio, market cap, and dividends actually mean.' },
            { icon: TrendingUp, title: 'Portfolio Analytics', desc: 'Track your gains, losses, and overall return over time with detailed charts.' },
            { icon: Shield, title: 'Safe to Fail', desc: 'Make bold moves, risky bets, and learn hard lessons — without losing a single real dollar.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start learning?</h2>
          <p className="text-slate-400 mb-8">Join thousands of young investors building their financial skills.</p>
          <Link href="/register" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold text-lg transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        StockSim — Educational use only. Not financial advice.
      </footer>
    </main>
  )
}
