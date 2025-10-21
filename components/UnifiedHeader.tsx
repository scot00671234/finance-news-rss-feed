'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Moon, Sun, Menu, X, TrendingUp, BarChart3, Activity, Zap } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import DropdownMenu from './DropdownMenu'

interface UnifiedHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch?: () => void
  searchPlaceholder?: string
}

export default function UnifiedHeader({ searchQuery, setSearchQuery, onSearch, searchPlaceholder }: UnifiedHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const pathname = usePathname()

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch()
    }
  }

  // Get appropriate placeholder text based on current page
  const getPlaceholderText = () => {
    if (searchPlaceholder) return searchPlaceholder
    return pathname === '/charts' 
      ? 'Search stocks, indices, commodities, forex...' 
      : 'Search finance news, market analysis, and economic insights...'
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Dropdown menu items
  const marketItems = [
    {
      href: '/charts',
      label: 'Charts',
      description: 'Real-time financial markets data'
    },
    {
      href: '/fear-greed',
      label: 'Fear & Greed',
      description: 'Market sentiment indicator'
    }
  ]

  const toolsItems = [
    {
      href: '/brokers/axiom',
      label: 'Axiom',
      description: 'Advanced trading platform'
    },
    {
      href: '/brokers/coinbase',
      label: 'Coinbase',
      description: 'Digital asset trading platform'
    }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{stopColor:'#FFD700', stopOpacity:1}} />
                    <stop offset="70%" style={{stopColor:'#FFA500', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#B8860B', stopOpacity:1}} />
                  </radialGradient>
                </defs>
                <circle cx="14" cy="20" r="12" fill="url(#goldGradient)" />
                <circle cx="26" cy="20" r="12" fill="url(#goldGradient)" />
              </svg>
            </div>
            <span className="text-xl font-light tracking-wide text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              Barclayne
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={getPlaceholderText()}
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none ${
                isActive('/')
                  ? 'text-slate-900 dark:text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            
            <DropdownMenu
              trigger={
                <span>Markets</span>
              }
              items={marketItems}
            />
            
            <DropdownMenu
              trigger={
                <span>Brokers</span>
              }
              items={toolsItems}
            />
            
            <button
              onClick={toggleTheme}
              className="group flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              ) : (
                <Moon className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md hover:shadow-blue-500/10 hover:ring-1 hover:ring-blue-500/10 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="space-y-2">
              {/* Mobile Navigation Menu */}
              <div className="px-4 py-2">
                <div className="space-y-1">
                  <Link 
                    href="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none ${
                      isActive('/')
                        ? 'text-slate-900 dark:text-white font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Home
                  </Link>
                  
                  {/* Markets Section */}
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 mt-4 px-3 tracking-wide uppercase">Markets</div>
                  {marketItems.map((item, index) => (
                    <Link 
                      key={index}
                      href={item.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Brokers Section */}
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 mt-4 px-3 tracking-wide uppercase">Brokers</div>
                  {toolsItems.map((item, index) => (
                    <Link 
                      key={index}
                      href={item.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Theme Toggle */}
              <div className="px-4 py-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <button
                  onClick={() => {
                    toggleTheme()
                    setIsMenuOpen(false)
                  }}
                  className="group flex items-center space-x-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all duration-200 w-full"
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 transition-all duration-200 group-hover:scale-105" />
                  ) : (
                    <Moon className="w-4 h-4 transition-all duration-200 group-hover:scale-105" />
                  )}
                  <span className="font-medium text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-4 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={getPlaceholderText()}
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
