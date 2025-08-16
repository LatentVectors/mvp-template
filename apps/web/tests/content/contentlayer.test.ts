import { describe, expect, it } from 'vitest'
import { allPosts } from '.contentlayer/generated'

describe('Contentlayer Configuration', () => {
  it('should export allPosts array', () => {
    expect(allPosts).toBeDefined()
    expect(Array.isArray(allPosts)).toBe(true)
    expect(allPosts.length).toBeGreaterThan(0)
  })

  it('should have proper post schema structure', () => {
    const post = allPosts[0]!
    expect(post.title).toBeDefined()
    expect(post.slug).toBeDefined()
    expect(post.date).toBeDefined()
    expect(post.body.raw).toBeDefined()
    expect(post.body.code).toBeDefined()
  })

  it('should have valid dates', () => {
    const dates = allPosts.map(post => new Date(post.date).getTime())
    dates.forEach(date => {
      expect(date).not.toBeNaN()
    })
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
    const post = allPosts[0]!
    expect(typeof post.body.code).toBe('string')
    expect(typeof post.body.raw).toBe('string')
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
