import { NextResponse } from 'next/server'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://coinfeedly.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin or private areas (if any)
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /blog
Allow: /charts
Allow: /crypto/
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
