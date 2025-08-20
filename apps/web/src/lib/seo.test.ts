import { describe, it, expect } from 'vitest'
import { pageMetadata } from '@/lib/seo'

type TwMeta = {
  card?: string
  title?: string
  description?: string
  images?: string | URL | (string | URL)[]
}

describe('pageMetadata (SEO utilities)', () => {
  it('builds complete metadata with OpenGraph and Twitter cards', () => {
    const meta = pageMetadata({
      title: 'About Us',
      description: 'Learn about our team and mission',
      pathname: '/about',
      keywords: ['about', 'company'],
      imageType: 'page',
      imageTitle: 'About Us',
    })

    expect(meta.title).toBe('About Us')
    expect(meta.description).toBe('Learn about our team and mission')
    expect(meta.keywords).toEqual(['about', 'company'])
    expect(meta.alternates?.canonical).toBe('/about')

    // OpenGraph
    expect(meta.openGraph).toBeDefined()
    expect(meta.openGraph?.title).toBe('About Us - MVP Template')
    expect(meta.openGraph?.description).toBe('Learn about our team and mission')
    type OGMeta = {
      type?: string
      url?: string
      siteName?: string
      images?:
        | { url?: string; alt?: string }
        | { url?: string; alt?: string }[]
        | string
        | URL
    }
    const og = meta.openGraph as OGMeta
    expect(og.type).toBe('website')
    expect(og.url).toBe('/about')
    expect(og.siteName).toBe('MVP Template')
    const ogImg0 = Array.isArray(og.images) ? og.images[0] : og.images
    if (typeof ogImg0 === 'string') {
      expect(ogImg0).toContain('/api/og?')
    } else if (ogImg0 instanceof URL) {
      expect(String(ogImg0)).toContain('/api/og?')
    } else {
      expect(ogImg0?.url).toContain('/api/og?')
      expect(ogImg0?.alt).toBe('MVP Template About Us')
    }

    // Twitter
    expect(meta.twitter).toBeDefined()
    const tw = meta.twitter as TwMeta
    expect(tw.card).toBe('summary_large_image')
    expect(tw.title).toBe('About Us - MVP Template')
    expect(tw.description).toBe('Learn about our team and mission')
    const twImg0 = Array.isArray(tw.images) ? tw.images[0] : tw.images
    expect(String(twImg0)).toContain('/api/og?')
  })

  it('uses sensible defaults and builds OG image URL from title/type', () => {
    const meta = pageMetadata({
      title: 'Privacy Policy',
      description: 'Our commitment to your privacy',
      pathname: '/legal/privacy',
      imageType: 'legal',
    })

    // Image URL should include encoded title and type
    const twForUrl = meta.twitter as TwMeta
    const ogUrl = String(
      Array.isArray(twForUrl?.images) ? twForUrl.images[0] : twForUrl?.images
    )
    expect(ogUrl).toContain('title=Privacy+Policy')
    expect(ogUrl).toContain('type=legal')
  })
})
