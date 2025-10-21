'use client'

import { useState, useEffect, useRef } from 'react'
import { FinancePrice, formatPrice, formatChange, formatChangePercent } from '@/lib/finance-api'

export default function FinanceTicker() {
  const [prices, setPrices] = useState<FinancePrice[]>([])
  const [loading, setLoading] = useState(true)
  const tickerRef = useRef<HTMLDivElement>(null)

  // Fetch finance prices
  const fetchPrices = async () => {
    try {
      const response = await fetch('/api/finance-ticker', {
        cache: 'default',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPrices(data)
      }
    } catch (error) {
      console.error('Error fetching finance prices:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPrices()
  }, [])

  // Refresh prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

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
        className="flex items-center py-1 animate-scroll"
        style={{
          animation: 'scroll 45s linear infinite'
        }}
      >
        {/* First set of prices */}
        {prices.map((price, index) => (
          <div key={`first-${index}`} className="flex items-center space-x-3 px-3 whitespace-nowrap">
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
          <div key={`second-${index}`} className="flex items-center space-x-3 px-3 whitespace-nowrap">
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
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-scroll {
          animation: scroll 45s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
