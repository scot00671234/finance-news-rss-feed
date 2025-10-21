import { NextRequest, NextResponse } from 'next/server'
import { financeAPI } from '@/lib/finance-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'all'
    const type = searchParams.get('type') || 'all'
    const search = searchParams.get('search') || ''
    
    console.log('📊 Finance Unified API request:', { action, type, search })
    
    let result: any = {}
    
    switch (action) {
      case 'all':
        // Get all finance data
        const allData = await financeAPI.getTickerData()
        result.financeData = allData
        result.lastUpdate = new Date()
        break
        
      case 'stocks':
        const stocksData = await financeAPI.getStocksData()
        result.stocksData = stocksData
        result.lastUpdate = new Date()
        break
        
      case 'indices':
        const indicesData = await financeAPI.getIndicesData()
        result.indicesData = indicesData
        result.lastUpdate = new Date()
        break
        
      case 'commodities':
        const commoditiesData = await financeAPI.getCommoditiesData()
        result.commoditiesData = commoditiesData
        result.lastUpdate = new Date()
        break
        
      case 'forex':
        const forexData = await financeAPI.getForexData()
        result.forexData = forexData
        result.lastUpdate = new Date()
        break
        
      case 'ticker':
        // Get ticker data (mix of all types)
        const tickerData = await financeAPI.getTickerData()
        result.tickerData = tickerData
        result.lastUpdate = new Date()
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache-Status': 'MISS',
        'X-Data-Freshness': 'LIVE'
      }
    })
  } catch (error) {
    console.error('❌ Error in finance unified API:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch finance data' },
      { status: 500 }
    )
  }
}
