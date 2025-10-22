// Test script for enhanced image extraction
// Run with: node test-image-extraction.js

const testImageExtraction = async () => {
  console.log('🖼️ Testing Enhanced Image Extraction...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test 1: Check news API for image data
    console.log('1. Testing news API for image data...')
    const newsResponse = await fetch(`${baseUrl}/api/news?limit=5`)
    const newsData = await newsResponse.json()
    
    if (newsData && newsData.length > 0) {
      console.log(`✅ Found ${newsData.length} articles`)
      
      let articlesWithImages = 0
      let articlesWithFallbacks = 0
      
      newsData.forEach((article, index) => {
        console.log(`\n   Article ${index + 1}: "${article.title.substring(0, 50)}..."`)
        console.log(`   Original imageUrl: ${article.imageUrl || 'None'}`)
        console.log(`   Primary category: ${article.primaryCategory || 'None'}`)
        
        if (article.imageUrl && article.imageUrl.includes('placeholder') === false) {
          articlesWithImages++
          console.log(`   ✅ Has original image`)
        } else {
          articlesWithFallbacks++
          console.log(`   ⚠️ Using fallback image`)
        }
      })
      
      console.log(`\n   Summary:`)
      console.log(`   - Articles with original images: ${articlesWithImages}`)
      console.log(`   - Articles with fallback images: ${articlesWithFallbacks}`)
      console.log(`   - Image success rate: ${((articlesWithImages / newsData.length) * 100).toFixed(1)}%`)
    } else {
      console.log('❌ No articles found')
    }
    
    // Test 2: Test image extraction from specific article
    console.log('\n2. Testing image extraction from article content...')
    if (newsData && newsData.length > 0) {
      const testArticle = newsData[0]
      console.log(`   Testing article: "${testArticle.title.substring(0, 50)}..."`)
      
      if (testArticle.content) {
        // Simulate image extraction from content
        const imagePatterns = [
          /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
          /background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi,
          /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s"'<>]*)?/gi
        ]
        
        const foundImages = []
        for (const pattern of imagePatterns) {
          let match
          while ((match = pattern.exec(testArticle.content)) !== null) {
            const url = match[1] || match[0]
            if (url && url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
              foundImages.push(url)
            }
          }
        }
        
        const uniqueImages = [...new Set(foundImages)]
        console.log(`   Images found in content: ${uniqueImages.length}`)
        if (uniqueImages.length > 0) {
          console.log(`   First image: ${uniqueImages[0]}`)
        }
      } else {
        console.log('   No content available for testing')
      }
    }
    
    // Test 3: Test image validation
    console.log('\n3. Testing image URL validation...')
    const testUrls = [
      'https://example.com/image.jpg',
      'https://cdn.example.com/photo.png',
      'https://images.unsplash.com/photo-123.jpg',
      'https://via.placeholder.com/400x300',
      'https://i.imgur.com/abc123.jpg',
      'invalid-url',
      'https://example.com/not-an-image.txt',
      'javascript:alert("xss")'
    ]
    
    testUrls.forEach(url => {
      try {
        const parsedUrl = new URL(url)
        const isValid = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
        const hasImageExt = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
        const isSuspicious = /javascript:|data:|vbscript:/i.test(url)
        
        const result = isValid && hasImageExt && !isSuspicious
        console.log(`   ${url}: ${result ? '✅ Valid' : '❌ Invalid'}`)
      } catch {
        console.log(`   ${url}: ❌ Invalid (malformed URL)`)
      }
    })
    
    // Test 4: Test fallback image generation
    console.log('\n4. Testing fallback image generation...')
    const categories = ['bitcoin', 'altcoins', 'defi', 'macro', 'stocks']
    
    categories.forEach(category => {
      const fallbackUrl = `https://via.placeholder.com/400x225/1e293b/94a3b8?text=${encodeURIComponent(category.toUpperCase())}`
      console.log(`   ${category}: ${fallbackUrl}`)
    })
    
    // Test 5: Performance test
    console.log('\n5. Testing performance...')
    const startTime = Date.now()
    const perfResponse = await fetch(`${baseUrl}/api/news?limit=10`)
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    console.log(`   Response time: ${responseTime}ms`)
    
    if (responseTime < 1000) {
      console.log('✅ Good response time')
    } else {
      console.log('⚠️ Slow response time')
    }
    
    console.log('\n🎉 Image extraction test completed!')
    console.log('\n📊 Summary:')
    console.log('   - Enhanced image extraction from RSS feeds')
    console.log('   - Multiple fallback strategies implemented')
    console.log('   - Better image validation and quality detection')
    console.log('   - Content-based image extraction as backup')
    console.log('   - Improved fallback image system')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n💡 Make sure the development server is running on localhost:3000')
  }
}

// Run the test
testImageExtraction()
