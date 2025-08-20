import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateMetadata } from '@/app/(public)/blog/[slug]/page'
import { metadata as blogIndexMetadata } from '@/app/(public)/blog/page'

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

vi.mock('@/lib/content-utils', () => {
  return {
    getPostBySlug: vi.fn((slug: string) => {
      if (slug === 't') {
        return {
          slug: 't',
          title: 'T',
          description: 'D',
          date: '2024-01-01',
          url: '/blog/t',
          tags: ['seo'],
          body: { code: '', raw: '' },
        }
      }
      return null
    }),
  }
})

describe('SEO Metadata Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates blog post metadata from real generator', async () => {
    const md = await generateMetadata({
      params: Promise.resolve({ slug: 't' }),
    } as any)

    expect(md.title).toBe('T')
    // OpenGraph basic fields should be present
    expect(md.openGraph).toBeDefined()
    expect(md.openGraph?.url).toBe('/blog/t')
    // Twitter metadata present
    expect(md.twitter).toBeDefined()
  })

  it('returns non-indexable metadata for missing post', async () => {
    const md = await generateMetadata({
      params: Promise.resolve({ slug: 'missing' }),
    } as any)
    if (typeof md.robots === 'object' && md.robots) {
      expect(md.robots.index).toBe(false)
      expect(md.robots.follow).toBe(false)
    } else {
      // Fallback: ensure robots exists
      expect(md.robots).toBeDefined()
    }
  })

  it('exposes blog index metadata export', () => {
    expect(blogIndexMetadata.title).toBeDefined()
    expect(blogIndexMetadata.openGraph).toBeDefined()
  })
})
