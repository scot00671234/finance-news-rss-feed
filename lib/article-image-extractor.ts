// Enhanced image extraction service for better article thumbnails
import { extractImages, ImageInfo, getBestImage } from './enhanced-image-handler'
import { getFinanceFallbackImage } from './crypto-images'

export interface ArticleImageResult {
  primaryImage: string
  allImages: string[]
  source: 'rss' | 'html' | 'api' | 'fallback'
  quality: 'high' | 'medium' | 'low'
  confidence: number
}

export interface ImageExtractionConfig {
  preferHighQuality: boolean
  minWidth: number
  minHeight: number
  maxImages: number
  timeout: number
  enableDirectFetch: boolean
  enableImageValidation: boolean
}

const DEFAULT_CONFIG: ImageExtractionConfig = {
  preferHighQuality: true,
  minWidth: 300,
  minHeight: 200,
  maxImages: 5,
  timeout: 10000,
  enableDirectFetch: true,
  enableImageValidation: true
}

/**
 * Enhanced article image extraction with multiple strategies
 */
export async function extractArticleImages(
  articleUrl: string,
  rssItem?: any,
  htmlContent?: string,
  config: Partial<ImageExtractionConfig> = {}
): Promise<ArticleImageResult> {
  const opts = { ...DEFAULT_CONFIG, ...config }
  
  console.log(`🖼️ Extracting images for article: ${articleUrl}`)
  
  try {
    // Strategy 1: Extract from RSS item (fastest, usually good quality)
    let images: ImageInfo[] = []
    let source: ArticleImageResult['source'] = 'fallback'
    let confidence = 0
    
    if (rssItem) {
      const rssImages = await extractImagesFromRSS(rssItem, opts)
      if (rssImages.length > 0) {
        images = rssImages
        source = 'rss'
        confidence = 0.8
        console.log(`📡 Found ${rssImages.length} images from RSS`)
      }
    }
    
    // Strategy 2: Extract from HTML content (if provided)
    if (images.length === 0 && htmlContent) {
      const htmlImages = await extractImagesFromHTML(htmlContent, articleUrl, opts)
      if (htmlImages.length > 0) {
        images = htmlImages
        source = 'html'
        confidence = 0.7
        console.log(`🌐 Found ${htmlImages.length} images from HTML`)
      }
    }
    
    // Strategy 3: Direct page fetch for additional images
    if (images.length === 0 && opts.enableDirectFetch) {
      const directImages = await fetchImagesFromPage(articleUrl, opts)
      if (directImages.length > 0) {
        images = directImages
        source = 'api'
        confidence = 0.6
        console.log(`🔍 Found ${directImages.length} images from direct fetch`)
      }
    }
    
    // Strategy 4: Enhanced RSS extraction with better patterns
    if (images.length === 0 && rssItem) {
      const enhancedRssImages = await extractImagesFromRSSEnhanced(rssItem, opts)
      if (enhancedRssImages.length > 0) {
        images = enhancedRssImages
        source = 'rss'
        confidence = 0.5
        console.log(`🔧 Found ${enhancedRssImages.length} images from enhanced RSS`)
      }
    }
    
    // Process and validate images
    const processedImages = await processAndValidateImages(images, opts)
    
    // Get the best image
    const bestImage = getBestImage(processedImages)
    
    if (bestImage && bestImage.isValid) {
      const allImageUrls = processedImages.map(img => img.url)
      console.log(`✅ Selected best image: ${bestImage.url} (quality: ${bestImage.quality})`)
      
      return {
        primaryImage: bestImage.url,
        allImages: allImageUrls,
        source,
        quality: bestImage.quality,
        confidence
      }
    }
    
    // Fallback to category-based image
    console.log(`⚠️ No valid images found, using fallback`)
    const fallbackImage = getFinanceFallbackImage('default')
    
    return {
      primaryImage: fallbackImage,
      allImages: [fallbackImage],
      source: 'fallback',
      quality: 'medium',
      confidence: 0.1
    }
    
  } catch (error) {
    console.error(`❌ Error extracting images for ${articleUrl}:`, error)
    
    // Return fallback on error
    const fallbackImage = getFinanceFallbackImage('default')
    return {
      primaryImage: fallbackImage,
      allImages: [fallbackImage],
      source: 'fallback',
      quality: 'medium',
      confidence: 0
    }
  }
}

/**
 * Extract images from RSS item with enhanced patterns
 */
async function extractImagesFromRSS(rssItem: any, config: ImageExtractionConfig): Promise<ImageInfo[]> {
  const images: ImageInfo[] = []
  
  try {
    // 1. Media content (highest priority)
    if (rssItem.mediaContent && Array.isArray(rssItem.mediaContent)) {
      for (const media of rssItem.mediaContent) {
        if (media?.url && media.type?.startsWith('image/')) {
          images.push({
            url: media.url,
            source: 'rss',
            quality: determineImageQuality(media.url, media.width, media.height),
            isValid: true,
            width: media.width,
            height: media.height
          })
        }
      }
    }
    
    // 2. Media thumbnail
    if (rssItem.mediaThumbnail && Array.isArray(rssItem.mediaThumbnail)) {
      for (const thumb of rssItem.mediaThumbnail) {
        if (thumb?.url) {
          images.push({
            url: thumb.url,
            source: 'rss',
            quality: 'medium',
            isValid: true
          })
        }
      }
    }
    
    // 3. Enclosure
    if (rssItem.enclosure && Array.isArray(rssItem.enclosure)) {
      for (const enc of rssItem.enclosure) {
        if (enc?.url && enc.type?.startsWith('image/')) {
          images.push({
            url: enc.url,
            source: 'rss',
            quality: determineImageQuality(enc.url),
            isValid: true
          })
        }
      }
    }
    
    // 4. Extract from content fields
    const contentFields = [
      rssItem.content,
      rssItem.contentEncoded,
      rssItem.description,
      rssItem.summary
    ]
    
    for (const content of contentFields) {
      if (content) {
        const extractedImages = extractImagesFromHTMLContent(content, rssItem.link)
        images.push(...extractedImages)
      }
    }
    
  } catch (error) {
    console.error('Error extracting images from RSS:', error)
  }
  
  return images
}

/**
 * Enhanced RSS extraction with better image detection patterns
 */
async function extractImagesFromRSSEnhanced(rssItem: any, config: ImageExtractionConfig): Promise<ImageInfo[]> {
  const images: ImageInfo[] = []
  
  try {
    // Combine all text content
    const allContent = [
      rssItem.title || '',
      rssItem.description || '',
      rssItem.content || '',
      rssItem.contentEncoded || '',
      rssItem.summary || ''
    ].join(' ')
    
    // Look for image URLs in text content with enhanced patterns
    const imagePatterns = [
      // Direct image URLs
      /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s"'<>]*)?/gi,
      // CDN URLs
      /https?:\/\/[^\s"'<>]*\.(cdn|img|images|media|photos|pics)[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi,
      // Common image hosting services
      /https?:\/\/(?:i\.imgur\.com|imgur\.com\/[a-zA-Z0-9]+)\.(jpg|jpeg|png|gif|webp)/gi,
      /https?:\/\/[^\s"'<>]*\.(unsplash|pexels|pixabay)[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi
    ]
    
    for (const pattern of imagePatterns) {
      let match
      while ((match = pattern.exec(allContent)) !== null) {
        const url = cleanImageUrl(match[0], rssItem.link)
        if (url && isValidImageUrl(url)) {
          images.push({
            url,
            source: 'rss',
            quality: determineImageQuality(url),
            isValid: true
          })
        }
      }
    }
    
  } catch (error) {
    console.error('Error in enhanced RSS extraction:', error)
  }
  
  return images
}

/**
 * Extract images from HTML content
 */
async function extractImagesFromHTML(htmlContent: string, baseUrl: string, config: ImageExtractionConfig): Promise<ImageInfo[]> {
  const images: ImageInfo[] = []
  
  try {
    // Extract from HTML content
    const extractedImages = extractImagesFromHTMLContent(htmlContent, baseUrl)
    images.push(...extractedImages)
    
  } catch (error) {
    console.error('Error extracting images from HTML:', error)
  }
  
  return images
}

/**
 * Extract images from HTML content with multiple patterns
 */
function extractImagesFromHTMLContent(html: string, baseUrl?: string): ImageInfo[] {
  const images: ImageInfo[] = []
  
  try {
    const patterns = [
      // Standard img tags
      /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
      /<img[^>]+src=([^\s>]+)[^>]*>/gi,
      // Background images
      /background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi,
      // Figure elements
      /<figure[^>]*>.*?<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
      // Picture elements
      /<picture[^>]*>.*?<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
      // Source elements in picture
      /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi
    ]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(html)) !== null) {
        const src = match[1]
        const url = cleanImageUrl(src, baseUrl)
        
        if (url && isValidImageUrl(url)) {
          images.push({
            url,
            source: 'html',
            quality: determineImageQuality(url),
            isValid: true
          })
        }
      }
    }
    
  } catch (error) {
    console.error('Error extracting images from HTML content:', error)
  }
  
  return images
}

/**
 * Fetch images directly from the article page
 */
async function fetchImagesFromPage(url: string, config: ImageExtractionConfig): Promise<ImageInfo[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CoinFeedly/1.0; +https://coinfeadly.com/bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      signal: AbortSignal.timeout(config.timeout)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    return extractImagesFromHTMLContent(html, url)
    
  } catch (error) {
    console.warn(`Failed to fetch images from page ${url}:`, error)
    return []
  }
}

/**
 * Process and validate images
 */
async function processAndValidateImages(images: ImageInfo[], config: ImageExtractionConfig): Promise<ImageInfo[]> {
  // Remove duplicates
  const uniqueImages = images.filter((img, index, arr) => 
    arr.findIndex(i => i.url === img.url) === index
  )
  
  // Filter by size requirements
  const filteredImages = uniqueImages.filter(img => {
    if (!config.minWidth && !config.minHeight) return true
    
    const width = img.width || 0
    const height = img.height || 0
    
    if (config.minWidth && width < config.minWidth) return false
    if (config.minHeight && height < config.minHeight) return false
    
    return true
  })
  
  // Sort by quality and size
  const sortedImages = filteredImages.sort((a, b) => {
    if (config.preferHighQuality) {
      const qualityOrder = { high: 3, medium: 2, low: 1 }
      const qualityDiff = qualityOrder[b.quality] - qualityOrder[a.quality]
      if (qualityDiff !== 0) return qualityDiff
    }
    
    // Prefer larger images
    const aSize = (a.width || 0) * (a.height || 0)
    const bSize = (b.width || 0) * (b.height || 0)
    return bSize - aSize
  })
  
  // Limit to maxImages
  return sortedImages.slice(0, config.maxImages)
}

/**
 * Clean and validate image URL
 */
function cleanImageUrl(url: string, baseUrl?: string): string | null {
  if (!url) return null
  
  url = url.replace(/['"]/g, '').trim()
  
  // Handle protocol-relative URLs
  if (url.startsWith('//')) {
    url = 'https:' + url
  }
  
  // Handle relative URLs
  if (url.startsWith('/') && baseUrl) {
    try {
      const base = new URL(baseUrl)
      url = base.origin + url
    } catch (e) {
      return null
    }
  }
  
  // Handle relative URLs without leading slash
  if (!url.startsWith('http') && baseUrl) {
    try {
      const base = new URL(baseUrl)
      url = new URL(url, base.origin).href
    } catch (e) {
      return null
    }
  }
  
  // Validate URL
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    return url
  } catch (e) {
    return null
  }
}

/**
 * Validate image URL
 */
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    
    // Check protocol
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
    
    // Check file extension
    const pathname = parsed.pathname.toLowerCase()
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
    
    if (!validExtensions.some(ext => pathname.endsWith(ext))) {
      return false
    }
    
    // Check for common image CDN patterns
    const cdnPatterns = [
      /images\.unsplash\.com/,
      /cdn\./,
      /img\./,
      /static\./,
      /assets\./,
      /media\./,
      /photos\./,
      /pics\./,
      /i\.imgur\.com/,
      /imgur\.com/
    ]
    
    if (cdnPatterns.some(pattern => pattern.test(url))) {
      return true
    }
    
    return true
    
  } catch {
    return false
  }
}

/**
 * Determine image quality based on URL and dimensions
 */
function determineImageQuality(url: string, width?: string | number, height?: string | number): 'high' | 'medium' | 'low' {
  const w = typeof width === 'string' ? parseInt(width) : width || 0
  const h = typeof height === 'string' ? parseInt(height) : height || 0
  
  // Check URL for quality indicators
  if (url.includes('large') || url.includes('high') || url.includes('hd') || url.includes('hero')) {
    return 'high'
  }
  
  if (url.includes('medium') || url.includes('thumb') || url.includes('small')) {
    return 'medium'
  }
  
  if (url.includes('tiny') || url.includes('mini')) {
    return 'low'
  }
  
  // Check dimensions
  const area = w * h
  if (area > 1000000) return 'high' // > 1MP
  if (area > 200000) return 'medium' // > 200KP
  return 'low'
}

/**
 * Get the best image for an article with fallback
 */
export function getArticleImage(
  articleUrl?: string,
  rssItem?: any,
  htmlContent?: string,
  category?: string,
  title?: string
): string {
  // Try to extract images if we have the data
  if (articleUrl && (rssItem || htmlContent)) {
    // This would be called asynchronously in the actual implementation
    // For now, we'll use the existing logic
    return getFinanceFallbackImage(category || 'default', title)
  }
  
  // Fallback to category-based image
  return getFinanceFallbackImage(category || 'default', title)
}
