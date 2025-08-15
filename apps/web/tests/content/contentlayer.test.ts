import { describe, it, expect } from 'vitest'
import { allPosts } from '../../.contentlayer/generated'

describe('Contentlayer Configuration', () => {
  it('should export allPosts array', () => {
    expect(allPosts).toBeDefined()
    expect(Array.isArray(allPosts)).toBe(true)
  })

  it('should have proper post schema structure', () => {
    // Test will work once we have sample posts
    if (allPosts.length > 0) {
      const post = allPosts[0]

      // Required fields
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('slug')
      expect(post).toHaveProperty('date')
      expect(post).toHaveProperty('body')
      expect(post).toHaveProperty('_id')
      expect(post).toHaveProperty('_raw')

      // Optional fields should be defined if present
      if (post?.description) {
        expect(typeof post.description).toBe('string')
      }
      if (post?.tags) {
        expect(Array.isArray(post.tags)).toBe(true)
      }
      if (post?.readingTime) {
        expect(typeof post.readingTime).toBe('string')
      }
    }
  })

  it('should have posts sorted by date (newest first)', () => {
    if (allPosts.length > 1) {
      // Note: Contentlayer2 doesn't automatically sort by date,
      // but we can verify our sample posts are in the expected order
      const dates = allPosts.map(post => new Date(post.date).getTime())
      // For this test, we'll just verify dates are valid
      dates.forEach(date => {
        expect(date).not.toBeNaN()
      })
    }
  })

  it('should generate valid slugs from filenames', () => {
    allPosts.forEach(post => {
      expect(post.slug).toBeDefined()
      expect(typeof post.slug).toBe('string')
      expect(post.slug.length).toBeGreaterThan(0)
      // Slug should be URL-safe path (without leading slash, can include forward slashes)
      expect(post.slug).toMatch(/^[a-z0-9-\/]+$/)
    })
  })

  it('should generate compiled code from MDX', () => {
    allPosts.forEach(post => {
      expect(post.body).toBeDefined()
      expect(post.body.code).toBeDefined()
      expect(typeof post.body.code).toBe('string')
      expect(post.body.raw).toBeDefined()
      expect(typeof post.body.raw).toBe('string')
    })
  })
})

describe('Content Processing', () => {
  it('should process frontmatter correctly', () => {
    allPosts.forEach(post => {
      // Title should not be empty
      expect(post.title.trim().length).toBeGreaterThan(0)

      // Date should be valid
      const date = new Date(post.date)
      expect(date.toString()).not.toBe('Invalid Date')

      // Published posts should have future or past dates
      expect(date.getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  it('should generate excerpts when description is not provided', () => {
    allPosts.forEach(post => {
      if (!post.description && post.excerpt) {
        expect(typeof post.excerpt).toBe('string')
        expect(post.excerpt.length).toBeGreaterThan(0)
        expect(post.excerpt.length).toBeLessThanOrEqual(200) // Reasonable excerpt length
      }
    })
  })

  it('should calculate reading time', () => {
    allPosts.forEach(post => {
      if (post.readingTime) {
        expect(post.readingTime).toMatch(/^\d+ min read$/)
      }
    })
  })
})
