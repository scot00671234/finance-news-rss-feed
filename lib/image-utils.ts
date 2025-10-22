// Utility functions for handling images and thumbnails
import { getFinanceFallbackImage } from './crypto-images'

export function getImageUrl(imageUrl?: string | null, title?: string, category?: string): string | null {
  if (imageUrl) {
    // Validate the image URL
    try {
      const url = new URL(imageUrl)
      // Check if it's a valid image URL
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return imageUrl
      }
    } catch {
      // Invalid URL, continue to fallback
    }
  }

  // Use crypto-relevant fallback images
  if (category) {
    return getFinanceFallbackImage(category, title)
  }

  // Generate a placeholder image based on the title
  if (title) {
    const encodedTitle = encodeURIComponent(title.substring(0, 50))
    return `https://via.placeholder.com/400x225/1e293b/94a3b8?text=${encodedTitle}`
  }

  return getFinanceFallbackImage('default')
}

export function getCryptoPlaceholderImage(category: string, title?: string): string {
  return getFinanceFallbackImage(category, title)
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    
    // Check protocol
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return false
    }
    
    // Check file extension
    const pathname = parsedUrl.pathname.toLowerCase()
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
      /imgur\.com/,
      /via\.placeholder\.com/
    ]
    
    if (cdnPatterns.some(pattern => pattern.test(url))) {
      return true
    }
    
    // Check for image-related query parameters
    const imageParams = ['image', 'img', 'photo', 'picture', 'pic']
    const hasImageParam = imageParams.some(param => 
      parsedUrl.searchParams.has(param) || parsedUrl.pathname.includes(param)
    )
    
    return hasImageParam || validExtensions.some(ext => pathname.endsWith(ext))
    
  } catch {
    return false
  }
}

/**
 * Extract images from HTML content with enhanced patterns
 */
export function extractImagesFromContent(content: string): string[] {
  const images: string[] = []
  
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
      /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi,
      // Direct image URLs in text
      /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s"'<>]*)?/gi,
      // CDN URLs
      /https?:\/\/[^\s"'<>]*\.(cdn|img|images|media|photos|pics)[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi
    ]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const src = match[1] || match[0]
        if (src && isValidImageUrl(src)) {
          images.push(src)
        }
      }
    }
    
  } catch (error) {
    console.error('Error extracting images from content:', error)
  }
  
  return [...new Set(images)] // Remove duplicates
}

/**
 * Get the best image from a list of images
 */
export function getBestImage(images: string[]): string | null {
  if (images.length === 0) return null
  
  // Sort by quality indicators
  const sortedImages = images.sort((a, b) => {
    // Prefer images with quality indicators in URL
    const aQuality = a.includes('large') || a.includes('high') || a.includes('hd') || a.includes('hero') ? 3 : 
                    a.includes('medium') || a.includes('thumb') ? 2 : 1
    const bQuality = b.includes('large') || b.includes('high') || b.includes('hd') || b.includes('hero') ? 3 : 
                    b.includes('medium') || b.includes('thumb') ? 2 : 1
    
    if (aQuality !== bQuality) return bQuality - aQuality
    
    // Prefer HTTPS over HTTP
    if (a.startsWith('https:') && !b.startsWith('https:')) return -1
    if (!a.startsWith('https:') && b.startsWith('https:')) return 1
    
    return 0
  })
  
  return sortedImages[0]
}

/**
 * Enhanced image URL validation with more comprehensive checks
 */
export function validateImageUrl(url: string): { isValid: boolean; reason?: string } {
  try {
    const parsedUrl = new URL(url)
    
    // Check protocol
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { isValid: false, reason: 'Invalid protocol' }
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/,
      /data:/,
      /vbscript:/,
      /onload=/,
      /onerror=/
    ]
    
    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return { isValid: false, reason: 'Suspicious URL pattern' }
    }
    
    // Check file extension
    const pathname = parsedUrl.pathname.toLowerCase()
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
    
    if (!validExtensions.some(ext => pathname.endsWith(ext))) {
      return { isValid: false, reason: 'Invalid file extension' }
    }
    
    return { isValid: true }
    
  } catch (error) {
    return { isValid: false, reason: 'Invalid URL format' }
  }
}
