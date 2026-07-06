'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { DIFFICULTY_CONFIG, type Difficulty } from '@/app/lib/definitions'
import { getStockQuote } from '@/app/lib/stocks'

export async function buyStock(ticker: string, shares: number) {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated.' }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.userId },
    include: { holdings: true },
  })
  if (!portfolio) return { error: 'Portfolio not found.' }

  const quote = await getStockQuote(ticker)
  if (!quote) return { error: 'Could not fetch stock price.' }

  const cost = quote.price * shares
  if (cost > portfolio.cashBalance) return { error: 'Insufficient funds.' }
  if (shares <= 0) return { error: 'Shares must be positive.' }

  const existingHolding = portfolio.holdings.find(h => h.ticker === ticker)

  await prisma.$transaction(async (tx) => {
    if (existingHolding) {
      const newShares = existingHolding.shares + shares
      const newAvg = (existingHolding.avgCostBasis * existingHolding.shares + cost) / newShares
      await tx.holding.update({
        where: { id: existingHolding.id },
        data: { shares: newShares, avgCostBasis: newAvg },
      })
    } else {
      await tx.holding.create({
        data: {
          portfolioId: portfolio.id,
          ticker,
          companyName: quote.companyName,
          shares,
          avgCostBasis: quote.price,
        },
      })
    }

    await tx.portfolio.update({
      where: { id: portfolio.id },
      data: { cashBalance: { decrement: cost } },
    })

    await tx.transaction.create({
      data: {
        portfolioId: portfolio.id,
        ticker,
        companyName: quote.companyName,
        type: 'BUY',
        shares,
        pricePerShare: quote.price,
        total: cost,
      },
    })
  })

  revalidatePath('/dashboard')
  revalidatePath(`/stock/${ticker}`)
  revalidatePath('/portfolio')
  return { success: true }
}

export async function sellStock(ticker: string, shares: number) {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated.' }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.userId },
    include: { holdings: true },
  })
  if (!portfolio) return { error: 'Portfolio not found.' }

  const holding = portfolio.holdings.find(h => h.ticker === ticker)
  if (!holding) return { error: 'You do not own this stock.' }
  if (shares > holding.shares) return { error: `You only own ${holding.shares} shares.` }
  if (shares <= 0) return { error: 'Shares must be positive.' }

  const quote = await getStockQuote(ticker)
  if (!quote) return { error: 'Could not fetch stock price.' }

  const proceeds = quote.price * shares

  await prisma.$transaction(async (tx) => {
    const newShares = holding.shares - shares
    if (newShares < 0.0001) {
      await tx.holding.delete({ where: { id: holding.id } })
    } else {
      await tx.holding.update({
        where: { id: holding.id },
        data: { shares: newShares },
      })
    }

    await tx.portfolio.update({
      where: { id: portfolio.id },
      data: { cashBalance: { increment: proceeds } },
    })

    await tx.transaction.create({
      data: {
        portfolioId: portfolio.id,
        ticker,
        companyName: holding.companyName,
        type: 'SELL',
        shares,
        pricePerShare: quote.price,
        total: proceeds,
      },
    })
  })

  revalidatePath('/dashboard')
  revalidatePath(`/stock/${ticker}`)
  revalidatePath('/portfolio')
  return { success: true }
}

export async function resetPortfolio() {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated.' }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.userId },
  })
  if (!portfolio) return { error: 'Portfolio not found.' }

  const config = DIFFICULTY_CONFIG[portfolio.difficulty as Difficulty]

  await prisma.$transaction(async (tx) => {
    await tx.holding.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.transaction.deleteMany({ where: { portfolioId: portfolio.id } })
    await tx.portfolio.update({
      where: { id: portfolio.id },
      data: {
        cashBalance: config.startingCash,
        resetCount: { increment: 1 },
      },
    })
  })

  revalidatePath('/dashboard')
  revalidatePath('/portfolio')
  return { success: true }
}
