'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, LayoutDashboard, Search, Briefcase, BookOpen, Trophy, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard', icon: LayoutDashboard },
  { href: '/market',     label: 'Market',    icon: Search },
  { href: '/portfolio',  label: 'Portfolio', icon: Briefcase },
  { href: '/learn',      label: 'Learn',     icon: BookOpen },
  { href: '/leaderboard',label: 'Leaders',   icon: Trophy },
]

export default function Navbar({ username }: { username: string }) {
  const pathname = usePathname()

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold text-white">
            <TrendingUp className="text-emerald-400" size={20} />
            <span className="hidden sm:block">StockSim</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon size={15} />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm hidden sm:block">
            {username}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
