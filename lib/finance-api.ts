// Finance API for stock market data, commodities, forex, and indices
export interface StockPrice {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  high: number
  low: number
  open: number
  previousClose: number
  exchange: string
  sector?: string
  industry?: string
}

export interface CommodityPrice {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  unit: string
  exchange: string
}

export interface ForexPrice {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  baseCurrency: string
  quoteCurrency: string
}

export interface IndexPrice {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  points: number
  exchange: string
}

export type FinancePrice = StockPrice | CommodityPrice | ForexPrice | IndexPrice

// Major stock symbols for ticker
const MAJOR_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
  'JPM', 'BAC', 'WMT', 'PG', 'JNJ', 'V', 'MA', 'HD', 'DIS', 'PYPL'
]

// Major indices
const MAJOR_INDICES = [
  '^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX', '^TNX', '^FVX'
]

// Major commodities
const MAJOR_COMMODITIES = [
  'GC=F', 'SI=F', 'CL=F', 'NG=F', 'PL=F', 'PA=F', 'HG=F', 'ZC=F', 'ZS=F', 'KC=F'
]

// Major forex pairs
const MAJOR_FOREX = [
  'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCHF=X', 'AUDUSD=X', 'USDCAD=X', 'NZDUSD=X'
]

// Rate limiter for API calls
class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async wait(): Promise<void> {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.windowMs - (now - oldestRequest)
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
    
    this.requests.push(now)
  }
}

const rateLimiter = new RateLimiter(5, 60000) // 5 requests per minute

class FinanceAPI {
  private baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart'

  private async makeRequest<T>(url: string): Promise<T> {
    await rateLimiter.wait()
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Finance API request failed:', error)
      throw error
    }
  }

  // Get stock data from Yahoo Finance
  async getStockData(symbol: string): Promise<StockPrice | null> {
    try {
      const url = `${this.baseUrl}/${symbol}`
      const data = await this.makeRequest<any>(url)
      
      if (!data.chart?.result?.[0]) {
        return null
      }
      
      const result = data.chart.result[0]
      const meta = result.meta
      const quote = result.indicators.quote[0]
      
      const currentPrice = meta.regularMarketPrice || meta.previousClose || 0
      const previousClose = meta.previousClose || 0
      const change = currentPrice - previousClose
      const changePercent = previousClose ? (change / previousClose) * 100 : 0
      
      return {
        id: symbol,
        symbol: symbol,
        name: meta.longName || meta.shortName || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: meta.regularMarketVolume || 0,
        marketCap: meta.marketCap || 0,
        high: meta.regularMarketDayHigh || 0,
        low: meta.regularMarketDayLow || 0,
        open: meta.regularMarketOpen || 0,
        previousClose: previousClose,
        exchange: meta.exchangeName || 'NYSE',
        sector: meta.sector,
        industry: meta.industry
      }
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error)
      return null
    }
  }

  // Get multiple stocks data
  async getMultipleStocks(symbols: string[]): Promise<StockPrice[]> {
    const promises = symbols.map(symbol => this.getStockData(symbol))
    const results = await Promise.allSettled(promises)
    
    return results
      .filter((result): result is PromiseFulfilledResult<StockPrice> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
  }

  // Get ticker data (mix of stocks, indices, commodities, forex)
  async getTickerData(): Promise<FinancePrice[]> {
    const tickerData: FinancePrice[] = []
    
    try {
      // Get major stocks (first 8)
      const stocks = await this.getMultipleStocks(MAJOR_STOCKS.slice(0, 8))
      tickerData.push(...stocks)
      
      // Get major indices (first 3)
      const indices = await this.getMultipleStocks(MAJOR_INDICES.slice(0, 3))
      tickerData.push(...indices)
      
      // Get major commodities (first 3)
      const commodities = await this.getMultipleStocks(MAJOR_COMMODITIES.slice(0, 3))
      tickerData.push(...commodities)
      
      // Get major forex (first 2)
      const forex = await this.getMultipleStocks(MAJOR_FOREX.slice(0, 2))
      tickerData.push(...forex)
      
    } catch (error) {
      console.error('Error fetching ticker data:', error)
    }
    
    return tickerData
  }

  // Get specific market data
  async getStocksData(): Promise<StockPrice[]> {
    return this.getMultipleStocks(MAJOR_STOCKS)
  }

  async getIndicesData(): Promise<IndexPrice[]> {
    const indices = await this.getMultipleStocks(MAJOR_INDICES)
    return indices.map(index => ({
      ...index,
      points: index.price,
      exchange: index.exchange
    }))
  }

  async getCommoditiesData(): Promise<CommodityPrice[]> {
    const commodities = await this.getMultipleStocks(MAJOR_COMMODITIES)
    return commodities.map(commodity => ({
      ...commodity,
      unit: this.getCommodityUnit(commodity.symbol),
      exchange: commodity.exchange
    }))
  }

  async getForexData(): Promise<ForexPrice[]> {
    const forex = await this.getMultipleStocks(MAJOR_FOREX)
    return forex.map(pair => ({
      ...pair,
      baseCurrency: pair.symbol.substring(0, 3),
      quoteCurrency: pair.symbol.substring(3, 6),
      exchange: 'FOREX'
    }))
  }

  private getCommodityUnit(symbol: string): string {
    const units: Record<string, string> = {
      'GC=F': 'oz', // Gold
      'SI=F': 'oz', // Silver
      'CL=F': 'barrel', // Crude Oil
      'NG=F': 'MMBtu', // Natural Gas
      'PL=F': 'oz', // Platinum
      'PA=F': 'oz', // Palladium
      'HG=F': 'lb', // Copper
      'ZC=F': 'bushel', // Corn
      'ZS=F': 'bushel', // Soybeans
      'KC=F': 'lb' // Coffee
    }
    return units[symbol] || 'unit'
  }
}

export const financeAPI = new FinanceAPI()

// Utility functions for formatting
export function formatPrice(price: number): string {
  if (price >= 1) {
    return `$${price.toFixed(2)}`
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`
  } else {
    return `$${price.toFixed(6)}`
  }
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
}

export function formatChangePercent(changePercent: number): string {
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(2)}%`
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`
  } else {
    return volume.toString()
  }
}

export function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(1)}T`
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(1)}B`
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(1)}M`
  } else {
    return `$${marketCap.toFixed(0)}`
  }
}
