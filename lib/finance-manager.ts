// Finance data manager for caching and managing finance data
import { FinancePrice } from '@/lib/finance-api'

class FinanceManager {
  private data: Map<string, FinancePrice[]> = new Map()
  private lastUpdate: Map<string, number> = new Map()
  private cacheTimeout = 2 * 60 * 1000 // 2 minutes for more real-time updates

  // Update finance data for a specific type
  updateFinanceData(type: string, data: FinancePrice[]) {
    this.data.set(type, data)
    this.lastUpdate.set(type, Date.now())
    console.log(`Finance data updated for ${type}:`, data.length, 'instruments')
  }

  // Get finance data for a specific type
  getFinanceData(type: string): FinancePrice[] {
    const data = this.data.get(type) || []
    const lastUpdate = this.lastUpdate.get(type) || 0
    const isStale = Date.now() - lastUpdate > this.cacheTimeout

    if (isStale) {
      console.log(`Finance data for ${type} is stale, consider refreshing`)
    }

    return data
  }

  // Get all finance data
  getAllFinanceData(): FinancePrice[] {
    const allData: FinancePrice[] = []
    for (const [type, data] of this.data.entries()) {
      allData.push(...data)
    }
    return allData
  }

  // Get ticker data (mix of all types)
  getTickerData(): FinancePrice[] {
    const tickerData: FinancePrice[] = []
    
    // Get stocks (first 8)
    const stocks = this.getFinanceData('stocks').slice(0, 8)
    tickerData.push(...stocks)
    
    // Get indices (first 3)
    const indices = this.getFinanceData('indices').slice(0, 3)
    tickerData.push(...indices)
    
    // Get commodities (first 3)
    const commodities = this.getFinanceData('commodities').slice(0, 3)
    tickerData.push(...commodities)
    
    // Get forex (first 2)
    const forex = this.getFinanceData('forex').slice(0, 2)
    tickerData.push(...forex)
    
    return tickerData
  }

  // Check if data is fresh
  isDataFresh(type: string): boolean {
    const lastUpdate = this.lastUpdate.get(type) || 0
    return Date.now() - lastUpdate < this.cacheTimeout
  }

  // Get last update time
  getLastUpdate(type: string): Date | null {
    const timestamp = this.lastUpdate.get(type)
    return timestamp ? new Date(timestamp) : null
  }

  // Clear all data
  clearAll() {
    this.data.clear()
    this.lastUpdate.clear()
    console.log('All finance data cleared')
  }

  // Clear specific type
  clearType(type: string) {
    this.data.delete(type)
    this.lastUpdate.delete(type)
    console.log(`Finance data cleared for ${type}`)
  }

  // Get cache status
  getCacheStatus() {
    const status: Record<string, any> = {}
    for (const [type, data] of this.data.entries()) {
      const lastUpdate = this.lastUpdate.get(type)
      status[type] = {
        count: data.length,
        lastUpdate: lastUpdate ? new Date(lastUpdate) : null,
        isFresh: this.isDataFresh(type)
      }
    }
    return status
  }
}

export const financeManager = new FinanceManager()
