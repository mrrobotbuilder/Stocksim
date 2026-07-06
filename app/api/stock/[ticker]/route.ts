import { NextRequest, NextResponse } from 'next/server'
import { getStockQuote, getStockChart } from '@/app/lib/stocks'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params
  const range = (request.nextUrl.searchParams.get('range') ?? '3mo') as '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y'

  const [quote, chart] = await Promise.all([
    getStockQuote(ticker),
    getStockChart(ticker, range),
  ])

  if (!quote) return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
  return NextResponse.json({ quote, chart })
}
