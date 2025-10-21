'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import NewsFeed from '@/components/NewsFeed'
import CategoryFilter from '@/components/CategoryFilter'
import Footer from '@/components/Footer'
import { Article } from '@/types'
import { FinancePrice } from '@/lib/finance-api'

export default function Home() {
  const searchParams = useSearchParams()
  const [allArticles, setAllArticles] = useState<Article[]>([]) // Store all articles
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]) // Display filtered articles
  const [financePrices, setFinancePrices] = useState<FinancePrice[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [categoryCounts, setCategoryCounts] = useState({ 
    all: 0, stocks: 0, commodities: 0, forex: 0, bonds: 0, indices: 0, 
    etfs: 0, crypto: 0, economics: 0, markets: 0, technology: 0, 
    energy: 0, healthcare: 0, financial_services: 0, real_estate: 0, 
    consumer_goods: 0, industrials: 0 
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    
    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  useEffect(() => {
    fetchNews(true)
    fetchFinancePrices()
    fetchCategoryCounts()
  }, [])

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
    setHasMore(true)
  }, [selectedCategory, searchQuery])

  // Load all articles once
  useEffect(() => {
    fetchNews(true) // Load all articles
  }, [])

  // Filter articles on frontend when category/search/sort changes
  useEffect(() => {
    if (allArticles.length === 0) return
    
    setSearching(true)
    
    let filtered = [...allArticles]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => {
        const primaryCategory = article.primaryCategory?.toUpperCase()
        const selectedCategoryUpper = selectedCategory.toUpperCase()
        return primaryCategory === selectedCategoryUpper
      })
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        (article.description && article.description.toLowerCase().includes(query))
      )
    }
    
    // Remove duplicates based on URL and title
    const uniqueArticles = filtered.filter((article, index, self) => 
      index === self.findIndex(a => 
        a.url === article.url || 
        (a.title === article.title && a.title !== 'Untitled')
      )
    )
    
    // Sort articles
    // Sort by newest first (default)
    uniqueArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime()
      const dateB = new Date(b.publishedAt).getTime()
      return dateB - dateA
    })
    
    setFilteredArticles(uniqueArticles)
    setSearching(false)
  }, [allArticles, selectedCategory, searchQuery])

  const fetchNews = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      }
      
      console.log('🔍 Fetching all articles from API...')
      const response = await fetch('/api/news')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📰 Received articles:', data.length, 'articles')
      console.log('📊 Sample article:', data[0] ? {
        title: data[0].title,
        category: data[0].primaryCategory,
        publishedAt: data[0].publishedAt
      } : 'No articles')
      
      setAllArticles(Array.isArray(data) ? data : [])
      setHasMore(false) // No pagination needed since we get all articles
    } catch (error) {
      console.error('❌ Error fetching news:', error)
      if (reset) {
        setAllArticles([])
      }
    } finally {
      setLoading(false)
      setSearching(false)
      setLoadingMore(false)
    }
  }

  const fetchFinancePrices = async () => {
    try {
      const response = await fetch('/api/finance-ticker')
      const data = await response.json()
      setFinancePrices(data)
    } catch (error) {
      console.error('Error fetching finance prices:', error)
    }
  }

  const fetchCategoryCounts = async () => {
    try {
      const categories = [
        'all', 'stocks', 'commodities', 'forex', 'bonds', 'indices', 
        'etfs', 'crypto', 'economics', 'markets', 'technology', 
        'energy', 'healthcare', 'financial_services', 'real_estate', 
        'consumer_goods', 'industrials'
      ]
      const counts = { 
        all: 0, stocks: 0, commodities: 0, forex: 0, bonds: 0, indices: 0, 
        etfs: 0, crypto: 0, economics: 0, markets: 0, technology: 0, 
        energy: 0, healthcare: 0, financial_services: 0, real_estate: 0, 
        consumer_goods: 0, industrials: 0 
      }
      
      for (const category of categories) {
        const response = await fetch(`/api/news?category=${category}`)
        const data = await response.json()
        counts[category as keyof typeof counts] = Array.isArray(data) ? data.length : 0
      }
      
      setCategoryCounts(counts)
    } catch (error) {
      console.error('Error fetching category counts:', error)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchNews(false)
    }
  }


  const categories = [
    { id: 'all', name: 'All News', count: categoryCounts.all },
    { id: 'stocks', name: 'Stocks', count: categoryCounts.stocks },
    { id: 'commodities', name: 'Commodities', count: categoryCounts.commodities },
    { id: 'forex', name: 'Forex', count: categoryCounts.forex },
    { id: 'bonds', name: 'Bonds', count: categoryCounts.bonds },
    { id: 'indices', name: 'Indices', count: categoryCounts.indices },
    { id: 'etfs', name: 'ETFs', count: categoryCounts.etfs },
    { id: 'crypto', name: 'Crypto', count: categoryCounts.crypto },
    { id: 'economics', name: 'Economics', count: categoryCounts.economics },
    { id: 'markets', name: 'Markets', count: categoryCounts.markets },
    { id: 'technology', name: 'Technology', count: categoryCounts.technology },
    { id: 'energy', name: 'Energy', count: categoryCounts.energy },
    { id: 'healthcare', name: 'Healthcare', count: categoryCounts.healthcare },
    { id: 'financial_services', name: 'Financial Services', count: categoryCounts.financial_services },
    { id: 'real_estate', name: 'Real Estate', count: categoryCounts.real_estate },
    { id: 'consumer_goods', name: 'Consumer Goods', count: categoryCounts.consumer_goods },
    { id: 'industrials', name: 'Industrials', count: categoryCounts.industrials },
  ]

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="w-full bg-slate-50 dark:bg-slate-950 relative flex-1">
        
        
        {/* Main Content */}
        <section className="py-6 sm:py-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            {/* Filters */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={handleCategoryChange}
                />
              </div>
            </div>
            
            {/* Search Status */}
            {(searching || searchQuery || selectedCategory !== 'all') && (
              <div className="text-center py-4">
                {searching ? (
                  <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <span>Showing results for:</span>
                    {selectedCategory !== 'all' && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                        "{searchQuery}"
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* News Feed */}
            <NewsFeed 
              articles={filteredArticles}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
