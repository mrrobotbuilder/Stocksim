import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import Navbar from '@/app/_components/Navbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar username={session.username} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
