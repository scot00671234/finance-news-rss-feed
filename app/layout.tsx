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
      { url: 'data:image/svg+xml,<svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="goldGradient" cx="50%25" cy="50%25" r="50%25"><stop offset="0%25" style="stop-color:%23FFD700;stop-opacity:1" /><stop offset="70%25" style="stop-color:%23FFA500;stop-opacity:1" /><stop offset="100%25" style="stop-color:%23B8860B;stop-opacity:1" /></radialGradient></defs><circle cx="14" cy="20" r="12" fill="url(%23goldGradient)" /><circle cx="26" cy="20" r="12" fill="url(%23goldGradient)" /></svg>', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    shortcut: 'data:image/svg+xml,<svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="goldGradient" cx="50%25" cy="50%25" r="50%25"><stop offset="0%25" style="stop-color:%23FFD700;stop-opacity:1" /><stop offset="70%25" style="stop-color:%23FFA500;stop-opacity:1" /><stop offset="100%25" style="stop-color:%23B8860B;stop-opacity:1" /></radialGradient></defs><circle cx="14" cy="20" r="12" fill="url(%23goldGradient)" /><circle cx="26" cy="20" r="12" fill="url(%23goldGradient)" /></svg>',
    apple: 'data:image/svg+xml,<svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="goldGradient" cx="50%25" cy="50%25" r="50%25"><stop offset="0%25" style="stop-color:%23FFD700;stop-opacity:1" /><stop offset="70%25" style="stop-color:%23FFA500;stop-opacity:1" /><stop offset="100%25" style="stop-color:%23B8860B;stop-opacity:1" /></radialGradient></defs><circle cx="14" cy="20" r="12" fill="url(%23goldGradient)" /><circle cx="26" cy="20" r="12" fill="url(%23goldGradient)" /></svg>',
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
        <link rel="icon" href="data:image/svg+xml,<svg width='32' height='32' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><radialGradient id='goldGradient' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' style='stop-color:%23FFD700;stop-opacity:1' /><stop offset='70%25' style='stop-color:%23FFA500;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23B8860B;stop-opacity:1' /></radialGradient></defs><circle cx='14' cy='20' r='12' fill='url(%23goldGradient)' /><circle cx='26' cy='20' r='12' fill='url(%23goldGradient)' /></svg>" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg width='32' height='32' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'><defs><radialGradient id='goldGradient' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' style='stop-color:%23FFD700;stop-opacity:1' /><stop offset='70%25' style='stop-color:%23FFA500;stop-opacity:1' /><stop offset='100%25' style='stop-color:%23B8860B;stop-opacity:1' /></radialGradient></defs><circle cx='14' cy='20' r='12' fill='url(%23goldGradient)' /><circle cx='26' cy='20' r='12' fill='url(%23goldGradient)' /></svg>" />
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
