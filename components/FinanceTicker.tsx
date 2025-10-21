'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FinancePrice, formatPrice, formatChange, formatChangePercent } from '@/lib/finance-api'

export default function FinanceTicker() {
  const [prices, setPrices] = useState<FinancePrice[]>([])
  const [loading, setLoading] = useState(true)
  const tickerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Fetch finance prices with error handling
  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch('/api/finance-ticker', {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setPrices(data)
        }
      }
    } catch (error) {
      console.error('Error fetching finance prices:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Refresh prices every 60 seconds (less frequent to reduce lag)
  useEffect(() => {
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  // Optimize animation performance
  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return

    // Use requestAnimationFrame for smoother animation
    const animate = () => {
      if (ticker) {
        const currentTransform = ticker.style.transform
        const translateX = currentTransform.includes('translateX') 
          ? parseFloat(currentTransform.match(/translateX\(([^)]+)\)/)?.[1] || '0')
          : 0
        
        // Calculate new position (slower speed)
        const newTranslateX = translateX - 0.5 // Slower movement
        ticker.style.transform = `translateX(${newTranslateX}px)`
        
        // Reset position when completely off screen (seamless loop)
        if (newTranslateX <= -ticker.scrollWidth / 2) {
          ticker.style.transform = 'translateX(0px)'
        }
        
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [prices])

  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center py-1">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600"></div>
        </div>
      </div>
    )
  }

  if (prices.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 overflow-hidden">
      <div 
        ref={tickerRef}
        className="flex items-center py-1 will-change-transform"
        style={{
          transform: 'translateX(0px)',
          width: 'max-content'
        }}
      >
        {/* First set of prices */}
        {prices.map((price, index) => (
          <div key={`first-${index}`} className="flex items-center space-x-4 px-4 whitespace-nowrap flex-shrink-0">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {price.symbol}
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {formatPrice(price.price)}
            </span>
            <span className={`text-xs font-medium ${
              price.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatChange(price.change)} ({formatChangePercent(price.changePercent)})
            </span>
          </div>
        ))}
        
        {/* Duplicate for seamless infinite loop */}
        {prices.map((price, index) => (
          <div key={`second-${index}`} className="flex items-center space-x-4 px-4 whitespace-nowrap flex-shrink-0">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {price.symbol}
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {formatPrice(price.price)}
            </span>
            <span className={`text-xs font-medium ${
              price.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatChange(price.change)} ({formatChangePercent(price.changePercent)})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
