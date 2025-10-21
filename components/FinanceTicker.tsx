'use client'

import { useState, useEffect, useRef } from 'react'
import { FinancePrice, formatPrice, formatChange, formatChangePercent } from '@/lib/finance-api'

export default function FinanceTicker() {
  const [prices, setPrices] = useState<FinancePrice[]>([])
  const [loading, setLoading] = useState(true)
  const tickerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

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
        console.log('Finance ticker prices updated:', new Date().toLocaleTimeString())
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

  // Update ticker content without restarting animation when prices change
  useEffect(() => {
    if (tickerRef.current && prices.length > 0) {
      const tickerContent = tickerRef.current.querySelector('.ticker-content')
      if (tickerContent) {
        tickerContent.innerHTML = generateTickerHTML(prices)
      }
    }
  }, [prices])

  const generateTickerHTML = (prices: FinancePrice[]) => {
    return prices.map(price => `
      <div class="flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-white/5 rounded-lg backdrop-blur-sm border border-white/20 dark:border-white/10">
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">${price.symbol}</span>
          <span class="text-xs text-slate-600 dark:text-slate-400">${price.name}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm font-bold text-slate-900 dark:text-slate-100">${formatPrice(price.price)}</span>
          <div class="flex items-center space-x-1">
            <span class="text-xs ${price.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
              ${formatChange(price.change)}
            </span>
            <span class="text-xs ${price.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
              (${formatChangePercent(price.changePercent)})
            </span>
          </div>
        </div>
      </div>
    `).join('')
  }

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Loading finance data...</span>
        </div>
      </div>
    )
  }

  if (prices.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-2">
        <div className="flex items-center justify-center">
          <span className="text-sm">No finance data available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 py-1 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
          <span className="text-sm font-bold">📈 Finance</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div 
            ref={tickerRef}
            className="ticker-container flex animate-scroll"
            style={{
              animation: 'scroll 60s linear infinite'
            }}
          >
            <div className="ticker-content flex items-center space-x-4">
              {generateTickerHTML(prices)}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="ticker-content flex items-center space-x-4">
              {generateTickerHTML(prices)}
            </div>
          </div>
        </div>
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
          animation: scroll 60s linear infinite;
        }
        
        .ticker-container:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
