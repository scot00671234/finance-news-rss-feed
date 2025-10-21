import { NextRequest, NextResponse } from 'next/server'
import { financeAPI } from '@/lib/finance-api'
import { financeManager } from '@/lib/finance-manager'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'all'
  const search = searchParams.get('search') || ''
  
  try {
    
    console.log('📊 Fetching finance data:', { type, search })
    
    let data: any[] = []
    let useCache = false
    
    // Check if we have fresh cached data
    if (type !== 'all' && financeManager.isDataFresh(type)) {
      data = financeManager.getFinanceData(type)
      useCache = true
      console.log(`📊 Using cached ${type} data:`, data.length, 'instruments')
    } else {
      // Fetch fresh data
      switch (type) {
        case 'stocks':
          data = await financeAPI.getStocksData()
          financeManager.updateFinanceData('stocks', data)
          break
        case 'indices':
          data = await financeAPI.getIndicesData()
          financeManager.updateFinanceData('indices', data)
          break
        case 'commodities':
          data = await financeAPI.getCommoditiesData()
          financeManager.updateFinanceData('commodities', data)
          break
        case 'forex':
          data = await financeAPI.getForexData()
          financeManager.updateFinanceData('forex', data)
          break
        case 'all':
        default:
          // Get mix of all types
          const [stocks, indices, commodities, forex] = await Promise.all([
            financeAPI.getStocksData(),
            financeAPI.getIndicesData(),
            financeAPI.getCommoditiesData(),
            financeAPI.getForexData()
          ])
          
          // Update manager with individual data
          financeManager.updateFinanceData('stocks', stocks)
          financeManager.updateFinanceData('indices', indices)
          financeManager.updateFinanceData('commodities', commodities)
          financeManager.updateFinanceData('forex', forex)
          
          data = [...stocks.slice(0, 8), ...indices.slice(0, 3), ...commodities.slice(0, 3), ...forex.slice(0, 2)]
          break
      }
    }
    
    // Filter by search query if provided
    if (search) {
      data = data.filter(item => 
        item.symbol.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    console.log(`📈 Retrieved ${data.length} ${type} instruments`)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache-Status': useCache ? 'HIT' : 'MISS',
        'X-Data-Freshness': useCache ? 'CACHED' : 'LIVE'
      }
    })
  } catch (error) {
    console.error('❌ Error fetching finance data:', error)
    
    // Try to return cached data as fallback
    const fallbackData = financeManager.getFinanceData(type)
    if (fallbackData.length > 0) {
      console.log('📊 Returning fallback finance data')
      return NextResponse.json(fallbackData, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache-Status': 'FALLBACK',
          'X-Data-Freshness': 'STALE'
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch finance data' },
      { status: 500 }
    )
  }
}
