import { NextRequest, NextResponse } from 'next/server'
import { financeAPI } from '@/lib/finance-api'
import { financeManager } from '@/lib/finance-manager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cacheBust = searchParams.get('t')
    
    // For real-time pricing, always bypass cache when cache busting is requested
    if (cacheBust) {
      console.log('📊 Real-time finance ticker data requested - bypassing all caches')
      
      // Always fetch fresh data from API for real-time data
      const freshTickerData = await financeAPI.getTickerData()
      
      // Update the manager with fresh data
      financeManager.updateFinanceData('ticker', freshTickerData)
      
      return NextResponse.json(freshTickerData, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Cache-Status': 'REAL-TIME',
          'X-Data-Freshness': 'LIVE'
        }
      })
    }
    
    // Check if we have fresh data in the manager
    const cachedTickerData = financeManager.getTickerData()
    const isStocksFresh = financeManager.isDataFresh('stocks')
    const isIndicesFresh = financeManager.isDataFresh('indices')
    const isCommoditiesFresh = financeManager.isDataFresh('commodities')
    const isForexFresh = financeManager.isDataFresh('forex')
    
    // If all data is fresh, return cached data
    if (isStocksFresh && isIndicesFresh && isCommoditiesFresh && isForexFresh && cachedTickerData.length > 0) {
      console.log('📊 Returning cached finance ticker data')
      return NextResponse.json(cachedTickerData, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache-Status': 'HIT',
          'X-Data-Freshness': 'CACHED'
        }
      })
    }
    
    // Fetch fresh data
    console.log('📊 Fetching fresh finance ticker data')
    const tickerData = await financeAPI.getTickerData()
    
    // Update the manager with fresh data
    financeManager.updateFinanceData('ticker', tickerData)
    
    return NextResponse.json(tickerData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache-Status': 'MISS',
        'X-Data-Freshness': 'LIVE'
      }
    })
  } catch (error) {
    console.error('❌ Error fetching finance ticker data:', error)
    
    // Try to return cached data as fallback
    const fallbackData = financeManager.getTickerData()
    if (fallbackData.length > 0) {
      console.log('📊 Returning fallback finance ticker data')
      return NextResponse.json(fallbackData, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache-Status': 'FALLBACK',
          'X-Data-Freshness': 'STALE'
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch finance ticker data' },
      { status: 500 }
    )
  }
}
