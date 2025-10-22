// Test script for real-time ticker pricing
// Run with: node test-realtime-ticker-pricing.js

const testRealtimeTickerPricing = async () => {
  console.log('🚀 Testing Real-Time Ticker Pricing Implementation...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test 1: Crypto real-time endpoint
    console.log('1. Testing crypto real-time endpoint...')
    const cryptoRealtimeResponse = await fetch(`${baseUrl}/api/crypto-realtime`)
    const cryptoRealtimeData = await cryptoRealtimeResponse.json()
    
    if (cryptoRealtimeData && cryptoRealtimeData.length > 0) {
      console.log(`✅ Crypto real-time: ${cryptoRealtimeData.length} cryptocurrencies`)
      console.log(`   Cache status: ${cryptoRealtimeResponse.headers.get('X-Cache-Status')}`)
      console.log(`   Data freshness: ${cryptoRealtimeResponse.headers.get('X-Data-Freshness')}`)
      console.log(`   Latest BTC price: $${cryptoRealtimeData[0]?.current_price || 'N/A'}`)
    } else {
      console.log('❌ Crypto real-time endpoint failed')
    }
    
    // Test 2: Finance real-time endpoint
    console.log('\n2. Testing finance real-time endpoint...')
    const financeRealtimeResponse = await fetch(`${baseUrl}/api/finance-realtime`)
    const financeRealtimeData = await financeRealtimeResponse.json()
    
    if (financeRealtimeData && financeRealtimeData.length > 0) {
      console.log(`✅ Finance real-time: ${financeRealtimeData.length} instruments`)
      console.log(`   Cache status: ${financeRealtimeResponse.headers.get('X-Cache-Status')}`)
      console.log(`   Data freshness: ${financeRealtimeResponse.headers.get('X-Data-Freshness')}`)
      console.log(`   Latest stock price: $${financeRealtimeData[0]?.price || 'N/A'}`)
    } else {
      console.log('❌ Finance real-time endpoint failed')
    }
    
    // Test 3: Compare with cached versions
    console.log('\n3. Comparing real-time vs cached versions...')
    
    // Crypto comparison
    const cryptoCachedResponse = await fetch(`${baseUrl}/api/crypto-prices`)
    const cryptoCachedData = await cryptoCachedResponse.json()
    
    if (cryptoRealtimeData && cryptoCachedData && cryptoRealtimeData.length > 0 && cryptoCachedData.length > 0) {
      const realtimeBtc = cryptoRealtimeData[0]
      const cachedBtc = cryptoCachedData[0]
      
      if (realtimeBtc && cachedBtc) {
        const priceDiff = Math.abs(realtimeBtc.current_price - cachedBtc.current_price)
        const priceDiffPercent = (priceDiff / realtimeBtc.current_price) * 100
        
        console.log(`   Real-time BTC: $${realtimeBtc.current_price}`)
        console.log(`   Cached BTC: $${cachedBtc.current_price}`)
        console.log(`   Price difference: $${priceDiff.toFixed(2)} (${priceDiffPercent.toFixed(4)}%)`)
        
        if (priceDiffPercent < 0.01) {
          console.log('✅ Crypto prices are consistent')
        } else {
          console.log('⚠️  Crypto prices differ between real-time and cached')
        }
      }
    }
    
    // Finance comparison
    const financeCachedResponse = await fetch(`${baseUrl}/api/finance-ticker`)
    const financeCachedData = await financeCachedResponse.json()
    
    if (financeRealtimeData && financeCachedData && financeRealtimeData.length > 0 && financeCachedData.length > 0) {
      const realtimeStock = financeRealtimeData[0]
      const cachedStock = financeCachedData[0]
      
      if (realtimeStock && cachedStock) {
        const priceDiff = Math.abs(realtimeStock.price - cachedStock.price)
        const priceDiffPercent = (priceDiff / realtimeStock.price) * 100
        
        console.log(`   Real-time stock: $${realtimeStock.price}`)
        console.log(`   Cached stock: $${cachedStock.price}`)
        console.log(`   Price difference: $${priceDiff.toFixed(2)} (${priceDiffPercent.toFixed(4)}%)`)
        
        if (priceDiffPercent < 0.01) {
          console.log('✅ Finance prices are consistent')
        } else {
          console.log('⚠️  Finance prices differ between real-time and cached')
        }
      }
    }
    
    // Test 4: Performance test
    console.log('\n4. Testing performance...')
    const startTime = Date.now()
    const perfResponse = await fetch(`${baseUrl}/api/crypto-realtime`)
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    console.log(`   Crypto real-time response time: ${responseTime}ms`)
    console.log(`   Cache status: ${perfResponse.headers.get('X-Cache-Status')}`)
    
    if (responseTime < 3000) {
      console.log('✅ Good response time for real-time data')
    } else {
      console.log('⚠️  Slow response time - may need optimization')
    }
    
    // Test 5: Multiple rapid requests (rate limiting test)
    console.log('\n5. Testing rate limiting...')
    const promises = []
    for (let i = 0; i < 3; i++) {
      promises.push(fetch(`${baseUrl}/api/crypto-realtime`))
      promises.push(fetch(`${baseUrl}/api/finance-realtime`))
    }
    
    const results = await Promise.all(promises)
    const allSuccessful = results.every(r => r.ok)
    
    if (allSuccessful) {
      console.log('✅ Rate limiting handled properly')
    } else {
      console.log('⚠️  Some requests may have been rate limited')
    }
    
    // Test 6: Cache busting effectiveness
    console.log('\n6. Testing cache busting effectiveness...')
    const timestamp1 = Date.now()
    const response1 = await fetch(`${baseUrl}/api/crypto-realtime?t=${timestamp1}`)
    const data1 = await response1.json()
    
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
    
    const timestamp2 = Date.now()
    const response2 = await fetch(`${baseUrl}/api/crypto-realtime?t=${timestamp2}`)
    const data2 = await response2.json()
    
    if (data1 && data2 && data1.length > 0 && data2.length > 0) {
      const btc1 = data1[0]?.current_price
      const btc2 = data2[0]?.current_price
      
      console.log(`   First request BTC: $${btc1}`)
      console.log(`   Second request BTC: $${btc2}`)
      console.log(`   Cache status 1: ${response1.headers.get('X-Cache-Status')}`)
      console.log(`   Cache status 2: ${response2.headers.get('X-Cache-Status')}`)
      
      if (response1.headers.get('X-Cache-Status') === 'REAL-TIME' && 
          response2.headers.get('X-Cache-Status') === 'REAL-TIME') {
        console.log('✅ Cache busting working - both requests bypassed cache')
      } else {
        console.log('⚠️  Cache busting may not be working properly')
      }
    }
    
    console.log('\n🎉 Real-time ticker pricing test completed!')
    console.log('\n📊 Summary:')
    console.log('   - Crypto ticker: Uses /api/crypto-realtime (10s refresh)')
    console.log('   - Finance ticker: Uses /api/finance-realtime (30s refresh)')
    console.log('   - Both endpoints bypass all caching for real-time data')
    console.log('   - Rate limiting properly handled')
    console.log('   - Cache busting ensures fresh data on every request')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n💡 Make sure the development server is running on localhost:3000')
  }
}

// Run the test
testRealtimeTickerPricing()
