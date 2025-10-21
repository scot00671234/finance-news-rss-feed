// Intelligent category detection based on article content
export interface CategoryScore {
  category: string
  score: number
  keywords: string[]
}

export interface DetectedCategories {
  primary: string
  secondary: string[]
  confidence: number
}

// Category keywords and their weights (matching database enum values)
const CATEGORY_KEYWORDS = {
  STOCKS: {
    keywords: [
      'stocks', 'stock market', 'equity', 'shares', 'trading', 'nasdaq', 'nyse',
      'apple', 'microsoft', 'google', 'amazon', 'tesla', 'meta', 'netflix',
      'nvidia', 'berkshire', 'johnson', 'jpmorgan', 'bank of america',
      'earnings', 'dividend', 'ipo', 'merger', 'acquisition', 'analyst',
      'price target', 'upgrade', 'downgrade', 'bullish', 'bearish'
    ],
    weight: 1.0
  },
  COMMODITIES: {
    keywords: [
      'gold', 'silver', 'oil', 'crude oil', 'natural gas', 'copper', 'aluminum',
      'wheat', 'corn', 'soybeans', 'coffee', 'sugar', 'cotton', 'cattle',
      'commodities', 'futures', 'spot price', 'precious metals', 'energy',
      'agriculture', 'industrial metals', 'soft commodities'
    ],
    weight: 1.0
  },
  FOREX: {
    keywords: [
      'forex', 'currency', 'exchange rate', 'usd', 'eur', 'gbp', 'jpy', 'cad',
      'aud', 'chf', 'cny', 'inr', 'brazil real', 'mexican peso', 'euro',
      'dollar', 'yen', 'pound', 'franc', 'yuan', 'rupee', 'fx trading',
      'currency pair', 'central bank', 'interest rate differential'
    ],
    weight: 1.0
  },
  BONDS: {
    keywords: [
      'bonds', 'treasury', 'treasury bond', 'treasury bill', 'treasury note',
      'corporate bond', 'municipal bond', 'government bond', 'yield',
      'bond market', 'fixed income', 'credit rating', 'maturity', 'coupon',
      'federal reserve', 'fed funds rate', 'interest rates', 'inflation'
    ],
    weight: 1.0
  },
  INDICES: {
    keywords: [
      's&p 500', 'sp500', 'dow jones', 'nasdaq', 'russell 2000', 'ftse',
      'nikkei', 'dax', 'cac', 'hang seng', 'index', 'indices', 'etf',
      'market index', 'benchmark', 'market cap', 'weighted average'
    ],
    weight: 1.0
  },
  ETFS: {
    keywords: [
      'etf', 'etfs', 'exchange traded fund', 'spdr', 'ishares', 'vanguard',
      'invesco', 'ark', 'qqq', 'spy', 'dia', 'vti', 'voo', 'sector etf',
      'bond etf', 'commodity etf', 'international etf', 'dividend etf'
    ],
    weight: 1.0
  },
  CRYPTO: {
    keywords: [
      'bitcoin', 'btc', 'ethereum', 'eth', 'cryptocurrency', 'crypto',
      'altcoin', 'altcoins', 'defi', 'nft', 'blockchain', 'digital currency',
      'binance', 'coinbase', 'crypto trading', 'crypto market', 'crypto news'
    ],
    weight: 0.8
  },
  ECONOMICS: {
    keywords: [
      'gdp', 'inflation', 'unemployment', 'federal reserve', 'fed', 'interest rates',
      'monetary policy', 'fiscal policy', 'economic growth', 'recession',
      'economic data', 'consumer price index', 'cpi', 'ppi', 'retail sales',
      'manufacturing', 'employment', 'wage growth', 'productivity'
    ],
    weight: 1.0
  },
  MARKETS: {
    keywords: [
      'market', 'markets', 'trading', 'investing', 'investment', 'portfolio',
      'asset allocation', 'market analysis', 'market outlook', 'bull market',
      'bear market', 'volatility', 'liquidity', 'market sentiment'
    ],
    weight: 0.7
  },
  TECHNOLOGY: {
    keywords: [
      'technology', 'tech', 'artificial intelligence', 'ai', 'machine learning',
      'cloud computing', 'software', 'hardware', 'semiconductor', 'chip',
      'cybersecurity', 'fintech', 'digital transformation', 'innovation'
    ],
    weight: 0.8
  },
  ENERGY: {
    keywords: [
      'energy', 'oil', 'gas', 'renewable energy', 'solar', 'wind', 'nuclear',
      'coal', 'electricity', 'power', 'utilities', 'energy sector',
      'clean energy', 'green energy', 'fossil fuels'
    ],
    weight: 1.0
  },
  HEALTHCARE: {
    keywords: [
      'healthcare', 'pharmaceutical', 'biotech', 'medical', 'drug', 'medicine',
      'fda', 'clinical trial', 'health insurance', 'medical device',
      'healthcare sector', 'biotechnology', 'pharma'
    ],
    weight: 1.0
  },
  FINANCIAL_SERVICES: {
    keywords: [
      'banking', 'bank', 'financial services', 'insurance', 'credit', 'loan',
      'mortgage', 'investment banking', 'wealth management', 'asset management',
      'hedge fund', 'private equity', 'venture capital', 'fintech'
    ],
    weight: 1.0
  },
  REAL_ESTATE: {
    keywords: [
      'real estate', 'property', 'housing', 'mortgage', 'reit', 'commercial real estate',
      'residential real estate', 'real estate investment', 'property market',
      'construction', 'home sales', 'rental market'
    ],
    weight: 1.0
  },
  CONSUMER_GOODS: {
    keywords: [
      'consumer goods', 'retail', 'consumer spending', 'retail sales',
      'consumer staples', 'consumer discretionary', 'brand', 'retailer',
      'e-commerce', 'online shopping', 'consumer confidence'
    ],
    weight: 1.0
  },
  INDUSTRIALS: {
    keywords: [
      'industrial', 'manufacturing', 'aerospace', 'defense', 'transportation',
      'logistics', 'infrastructure', 'construction', 'machinery', 'equipment',
      'industrial sector', 'supply chain', 'automotive'
    ],
    weight: 1.0
  }
}

// Special patterns that override category detection
const SPECIAL_PATTERNS = {
  stock_specific: {
    patterns: [
      /apple|aapl/i, /microsoft|msft/i, /google|googl/i, /amazon|amzn/i,
      /tesla|tsla/i, /meta|fb/i, /netflix|nflx/i, /nvidia|nvda/i,
      /nasdaq|nyse|dow jones|s&p 500/i
    ],
    category: 'STOCKS',
    weight: 2.0
  },
  crypto_specific: {
    patterns: [
      /bitcoin|btc/i, /ethereum|eth/i, /cryptocurrency|crypto/i,
      /blockchain|defi|nft/i, /binance|coinbase/i
    ],
    category: 'CRYPTO',
    weight: 1.5
  },
  economic_indicators: {
    patterns: [
      /gdp|inflation|unemployment|federal reserve|fed/i,
      /interest rates|monetary policy|fiscal policy/i,
      /consumer price index|cpi|ppi|retail sales/i
    ],
    category: 'ECONOMICS',
    weight: 2.0
  },
  market_analysis: {
    patterns: [
      /market analysis|market outlook|bull market|bear market/i,
      /volatility|liquidity|market sentiment|trading/i
    ],
    category: 'MARKETS',
    weight: 1.5
  }
}

export function detectArticleCategories(
  title: string,
  description: string,
  content?: string
): DetectedCategories {
  const text = `${title} ${description} ${content || ''}`.toLowerCase()
  
  // Calculate scores for each category
  const categoryScores: CategoryScore[] = []
  
  for (const [categoryName, config] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0
    const matchedKeywords: string[] = []
    
    for (const keyword of config.keywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        score += matches.length * config.weight
        matchedKeywords.push(keyword)
      }
    }
    
    if (score > 0) {
      categoryScores.push({
        category: categoryName,
        score,
        keywords: matchedKeywords
      })
    }
  }
  
  // Apply special pattern overrides
  for (const [patternName, config] of Object.entries(SPECIAL_PATTERNS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(text)) {
        const existingIndex = categoryScores.findIndex(cs => cs.category === config.category)
        if (existingIndex >= 0) {
          categoryScores[existingIndex].score *= config.weight
        } else {
          categoryScores.push({
            category: config.category,
            score: config.weight,
            keywords: [`${patternName} pattern`]
          })
        }
      }
    }
  }
  
  // Sort by score (highest first)
  categoryScores.sort((a, b) => b.score - a.score)
  
  // Determine primary and secondary categories
  const primary = categoryScores.length > 0 ? categoryScores[0].category : 'MARKETS'
  const secondary = categoryScores.slice(1, 3).map(cs => cs.category)
  
  // Calculate confidence based on score distribution
  const totalScore = categoryScores.reduce((sum, cs) => sum + cs.score, 0)
  const primaryScore = categoryScores[0]?.score || 0
  const confidence = totalScore > 0 ? Math.min(primaryScore / totalScore, 1) : 0.5
  
  return {
    primary,
    secondary,
    confidence: Math.round(confidence * 100) / 100
  }
}

// Helper function to get category display name
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    STOCKS: 'Stocks',
    COMMODITIES: 'Commodities',
    FOREX: 'Forex',
    BONDS: 'Bonds',
    INDICES: 'Indices',
    ETFS: 'ETFs',
    CRYPTO: 'Crypto',
    ECONOMICS: 'Economics',
    MARKETS: 'Markets',
    TECHNOLOGY: 'Technology',
    ENERGY: 'Energy',
    HEALTHCARE: 'Healthcare',
    FINANCIAL_SERVICES: 'Financial Services',
    REAL_ESTATE: 'Real Estate',
    CONSUMER_GOODS: 'Consumer Goods',
    INDUSTRIALS: 'Industrials'
  }
  
  return displayNames[category.toUpperCase()] || category.toUpperCase()
}

// Helper function to get category color
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    STOCKS: 'bg-blue-500',
    COMMODITIES: 'bg-yellow-500',
    FOREX: 'bg-green-500',
    BONDS: 'bg-purple-500',
    INDICES: 'bg-indigo-500',
    ETFS: 'bg-cyan-500',
    CRYPTO: 'bg-orange-500',
    ECONOMICS: 'bg-gray-500',
    MARKETS: 'bg-slate-500',
    TECHNOLOGY: 'bg-pink-500',
    ENERGY: 'bg-red-500',
    HEALTHCARE: 'bg-emerald-500',
    FINANCIAL_SERVICES: 'bg-amber-500',
    REAL_ESTATE: 'bg-teal-500',
    CONSUMER_GOODS: 'bg-rose-500',
    INDUSTRIALS: 'bg-violet-500'
  }
  
  return colors[category.toUpperCase()] || 'bg-gray-500'
}
