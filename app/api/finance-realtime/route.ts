import { NextResponse } from 'next/server'
import { financeAPI } from '@/lib/finance-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('📊 Real-time finance prices requested - bypassing all caches')
    
    // Always fetch fresh data from API - no caching at all
    const freshPrices = await financeAPI.getTickerData()
    
    return NextResponse.json(freshPrices, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Cache-Status': 'REAL-TIME',
        'X-Data-Freshness': 'LIVE',
        'X-API-Version': 'realtime-v1'
      }
    })
  } catch (error) {
    console.error('❌ Error fetching real-time finance prices:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch real-time finance prices' }, 
      { status: 500 }
    )
  }
}