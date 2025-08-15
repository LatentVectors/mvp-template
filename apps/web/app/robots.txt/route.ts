import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'mvp-template.vercel.app'
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  // Check if this is a production environment
  const isProduction =
    process.env.NODE_ENV === 'production' &&
    !host.includes('localhost') &&
    !host.includes('.vercel.app') // Exclude preview deployments

  const robotsTxt = generateRobotsTxt(baseUrl, isProduction)

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function generateRobotsTxt(baseUrl: string, isProduction: boolean): string {
  if (!isProduction) {
    // Disallow all crawling for non-production environments
    return `User-agent: *
Disallow: /

# This is a staging/development environment
# Crawling is disabled to prevent indexing`
  }

  // Production robots.txt
  return `User-agent: *
Allow: /

# Disallow specific paths
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /test/
Disallow: /*.json$
Disallow: /*?*utm_*

# Crawl delay for politeness
Crawl-delay: 1

# Special instructions for specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block problematic bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`
}
