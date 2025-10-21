'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 dark:border-slate-800/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="goldGradientFooter" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" style={{stopColor:'#FFD700', stopOpacity:1}} />
                      <stop offset="70%" style={{stopColor:'#FFA500', stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#B8860B', stopOpacity:1}} />
                    </radialGradient>
                  </defs>
                  <circle cx="14" cy="20" r="12" fill="url(#goldGradientFooter)" />
                  <circle cx="26" cy="20" r="12" fill="url(#goldGradientFooter)" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Barclayne</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs">
              Your trusted source for cryptocurrency news, market analysis, and real-time price updates.
            </p>
          </div>


          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">About</h3>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">
                Barclayne aggregates the latest financial market news from trusted sources, 
                providing real-time market data and comprehensive analysis.
              </p>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Market Data</span>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Resources</h3>
            <div className="space-y-2">
              <Link 
                href="/blog" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Crypto News Blog
              </Link>
              <Link 
                href="/charts" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Price Charts
              </Link>
              <Link 
                href="/api/news" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                RSS Feed
              </Link>
              <Link 
                href="/legal" 
                className="block text-slate-400 hover:text-white transition-colors text-sm"
              >
                Legal Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/50 dark:border-slate-800/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © 2024 Barclayne. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <span>Powered by Real-time APIs</span>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
