'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, TrendingDown, BarChart3, Globe, Zap, DollarSign } from 'lucide-react'
import { FinancePrice, formatPrice, formatChange, formatChangePercent, formatVolume, formatMarketCap } from '@/lib/finance-api'
import TradingViewWidget from './TradingViewWidget'

interface FinanceChartModalProps {
  isOpen: boolean
  onClose: () => void
  instrument: FinancePrice | null
}

export default function FinanceChartModal({ isOpen, onClose, instrument }: FinanceChartModalProps) {
  const [timeframe, setTimeframe] = useState<'1' | '3' | '5' | '15' | '30' | '60' | '120' | '180' | '240' | 'D' | 'W'>('D')
  const [chartStyle, setChartStyle] = useState<'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'>('1')

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
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
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

          {/* Chart Controls */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="1">1m</option>
                    <option value="3">3m</option>
                    <option value="5">5m</option>
                    <option value="15">15m</option>
                    <option value="30">30m</option>
                    <option value="60">1h</option>
                    <option value="120">2h</option>
                    <option value="180">3h</option>
                    <option value="240">4h</option>
                    <option value="D">1D</option>
                    <option value="W">1W</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Chart Style
                  </label>
                  <select
                    value={chartStyle}
                    onChange={(e) => setChartStyle(e.target.value as any)}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="0">Bars</option>
                    <option value="1">Candles</option>
                    <option value="2">Hollow Candles</option>
                    <option value="3">Line</option>
                    <option value="4">Area</option>
                    <option value="5">Renko</option>
                    <option value="6">Line Break</option>
                    <option value="7">Kagi</option>
                    <option value="8">Point & Figure</option>
                    <option value="9">Heikin Ashi</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                TradingView Symbol: <span className="font-mono font-semibold">{tradingViewSymbol}</span>
              </div>
            </div>
          </div>

          {/* TradingView Chart */}
          <div className="p-6">
            <div className="h-96 w-full">
              <TradingViewWidget
                symbol={tradingViewSymbol}
                interval={timeframe}
                theme="light"
                style={chartStyle}
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
