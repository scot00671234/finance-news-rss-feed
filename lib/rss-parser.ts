import Parser from 'rss-parser'

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['enclosure', 'enclosure', { keepArray: true }],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['summary', 'summary'],
    ],
  },
  timeout: 10000, // 10 second timeout for better image extraction
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
})

export interface RSSFeedItem {
  title?: string
  description?: string
  content?: string
  contentEncoded?: string
  summary?: string
  link?: string
  pubDate?: string
  enclosure?: any[]
  mediaContent?: any[]
  mediaThumbnail?: any[]
}

export interface RSSFeed {
  title: string
  description?: string
  link: string
  items: RSSFeedItem[]
}

export async function parseRSSFeed(url: string): Promise<RSSFeed> {
  try {
    const feed = await parser.parseURL(url)
    
    if (!feed) {
      throw new Error('No feed data received')
    }
    
    return {
      title: feed.title || 'Untitled Feed',
      description: feed.description || '',
      link: feed.link || url,
      items: Array.isArray(feed.items) ? feed.items : [],
    }
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error)
    // Return empty feed instead of throwing to prevent app crashes
    return {
      title: 'Error Feed',
      description: 'Failed to load feed',
      link: url,
      items: [],
    }
  }
}

export function extractImageUrl(item: RSSFeedItem): string | undefined {
  try {
    console.log(`Extracting image for: "${item.title?.substring(0, 50)}..."`)
    
    // Get all images using the enhanced extraction
    const allImages = extractImages(item)
    
    if (allImages.length > 0) {
      // Return the first (best quality) image
      const bestImage = allImages[0]
      console.log('Selected best image:', bestImage)
      return bestImage
    }
    
    console.log('No image found for:', item.title?.substring(0, 30))
    return undefined

  } catch (error) {
    console.error('Error extracting image URL:', error)
    return undefined
  }
}

// Enhanced image extraction with multiple strategies
export function extractImages(item: RSSFeedItem): string[] {
  const images: string[] = []
  
  try {
    // Helper function to clean and validate URLs
    const cleanUrl = (url: string, baseUrl?: string): string | null => {
      if (!url) return null
      
      url = url.replace(/['"]/g, '').trim()
      
      if (url.startsWith('//')) {
        url = 'https:' + url
      } else if (url.startsWith('/') && baseUrl) {
        try {
          const base = new URL(baseUrl)
          url = base.origin + url
        } catch (e) {
          return null
        }
      }
      
      try {
        const parsed = new URL(url)
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          return url
        }
      } catch (e) {
        return null
      }
      
      return null
    }

    // Helper function to extract images from HTML content
    const extractFromHtml = (html: string, baseUrl?: string): string[] => {
      if (!html) return []
      
      const images: string[] = []
      const patterns = [
        /<img[^>]+src="([^"]+)"/gi,
        /<img[^>]+src='([^']+)'/gi,
        /<img[^>]+src=([^\s>]+)/gi,
        /background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi,
        /<figure[^>]*>.*?<img[^>]+src="([^"]+)"/gi,
        /<picture[^>]*>.*?<img[^>]+src="([^"]+)"/gi,
        // Enhanced patterns for better image detection
        /<source[^>]+srcset=["']([^"']+)["'][^>]*>/gi,
        /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s"'<>]*)?/gi,
        /https?:\/\/[^\s"'<>]*\.(cdn|img|images|media|photos|pics)[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi
      ]
      
      for (const pattern of patterns) {
        let match
        while ((match = pattern.exec(html)) !== null) {
          const url = cleanUrl(match[1], baseUrl)
          if (url && url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
            images.push(url)
          }
        }
      }
      
      return images
    }

    // 1. Media content (highest quality)
    if (item.mediaContent && Array.isArray(item.mediaContent)) {
      for (const media of item.mediaContent) {
        if (media?.url) {
          const url = cleanUrl(media.url, item.link)
          if (url && (media.type?.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
            images.push(url)
          }
        }
      }
    }

    // 2. Media thumbnail
    if (item.mediaThumbnail && Array.isArray(item.mediaThumbnail)) {
      for (const thumbnail of item.mediaThumbnail) {
        if (thumbnail?.url) {
          const url = cleanUrl(thumbnail.url, item.link)
          if (url) {
            images.push(url)
          }
        }
      }
    }

    // 3. Enclosure (attachments)
    if (item.enclosure && Array.isArray(item.enclosure)) {
      for (const enc of item.enclosure) {
        if (enc?.url) {
          const url = cleanUrl(enc.url, item.link)
          if (url && (enc.type?.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
            images.push(url)
          }
        }
      }
    }

    // 4. Extract from contentEncoded
    if (item.contentEncoded) {
      images.push(...extractFromHtml(item.contentEncoded, item.link))
    }

    // 5. Extract from content
    if (item.content) {
      images.push(...extractFromHtml(item.content, item.link))
    }

    // 6. Extract from description
    if (item.description) {
      images.push(...extractFromHtml(item.description, item.link))
    }

    // 7. Extract from summary
    if (item.summary) {
      images.push(...extractFromHtml(item.summary, item.link))
    }

    // 8. Enhanced text-based extraction
    const allText = [
      item.title || '',
      item.description || '',
      item.content || '',
      item.contentEncoded || '',
      item.summary || ''
    ].join(' ')
    
    // Look for image URLs in text content
    const textImagePatterns = [
      /https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|gif|webp|svg)(\?[^\s"'<>]*)?/gi,
      /https?:\/\/[^\s"'<>]*\.(cdn|img|images|media|photos|pics)[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi,
      /https?:\/\/(?:i\.imgur\.com|imgur\.com\/[a-zA-Z0-9]+)\.(jpg|jpeg|png|gif|webp)/gi,
      /https?:\/\/[^\s"'<>]*\.(unsplash|pexels|pixabay)[^\s"'<>]*\.(jpg|jpeg|png|gif|webp)/gi
    ]
    
    for (const pattern of textImagePatterns) {
      let match
      while ((match = pattern.exec(allText)) !== null) {
        const url = cleanUrl(match[0], item.link)
        if (url && url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
          images.push(url)
        }
      }
    }

    // Remove duplicates and sort by quality
    const uniqueImages = [...new Set(images)]
    
    // Sort by quality (prefer larger images and better URLs)
    const sortedImages = uniqueImages.sort((a, b) => {
      // Prefer images with quality indicators in URL
      const aQuality = a.includes('large') || a.includes('high') || a.includes('hd') ? 3 : 
                      a.includes('medium') || a.includes('thumb') ? 2 : 1
      const bQuality = b.includes('large') || b.includes('high') || b.includes('hd') ? 3 : 
                      b.includes('medium') || b.includes('thumb') ? 2 : 1
      
      if (aQuality !== bQuality) return bQuality - aQuality
      
      // Prefer HTTPS over HTTP
      if (a.startsWith('https:') && !b.startsWith('https:')) return -1
      if (!a.startsWith('https:') && b.startsWith('https:')) return 1
      
      return 0
    })
    
    return sortedImages
    
  } catch (error) {
    console.error('Error extracting images:', error)
    return []
  }
}