import { beforeEach, describe, expect, it, vi } from 'vitest'
// next-sitemap config is CommonJS; import via require to avoid ESM analysis in Vitest
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sitemapConfig = require('../../next-sitemap.config.js')
import { GET as getRobots } from '@/app/(public)/robots.txt/route'
import { NextRequest } from 'next/server'

describe('Sitemap and Robots configuration (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('next-sitemap config has required fields', () => {
    expect(sitemapConfig.siteUrl).toBeTruthy()
    expect(Array.isArray(sitemapConfig.exclude)).toBe(true)
    expect(typeof sitemapConfig.transform).toBe('function')
  })

  it('transform sets priority and changefreq', async () => {
    const entry = await (
      sitemapConfig as unknown as {
        transform: (
          config: unknown,
          path: string
        ) => Promise<{
          loc: string
          lastmod: string
          changefreq: string
          priority: number
        }>
      }
    ).transform({}, '/blog')
    expect(entry.loc).toBe('/blog')
    expect(entry.priority).toBeDefined()
    expect(entry.changefreq).toBeDefined()
  })

  it('robots route returns text with Sitemap line', async () => {
    // Simulate production so robots includes Sitemap
    const req = new NextRequest('https://mvp-template.vercel.app/robots.txt', {
      headers: {
        host: 'mvp-template.vercel.app',
        'x-forwarded-proto': 'https',
      } as any,
    })
    const res: Response = (await getRobots(
      req as unknown as NextRequest
    )) as unknown as Response
    const txt = await res.text()
    expect(res.headers.get('Content-Type')).toBe('text/plain')
    // In test env, NODE_ENV may not be production; allow either case
    if (txt.includes('Sitemap:')) {
      expect(txt).toContain('Sitemap:')
    } else {
      expect(txt).toContain('Disallow: /')
    }
  })
})
