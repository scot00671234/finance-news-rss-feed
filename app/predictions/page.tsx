'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, Brain, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ProfessionalTradingChart from '@/components/ProfessionalTradingChart'
import { priceManager } from '@/lib/price-manager'

export default function PredictionsPage() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [assetData, setAssetData] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'stocks' | 'indices' | 'commodities' | 'forex' | 'crypto'>('stocks')

  // Available financial assets for prediction
  const availableAssets = {
    stocks: [
      { id: 'apple', name: 'Apple Inc.', symbol: 'AAPL', type: 'stock' },
      { id: 'microsoft', name: 'Microsoft Corp.', symbol: 'MSFT', type: 'stock' },
      { id: 'google', name: 'Alphabet Inc.', symbol: 'GOOGL', type: 'stock' },
      { id: 'amazon', name: 'Amazon.com Inc.', symbol: 'AMZN', type: 'stock' },
      { id: 'tesla', name: 'Tesla Inc.', symbol: 'TSLA', type: 'stock' }
    ],
    indices: [
      { id: 'sp500', name: 'S&P 500', symbol: 'SPX', type: 'index' },
      { id: 'nasdaq100', name: 'NASDAQ 100', symbol: 'NDX', type: 'index' },
      { id: 'dowjones', name: 'Dow Jones', symbol: 'DOW', type: 'index' }
    ],
    commodities: [
      { id: 'gold', name: 'Gold', symbol: 'GC', type: 'commodity' },
      { id: 'oil', name: 'Crude Oil', symbol: 'CL', type: 'commodity' },
      { id: 'silver', name: 'Silver', symbol: 'SI', type: 'commodity' }
    ],
    forex: [
      { id: 'eurusd', name: 'EUR/USD', symbol: 'EURUSD', type: 'forex' },
      { id: 'gbpusd', name: 'GBP/USD', symbol: 'GBPUSD', type: 'forex' },
      { id: 'usdjpy', name: 'USD/JPY', symbol: 'USDJPY', type: 'forex' }
    ],
    crypto: [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', type: 'crypto' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', type: 'crypto' }
    ]
  }

  useEffect(() => {
    // Load first asset data by default
    if (!selectedAsset) {
      const firstAsset = availableAssets[selectedCategory][0]
      setSelectedAsset(firstAsset.id)
      loadAssetData(firstAsset.id, firstAsset.type)
    }
  }, [selectedCategory])

  const loadAssetData = async (assetId: string, assetType: string) => {
    setLoading(true)
    try {
      // For now, we'll use mock data since we don't have detailed asset APIs yet
      // In a real implementation, you'd fetch from appropriate APIs
      const mockData = {
        id: assetId,
        name: availableAssets[selectedCategory].find(a => a.id === assetId)?.name || 'Unknown',
        symbol: availableAssets[selectedCategory].find(a => a.id === assetId)?.symbol || 'UNK',
        price: Math.random() * 1000 + 100,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.random() * 1000000,
        marketCap: Math.random() * 1000000000
      }
      
      setAssetData(mockData)
      
      // Generate mock chart data
      const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        time: Math.floor(Date.now() / 1000) - (30 - i) * 24 * 60 * 60,
        value: mockData.price + (Math.random() - 0.5) * 50
      }))
      setChartData(mockChartData)
    } catch (error) {
      console.error('Error loading asset data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId)
    const asset = availableAssets[selectedCategory].find(a => a.id === assetId)
    if (asset) {
      loadAssetData(assetId, asset.type)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Predictions</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Advanced AI-powered financial market predictions and analysis
          </p>
        </div>

        {/* Development Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                This page is currently under development
              </h3>
              <p className="text-amber-700 dark:text-amber-300">
                We're working on implementing advanced AI prediction models. Currently, you can view financial asset historical data and basic chart analysis. 
                Full prediction features will be available soon.
              </p>
            </div>
          </div>
        </div>

        {/* Asset Category Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Select Asset Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(availableAssets).map(([category, assets]) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category as any)
                  setSelectedAsset(assets[0].id)
                  loadAssetData(assets[0].id, assets[0].type)
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedCategory === category
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">{category}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{assets.length} assets</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Asset Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Select {selectedCategory === 'stocks' ? 'Stock' : 
                   selectedCategory === 'indices' ? 'Index' :
                   selectedCategory === 'commodities' ? 'Commodity' :
                   selectedCategory === 'forex' ? 'Currency Pair' : 'Cryptocurrency'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableAssets[selectedCategory].map((asset) => (
              <button
                key={asset.id}
                onClick={() => handleAssetSelect(asset.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAsset === asset.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-slate-900 dark:text-white">{asset.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{asset.symbol}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        {selectedAsset && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {assetData?.name || 'Loading...'} Price Chart
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Historical data and trend analysis
                  </p>
                </div>
              </div>
              
              {assetData && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${assetData.price?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 'N/A'}
                  </div>
                  <div className={`text-sm font-medium ${
                    (assetData.changePercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {(assetData.changePercent || 0) >= 0 ? '+' : ''}
                    {assetData.changePercent?.toFixed(2) || '0.00'}%
                  </div>
                </div>
              )}
            </div>

            <ProfessionalTradingChart 
              data={chartData} 
              height={500} 
              loading={loading}
              lineColor="gradient"
              theme="dark"
              showGrid={true}
              showAnnotations={true}
              timeframe="30d"
              lastUpdated={priceManager.getLastUpdate()}
            />
          </div>
        )}

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Predictions</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Machine learning models will analyze market patterns and provide price predictions for the next 24 hours, 7 days, and 30 days.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Trend Analysis</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Advanced technical analysis with support/resistance levels, moving averages, and momentum indicators.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Risk Assessment</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Comprehensive risk metrics including volatility analysis, correlation factors, and market sentiment indicators.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
