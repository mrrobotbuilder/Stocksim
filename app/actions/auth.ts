'use server'

import { hash, compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/db'
import { createSession, deleteSession } from '@/app/lib/session'
import { DIFFICULTY_CONFIG, type Difficulty } from '@/app/lib/definitions'

type AuthState = { error: string } | undefined

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const username = (formData.get('username') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const difficulty = (formData.get('difficulty') as Difficulty) ?? 'medium'

  if (!username || !email || !password) return { error: 'All fields are required.' }
  if (username.length < 3) return { error: 'Username must be at least 3 characters.' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) return { error: 'Invalid difficulty.' }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  })
  if (existing) return { error: 'Username or email already taken.' }

  const passwordHash = await hash(password, 12)
  const { startingCash } = DIFFICULTY_CONFIG[difficulty]

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      portfolio: {
        create: {
          cashBalance: startingCash,
          startingCash,
          difficulty,
        },
      },
    },
  })

  await createSession(user.id, user.username)
  redirect('/dashboard')
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = (formData.get('identifier') as string)?.trim()
  const password = formData.get('password') as string

  if (!identifier || !password) return { error: 'All fields are required.' }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier.toLowerCase() }, { username: identifier }] },
  })
  if (!user) return { error: 'Invalid credentials.' }

  const valid = await compare(password, user.passwordHash)
  if (!valid) return { error: 'Invalid credentials.' }

  await createSession(user.id, user.username)
  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
