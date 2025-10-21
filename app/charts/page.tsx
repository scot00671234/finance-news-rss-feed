'use client'

import { useState, useEffect } from 'react'
import { FinancePrice, formatPrice, formatChange, formatChangePercent, formatVolume, formatMarketCap } from '@/lib/finance-api'
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, BarChart3, DollarSign, Globe, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

export default function ChartsPage() {
  const router = useRouter()
  const [financeData, setFinanceData] = useState<FinancePrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'stocks' | 'indices' | 'commodities' | 'forex'>('all')
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'marketCap'>('price')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [tickerPrices, setTickerPrices] = useState<FinancePrice[]>([])

  useEffect(() => {
    fetchFinanceData()
    fetchTickerPrices()
  }, [selectedType, searchQuery])

  // Auto-refresh ticker prices every 60 seconds to avoid rate limits
  useEffect(() => {
    const interval = setInterval(fetchTickerPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchTickerPrices = async () => {
    try {
      const response = await fetch('/api/finance-ticker', {
        cache: 'default',
        headers: {
          'Accept': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTickerPrices(data)
      console.log('Finance ticker prices updated:', response.headers.get('X-Cache-Status'))
    } catch (error) {
      console.error('Error fetching finance ticker prices:', error)
    }
  }

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        type: selectedType,
        ...(searchQuery && { search: searchQuery })
      })
      
      const response = await fetch(`/api/finance-data?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setFinanceData(data)
    } catch (error) {
      console.error('Error fetching finance data:', error)
      setError('Failed to load finance data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFinanceClick = (item: FinancePrice) => {
    // For now, just show details in a modal or navigate to a detail page
    console.log('Clicked finance item:', item)
  }

  const sortedFinanceData = [...financeData].sort((a, b) => {
    let aValue: number, bValue: number

    switch (sortBy) {
      case 'price':
        aValue = a.price || 0
        bValue = b.price || 0
        break
      case 'change':
        aValue = a.changePercent || 0
        bValue = b.changePercent || 0
        break
      case 'volume':
        aValue = a.volume || 0
        bValue = b.volume || 0
        break
      case 'marketCap':
        aValue = a.marketCap || 0
        bValue = b.marketCap || 0
        break
      default:
        return 0
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stocks': return <BarChart3 className="w-4 h-4" />
      case 'indices': return <TrendingUp className="w-4 h-4" />
      case 'commodities': return <Zap className="w-4 h-4" />
      case 'forex': return <Globe className="w-4 h-4" />
      default: return <DollarSign className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stocks': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'indices': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'commodities': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'forex': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      
      {/* Crypto Price Ticker */}

      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Financial Markets Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time data for stocks, indices, commodities, and forex
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Asset Type Filter */}
          <div className="mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Asset Type:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Markets', icon: <DollarSign className="w-4 h-4" /> },
                { value: 'stocks', label: 'Stocks', icon: <BarChart3 className="w-4 h-4" /> },
                { value: 'indices', label: 'Indices', icon: <TrendingUp className="w-4 h-4" /> },
                { value: 'commodities', label: 'Commodities', icon: <Zap className="w-4 h-4" /> },
                { value: 'forex', label: 'Forex', icon: <Globe className="w-4 h-4" /> }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value as any)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    selectedType === option.value
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search symbols or names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="price">Price</option>
                  <option value="change">Change %</option>
                  <option value="volume">Volume</option>
                  <option value="marketCap">Market Cap</option>
                </select>
              </div>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <span className="text-xs uppercase tracking-wide">
                  {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                </span>
                {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error loading data
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setError(null)
                        fetchCryptos()
                      }}
                      className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Finance Data List */}
          <div className="w-full">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedType === 'all' ? 'Financial Markets' : 
                   selectedType === 'stocks' ? 'Stock Market' :
                   selectedType === 'indices' ? 'Market Indices' :
                   selectedType === 'commodities' ? 'Commodities' :
                   selectedType === 'forex' ? 'Foreign Exchange' : 'Financial Data'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {sortedFinanceData.length} instruments found
                </p>
              </div>
              
              {/* Mobile Layout - Cards */}
              <div className="block sm:hidden">
                <div className="space-y-3 p-4">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl p-4 animate-pulse">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                            <div>
                              <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-24 mb-2"></div>
                              <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-16"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-16 mb-1"></div>
                            <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-12"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : sortedFinanceData.length > 0 ? (
                    sortedFinanceData.map((item) => {
                      const itemType = item.symbol.includes('^') ? 'indices' : 
                                     item.symbol.includes('=F') ? 'commodities' :
                                     item.symbol.includes('=X') ? 'forex' : 'stocks'
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleFinanceClick(item)}
                          className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 rounded-xl p-4 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300/50 dark:hover:border-blue-400/50 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getTypeColor(itemType)}`}>
                                {getTypeIcon(itemType)}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                  {item.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                                  {item.symbol}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                {formatPrice(item.price)}
                              </div>
                              <div className={`text-xs flex items-center justify-end ${
                                (item.changePercent || 0) >= 0 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {(item.changePercent || 0) >= 0 ? (
                                  <ArrowUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 mr-1" />
                                )}
                                {formatChangePercent(item.changePercent)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <div className="text-slate-500 dark:text-slate-400 mb-1">Change</div>
                              <div className={`font-medium ${
                                (item.change || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {formatChange(item.change)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 dark:text-slate-400 mb-1">Volume</div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {formatVolume(item.volume)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 dark:text-slate-400 mb-1">Market Cap</div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {formatMarketCap(item.marketCap)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No data available
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Layout - Table */}
              <div className="hidden sm:block overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">Loading finance data...</p>
                  </div>
                ) : sortedFinanceData.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Change</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Change %</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Volume</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                      {sortedFinanceData.map((item) => {
                        const itemType = item.symbol.includes('^') ? 'indices' : 
                                       item.symbol.includes('=F') ? 'commodities' :
                                       item.symbol.includes('=X') ? 'forex' : 'stocks'
                        
                        return (
                          <tr
                            key={item.id}
                            onClick={() => handleFinanceClick(item)}
                            className="hover:bg-slate-100 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(itemType)}`}>
                                {getTypeIcon(itemType)}
                                <span className="capitalize">{itemType}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400 uppercase">{item.symbol}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">
                              {formatPrice(item.price)}
                            </td>
                            <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                              (item.change || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {formatChange(item.change)}
                            </td>
                            <td className={`px-4 py-4 whitespace-nowrap text-sm ${
                              (item.changePercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {formatChangePercent(item.changePercent)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {formatVolume(item.volume)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                              {formatMarketCap(item.marketCap)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
