import { BookOpen, TrendingUp, BarChart2, PieChart, DollarSign, Shield } from 'lucide-react'

const lessons = [
  {
    icon: DollarSign,
    title: 'What is a Stock?',
    slug: 'what-is-a-stock',
    summary: 'A share of ownership in a company.',
    content: `When you buy a stock, you're buying a small piece of a company. If the company does well and grows, your piece becomes more valuable. If it struggles, your piece loses value.

For example, if Apple has 10 million shares and you own 1, you own one ten-millionth of Apple. You share in both the profits and the losses.

Companies sell stock to raise money to grow their business. Investors buy stock hoping to profit as the company grows.

**Key takeaway:** Stocks = ownership. Your return depends on how the company performs.`,
  },
  {
    icon: TrendingUp,
    title: 'Bull vs Bear Market',
    slug: 'bull-bear-market',
    summary: 'Understanding market cycles.',
    content: `Markets go through cycles. Knowing where you are helps you make smarter decisions.

**Bull Market** — A period of rising prices, typically 20%+ gains. Investors feel confident, companies report strong earnings, and the economy is growing. The 2010–2020 period was largely a bull market.

**Bear Market** — A period of falling prices, typically 20%+ decline. Fear drives selling, unemployment rises, and economic uncertainty spreads. The 2008 crash and 2020 COVID crash were bear markets.

**Why it matters:** During bear markets, even great companies get cheaper. Experienced investors see them as buying opportunities — "be fearful when others are greedy, greedy when others are fearful." — Warren Buffett.`,
  },
  {
    icon: BarChart2,
    title: 'What is a P/E Ratio?',
    slug: 'pe-ratio',
    summary: 'The most common valuation metric.',
    content: `The Price-to-Earnings ratio tells you how much investors are paying for each $1 of a company's profit.

**Formula:** P/E = Stock Price ÷ Annual Earnings Per Share

If a stock costs $100 and earns $5 per share, P/E = 20. You're paying 20x earnings.

**High P/E (e.g. 50+):** Investors expect strong future growth. Common in tech stocks. Riskier — if growth disappoints, the stock can drop hard.

**Low P/E (e.g. under 15):** May indicate an undervalued company, or a struggling one. Common in mature industries.

**Rule of thumb:** Compare P/E to the company's industry average. A P/E of 30 might be cheap for a fast-growing software company but expensive for a utility.`,
  },
  {
    icon: PieChart,
    title: 'Diversification',
    slug: 'diversification',
    summary: "Don't put all your eggs in one basket.",
    content: `Diversification means spreading your money across different investments so that one bad outcome doesn't wipe you out.

**Why it matters:** If you put all your money into one stock and that company goes bankrupt, you lose everything. But if you own 20 stocks, one going to zero only costs you 5% of your portfolio.

**How to diversify:**
- Across sectors: tech, healthcare, finance, consumer goods
- Across sizes: large caps (stable) and small caps (growth potential)
- Across types: stocks, ETFs, bonds

**ETFs** (Exchange-Traded Funds) are a great tool — SPY tracks the entire S&P 500, so one purchase gives you exposure to 500 companies instantly.

**Key rule:** The more concentrated your portfolio, the higher the risk — and potential reward.`,
  },
  {
    icon: Shield,
    title: 'Risk vs Reward',
    slug: 'risk-reward',
    summary: 'Higher potential gains always come with higher risk.',
    content: `Every investment involves a trade-off between risk (chance of loss) and reward (potential gain). Understanding this relationship is fundamental.

**Low risk, lower reward:** Government bonds, blue-chip stocks like Coca-Cola or Johnson & Johnson. Stable but slow-growing.

**Medium risk, medium reward:** S&P 500 index funds. Diversified, ~7-10% historical annual average, but can drop 30-50% in a crash.

**High risk, high reward:** Individual growth stocks, small-cap companies, emerging markets. Can double in a year or lose 80%.

**The trap:** Beginners often chase high returns without understanding the risk. A 100% gain followed by a 50% loss leaves you exactly where you started.

**Key principle:** Only invest in high-risk assets with money you can afford to lose completely.`,
  },
  {
    icon: BookOpen,
    title: 'Market Cap Explained',
    slug: 'market-cap',
    summary: 'How to measure a company\'s size.',
    content: `Market capitalization (market cap) is the total value of all a company's shares. It tells you the company's size and helps you compare companies.

**Formula:** Market Cap = Share Price × Total Shares Outstanding

**Categories:**
- **Mega cap** ($200B+): Apple, Microsoft, Google — very stable, slow growth
- **Large cap** ($10B–$200B): Well-known companies, relatively stable
- **Mid cap** ($2B–$10B): Growing companies, moderate risk
- **Small cap** (under $2B): Smaller, higher growth potential, higher risk
- **Micro/nano cap**: Very small, very risky, easy to manipulate

**Key insight:** Large caps are harder to move — Apple needs billions in buying pressure to move 1%. A small cap can double on one positive news story. That volatility cuts both ways.`,
  },
]

export default function LearnPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Learn</h1>
        <p className="text-slate-400 text-sm">Essential investing concepts explained simply.</p>
      </div>

      <div className="space-y-4">
        {lessons.map(lesson => (
          <details key={lesson.slug} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group">
            <summary className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-slate-800/50 transition-colors list-none">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <lesson.icon size={18} />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white">{lesson.title}</h2>
                <p className="text-slate-400 text-sm">{lesson.summary}</p>
              </div>
              <svg
                className="text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0"
                width="16" height="16" viewBox="0 0 16 16" fill="currentColor"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="px-6 pb-6 pt-2">
              <div className="border-t border-slate-800 pt-4">
                {lesson.content.split('\n\n').map((para, i) => (
                  <p key={i} className="text-slate-300 text-sm leading-relaxed mb-3 last:mb-0">
                    {para.startsWith('**') && para.endsWith('**')
                      ? <strong className="text-white">{para.slice(2, -2)}</strong>
                      : formatParagraph(para)}
                  </p>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

function formatParagraph(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}
