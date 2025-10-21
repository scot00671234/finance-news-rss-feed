'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CryptoPrice, formatPrice, formatMarketCap, formatVolume, formatPercentage } from '@/lib/crypto-api'
import { priceManager } from '@/lib/price-manager'
import { TrendingUp, TrendingDown, Star, ExternalLink, ArrowLeft, BarChart3 } from 'lucide-react'
import ProfessionalTradingChart from '@/components/ProfessionalTradingChart'
import TradingViewWidget from '@/components/TradingViewWidget'

export default function CryptoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [crypto, setCrypto] = useState<CryptoPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<'1d' | '7d' | '30d' | '90d'>('7d')
  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<'tradingview' | 'custom'>('tradingview')

  useEffect(() => {
    if (params.id) {
      fetchCryptoData()
    }
  }, [params.id])

  useEffect(() => {
    if (crypto) {
      fetchChartData()
    }
  }, [crypto, timeframe])


  const fetchCryptoData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use smart cache API for consistent pricing
      const response = await fetch(`/api/smart-crypto?action=detail&id=${params.id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setCrypto(data.cryptoDetail)
      
      // Update price manager with the fresh data
      priceManager.updatePrices([data.cryptoDetail])
      
      console.log('Smart cache detail loaded:', response.headers.get('X-Cache-Status'))
      
    } catch (error) {
      console.error('Error fetching crypto data:', error)
      setError('Failed to load cryptocurrency data')
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    if (!crypto) {
      console.log('No crypto data available for chart')
      return
    }
    
    try {
      console.log('Fetching chart data for:', crypto.id, 'timeframe:', timeframe)
      
      // Use smart cache API to get chart data
      const response = await fetch(`/api/smart-crypto?action=chart&id=${crypto.id}&timeframe=${timeframe}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Chart data from smart cache:', data.chartData.length, 'points')
      console.log('Cache status:', response.headers.get('X-Cache-Status'))
      
      // Format chart data
      const formattedData = data.chartData.map((item: any) => ({
        time: Math.floor(item.timestamp / 1000),
        value: parseFloat(item.price)
      }))
      
      console.log('Formatted chart data:', formattedData.length, 'points')
      setChartData(formattedData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !crypto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {error || 'Cryptocurrency not found'}
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Charts</span>
        </button>

        {/* Crypto Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{crypto.name}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 uppercase">{crypto.symbol}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">Rank #{crypto.market_cap_rank}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-yellow-400 transition-colors">
                <Star className="w-6 h-6" />
              </button>
              <a
                href={`https://www.coingecko.com/en/coins/${crypto.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {formatPrice(crypto.current_price)}
              </div>
              <div className={`flex items-center space-x-2 ${
                (crypto.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(crypto.price_change_percentage_24h || 0) >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="text-lg font-medium">
                  {formatPercentage(crypto.price_change_percentage_24h)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">(24h)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Market Cap</span>
                <span className="text-slate-900 dark:text-white font-medium">{formatMarketCap(crypto.market_cap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Volume (24h)</span>
                <span className="text-slate-900 dark:text-white font-medium">{formatVolume(crypto.total_volume)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Circulating Supply</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {(crypto.circulating_supply || 0).toLocaleString()} {crypto.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Max Supply</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {crypto.max_supply ? `${crypto.max_supply.toLocaleString()} ${crypto.symbol.toUpperCase()}` : '∞'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Price Chart</h2>
            
            <div className="flex items-center space-x-4">
              {/* Chart Type Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setChartType('tradingview')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    chartType === 'tradingview'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>TradingView</span>
                </button>
                <button
                  onClick={() => setChartType('custom')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    chartType === 'custom'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Custom</span>
                </button>
              </div>
              
            </div>
          </div>

          {/* Chart */}
          {chartType === 'tradingview' ? (
            <TradingViewWidget
              symbol={`BINANCE:${crypto.symbol.toUpperCase()}USDT`}
              theme="dark"
              autosize={true}
              height={500}
              interval={timeframe === '1d' ? 'D' : timeframe === '7d' ? 'D' : timeframe === '30d' ? 'D' : 'W'}
              style="1"
              enable_publishing={false}
              hide_top_toolbar={false}
              hide_legend={false}
              save_image={false}
              hide_volume={false}
              studies={['Volume@tv-basicstudies']}
              className="rounded-lg overflow-hidden"
            />
          ) : (
            <ProfessionalTradingChart 
              data={chartData} 
              height={500} 
              loading={chartData.length === 0 && crypto !== null}
              lineColor="gradient"
              theme="dark"
              showGrid={true}
              showAnnotations={true}
              timeframe={timeframe}
              lastUpdated={priceManager.getLastUpdate()}
            />
          )}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Price Changes</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">1 Hour</span>
                <span className={`font-medium ${
                  (crypto.price_change_percentage_1h_in_currency || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">24 Hours</span>
                <span className={`font-medium ${
                  (crypto.price_change_percentage_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(crypto.price_change_percentage_24h)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">7 Days</span>
                <span className={`font-medium ${
                  (crypto.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Market Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Market Cap Rank</span>
                <span className="text-slate-900 dark:text-white font-medium">#{crypto.market_cap_rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Supply</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {crypto.total_supply ? `${crypto.total_supply.toLocaleString()} ${crypto.symbol.toUpperCase()}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Fully Diluted Valuation</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {crypto.fully_diluted_valuation ? formatMarketCap(crypto.fully_diluted_valuation) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trading Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">24h High</span>
                <span className="text-slate-900 dark:text-white font-medium">{formatPrice(crypto.high_24h)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">24h Low</span>
                <span className="text-slate-900 dark:text-white font-medium">{formatPrice(crypto.low_24h)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Price Change (24h)</span>
                <span className={`font-medium ${
                  (crypto.price_change_24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPrice(Math.abs(crypto.price_change_24h || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
