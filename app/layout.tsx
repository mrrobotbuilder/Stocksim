import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StockSim — Learn to Invest Risk-Free',
  description: 'A paper trading simulator to learn investing with real stocks and no real money.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0f1e] text-slate-200">
        {children}
      </body>
    </html>
  )
}
