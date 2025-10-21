import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ClientHeader from '@/components/ClientHeader'
import FinanceTicker from '@/components/FinanceTicker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Barclayne - Financial Markets Intelligence Platform',
  description: 'Barclayne provides comprehensive financial market intelligence with real-time news, market data, and analysis across stocks, commodities, forex, and crypto markets.',
  keywords: 'Barclayne, financial markets, market intelligence, stock analysis, commodity trading, forex news, crypto markets, financial data, market research, investment insights',
  authors: [{ name: 'Barclayne' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Barclayne - Financial Markets Intelligence Platform',
    description: 'Comprehensive financial market intelligence with real-time news, market data, and analysis across all major asset classes.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barclayne - Financial Markets Intelligence Platform',
    description: 'Comprehensive financial market intelligence with real-time news, market data, and analysis.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4669482504741834" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4669482504741834"
     crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ClientHeader />
          <FinanceTicker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
