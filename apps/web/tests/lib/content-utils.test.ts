import { describe, expect, it, vi } from 'vitest'

// Mock contentlayer BEFORE importing the utilities that depend on it
vi.mock('.contentlayer/generated', () => ({
  allPosts: [],
}))

import {
  calculateReadingTime,
  filterPostsByTag,
  generateExcerpt,
  sortPostsByDate,
} from '@/lib/content-utils'

describe('Content Utilities (real implementations)', () => {
  describe('generateExcerpt', () => {
    it('prefers sentence boundary or falls back to word boundary', () => {
      const text = 'A sentence. Another one that is long enough to cut. Final.'
      const excerpt = generateExcerpt(text, 30)
      expect(excerpt).toMatch(/\.$|\.{3}$/)
    })

    it('strips HTML', () => {
      const html = '<p>Hello <strong>world</strong></p>'
      const excerpt = generateExcerpt(html, 10)
      expect(excerpt).not.toMatch(/<[^>]*>/)
    })
  })

  describe('calculateReadingTime', () => {
    it('returns formatted minutes string', () => {
      const text = 'word '.repeat(400) // ~2 minutes
      const rt = calculateReadingTime(text)
      expect(rt).toMatch(/min read$/)
    })

    it('handles empty content', () => {
      expect(calculateReadingTime('')).toBe('1 min read')
    })
  })

  describe('sortPostsByDate', () => {
    it('handles invalid dates by pushing them last', () => {
      const posts: Array<{ title: string; date: string }> = [
        { title: 'b', date: '2024-01-01' },
        { title: 'x', date: 'invalid' },
      ]
      const sorted = sortPostsByDate(posts)
      expect(sorted[0]!.title).toBe('b')
    })
  })

  describe('filterPostsByTag', () => {
    it('filters by tag', () => {
      const posts: Array<{ title: string; date: string; tags?: string[] }> = [
        { title: 'React', date: '2024-01-01', tags: ['react'] },
        { title: 'Vue', date: '2024-01-02', tags: ['vue'] },
      ]
      const filtered = filterPostsByTag(posts, 'react')
      expect(filtered).toHaveLength(1)
      expect(filtered[0]!.title).toBe('React')
    })
  })
})
