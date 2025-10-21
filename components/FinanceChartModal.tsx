'use client'

import { useEffect } from 'react'
import { X, TrendingUp, TrendingDown, BarChart3, Globe, Zap, DollarSign } from 'lucide-react'
import { FinancePrice, formatPrice, formatChange, formatChangePercent, formatVolume, formatMarketCap } from '@/lib/finance-api'
import TradingViewWidget from './TradingViewWidget'

interface FinanceChartModalProps {
  isOpen: boolean
  onClose: () => void
  instrument: FinancePrice | null
}

export default function FinanceChartModal({ isOpen, onClose, instrument }: FinanceChartModalProps) {

  if (!isOpen || !instrument) return null

  // Determine instrument type and TradingView symbol
  const getInstrumentType = (symbol: string) => {
    if (symbol.includes('^')) return 'indices'
    if (symbol.includes('=F')) return 'commodities'
    if (symbol.includes('=X')) return 'forex'
    return 'stocks'
  }

  const getTradingViewSymbol = (instrument: FinancePrice) => {
    const type = getInstrumentType(instrument.symbol)
    
    switch (type) {
      case 'stocks':
        // For stocks, try to determine exchange
        if (instrument.symbol.includes('NASDAQ') || instrument.symbol.includes('AAPL') || instrument.symbol.includes('MSFT')) {
          return `NASDAQ:${instrument.symbol}`
        }
        return `NYSE:${instrument.symbol}`
      
      case 'indices':
        // Map common index symbols to TradingView format
        const indexMap: { [key: string]: string } = {
          '^GSPC': 'SPX',
          '^IXIC': 'NASDAQ:NDX',
          '^DJI': 'DOW',
          '^VIX': 'VIX',
          '^RUT': 'RUT'
        }
        return indexMap[instrument.symbol] || instrument.symbol.replace('^', '')
      
      case 'commodities':
        // Map commodity symbols to TradingView format
        const commodityMap: { [key: string]: string } = {
          'GC=F': 'GC',
          'SI=F': 'SI',
          'CL=F': 'CL',
          'NG=F': 'NG',
          'ZC=F': 'ZC',
          'KC=F': 'KC'
        }
        return commodityMap[instrument.symbol] || instrument.symbol.replace('=F', '')
      
      case 'forex':
        // Map forex symbols to TradingView format
        const forexMap: { [key: string]: string } = {
          'EURUSD=X': 'FX:EURUSD',
          'GBPUSD=X': 'FX:GBPUSD',
          'USDJPY=X': 'FX:USDJPY',
          'USDCHF=X': 'FX:USDCHF',
          'AUDUSD=X': 'FX:AUDUSD'
        }
        return forexMap[instrument.symbol] || `FX:${instrument.symbol.replace('=X', '')}`
      
      default:
        return instrument.symbol
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stocks':
        return <BarChart3 className="w-4 h-4" />
      case 'indices':
        return <TrendingUp className="w-4 h-4" />
      case 'commodities':
        return <Zap className="w-4 h-4" />
      case 'forex':
        return <Globe className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stocks':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'indices':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'commodities':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'forex':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const instrumentType = getInstrumentType(instrument.symbol)
  const tradingViewSymbol = getTradingViewSymbol(instrument)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${getTypeColor(instrumentType)}`}>
                {getTypeIcon(instrumentType)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {instrument.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 uppercase">
                  {instrument.symbol}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
          </div>

          {/* Price Data Section */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatPrice(instrument.price)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Current Price</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  (instrument.change || 0) >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatChange(instrument.change)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Change</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  (instrument.changePercent || 0) >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {formatChangePercent(instrument.changePercent)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Change %</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatVolume(instrument.volume || 0)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Volume</div>
              </div>
            </div>
          </div>

          {/* TradingView Symbol Info */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                TradingView Symbol: <span className="font-mono font-semibold text-slate-900 dark:text-white">{tradingViewSymbol}</span>
              </div>
            </div>
          </div>

          {/* TradingView Chart */}
          <div className="p-6">
            <div className="h-[600px] w-full">
              <TradingViewWidget
                symbol={tradingViewSymbol}
                interval="D"
                theme="light"
                style="1"
                autosize={true}
                hide_top_toolbar={false}
                save_image={true}
                studies={[
                  "RSI@tv-basicstudies",
                  "MACD@tv-basicstudies",
                  "Volume@tv-basicstudies"
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
