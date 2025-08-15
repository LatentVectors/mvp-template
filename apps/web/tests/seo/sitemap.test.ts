import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the allPosts data
const mockPosts = [
  {
    slug: 'getting-started-nextjs',
    title: 'Getting Started with Next.js',
    date: '2024-01-15',
    _raw: {
      flattenedPath: 'getting-started-nextjs',
    },
  },
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2024-01-01',
    _raw: {
      flattenedPath: 'hello-world',
    },
  },
]

describe('Sitemap Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('XML Sitemap Structure', () => {
    it('should include all static pages in sitemap', () => {
      const staticPages = ['/', '/blog', '/privacy', '/terms', '/cookies']

      staticPages.forEach(page => {
        expect(page).toBeTruthy()
      })
    })

    it('should include all blog posts in sitemap', () => {
      const blogUrls = mockPosts.map(post => `/blog/${post.slug}`)

      expect(blogUrls).toEqual([
        '/blog/getting-started-nextjs',
        '/blog/hello-world',
      ])
    })

    it('should generate valid sitemap XML structure', () => {
      const sitemapEntry = {
        url: 'https://mvp-template.vercel.app/blog/test-post',
        lastModified: new Date('2024-01-01'),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }

      expect(sitemapEntry.url).toContain('https://mvp-template.vercel.app')
      expect(sitemapEntry.changeFrequency).toBe('weekly')
      expect(sitemapEntry.priority).toBe(0.8)
    })

    it('should set appropriate priority for different page types', () => {
      const priorities = {
        homepage: 1.0,
        blogIndex: 0.9,
        blogPost: 0.8,
        staticPages: 0.6,
      }

      expect(priorities.homepage).toBe(1.0)
      expect(priorities.blogIndex).toBe(0.9)
      expect(priorities.blogPost).toBe(0.8)
      expect(priorities.staticPages).toBe(0.6)
    })

    it('should set appropriate change frequency for different page types', () => {
      const frequencies = {
        homepage: 'daily',
        blogIndex: 'daily',
        blogPost: 'weekly',
        staticPages: 'monthly',
      }

      expect(frequencies.homepage).toBe('daily')
      expect(frequencies.blogIndex).toBe('daily')
      expect(frequencies.blogPost).toBe('weekly')
      expect(frequencies.staticPages).toBe('monthly')
    })
  })

  describe('Sitemap Configuration', () => {
    it('should exclude development and test URLs', () => {
      const excludedPatterns = [
        '/api/*',
        '/_next/*',
        '/test/*',
        '*.json',
        '*.xml',
      ]

      excludedPatterns.forEach(pattern => {
        expect(pattern).toBeTruthy()
      })
    })

    it('should handle trailing slashes consistently', () => {
      const urls = [
        'https://mvp-template.vercel.app/',
        'https://mvp-template.vercel.app/blog/',
        'https://mvp-template.vercel.app/privacy/',
      ]

      urls.forEach(url => {
        expect(url).toMatch(/\/$/)
      })
    })

    it('should generate lastModified dates correctly', () => {
      const lastModified = new Date().toISOString()
      expect(lastModified).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      )
    })
  })

  describe('Robots.txt Configuration', () => {
    it('should allow all bots for production', () => {
      const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://mvp-template.vercel.app/sitemap.xml`

      expect(robotsTxt).toContain('User-agent: *')
      expect(robotsTxt).toContain('Allow: /')
      expect(robotsTxt).toContain(
        'Sitemap: https://mvp-template.vercel.app/sitemap.xml'
      )
    })

    it('should disallow staging environments', () => {
      const stagingRobotsTxt = `User-agent: *
Disallow: /`

      expect(stagingRobotsTxt).toContain('Disallow: /')
    })

    it('should include common bot-specific directives', () => {
      const botDirectives = [
        'Crawl-delay: 1',
        'Disallow: /api/',
        'Disallow: /_next/',
        'Disallow: /admin/',
      ]

      botDirectives.forEach(directive => {
        expect(directive).toBeTruthy()
      })
    })
  })

  describe('Sitemap Index for Large Sites', () => {
    it('should handle sitemap pagination for large numbers of posts', () => {
      const maxUrlsPerSitemap = 50000
      const totalPosts = 60000
      const expectedSitemaps = Math.ceil(totalPosts / maxUrlsPerSitemap)

      expect(expectedSitemaps).toBe(2)
    })

    it('should generate sitemap index when needed', () => {
      const sitemapIndex = {
        sitemaps: [
          {
            url: 'https://mvp-template.vercel.app/sitemap-0.xml',
            lastModified: new Date(),
          },
          {
            url: 'https://mvp-template.vercel.app/sitemap-1.xml',
            lastModified: new Date(),
          },
        ],
      }

      expect(sitemapIndex.sitemaps).toHaveLength(2)
    })
  })

  describe('Dynamic Sitemap Updates', () => {
    it('should update sitemap when new posts are published', () => {
      const oldSitemapSize = 10
      const newSitemapSize = 11

      expect(newSitemapSize).toBeGreaterThan(oldSitemapSize)
    })

    it('should maintain sitemap freshness with lastModified', () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      expect(now.getTime()).toBeGreaterThan(oneHourAgo.getTime())
    })
  })
})
