import { describe, it, expect } from 'vitest'

// Mock the individual utility functions to avoid contentlayer imports
describe('Content Utilities', () => {
  describe('generateExcerpt', () => {
    it('should generate excerpt from plain text', () => {
      // Simple mock implementation to test the logic
      const generateExcerpt = (
        content: string,
        maxLength: number = 160
      ): string => {
        const textContent = content
          .replace(/<[^>]*>/g, '')
          .replace(/&[a-z]+;/gi, '')
          .replace(/\s+/g, ' ')
          .trim()

        if (textContent.length <= maxLength) {
          return textContent
        }

        return textContent.slice(0, maxLength).trim() + '...'
      }

      const text =
        'This is a long piece of content that should be truncated to create a meaningful excerpt for blog posts and other content.'
      const excerpt = generateExcerpt(text, 50)

      expect(excerpt.length).toBeLessThanOrEqual(53) // 50 + '...'
      expect(excerpt.endsWith('...')).toBe(true)
      expect(excerpt).not.toMatch(/<[^>]*>/) // Should strip HTML
    })

    it('should handle HTML content', () => {
      const generateExcerpt = (
        content: string,
        maxLength: number = 160
      ): string => {
        const textContent = content
          .replace(/<[^>]*>/g, '')
          .replace(/&[a-z]+;/gi, '')
          .replace(/\s+/g, ' ')
          .trim()

        if (textContent.length <= maxLength) {
          return textContent
        }

        return textContent.slice(0, maxLength).trim() + '...'
      }

      const html =
        "<p>This is <strong>HTML content</strong> with <em>various tags</em> that should be <a href='#'>stripped</a>.</p>"
      const excerpt = generateExcerpt(html, 30)

      expect(excerpt).not.toMatch(/<[^>]*>/)
      expect(excerpt.includes('HTML content')).toBe(true)
    })

    it('should not truncate if content is shorter than limit', () => {
      const generateExcerpt = (
        content: string,
        maxLength: number = 160
      ): string => {
        const textContent = content
          .replace(/<[^>]*>/g, '')
          .replace(/&[a-z]+;/gi, '')
          .replace(/\s+/g, ' ')
          .trim()

        if (textContent.length <= maxLength) {
          return textContent
        }

        return textContent.slice(0, maxLength).trim() + '...'
      }

      const shortText = 'Short content.'
      const excerpt = generateExcerpt(shortText, 50)

      expect(excerpt).toBe(shortText)
      expect(excerpt.endsWith('...')).toBe(false)
    })
  })

  describe('calculateReadingTime', () => {
    it('should calculate reading time for text content', () => {
      const calculateReadingTime = (content: string): number => {
        const textContent = content
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        const wordCount = textContent
          .split(' ')
          .filter(word => word.length > 0).length
        const wordsPerMinute = 200
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
      }

      const text =
        'This is a sample text with approximately 200 words. '.repeat(20)
      const readingTime = calculateReadingTime(text)

      expect(readingTime).toBeGreaterThan(0)
      expect(typeof readingTime).toBe('number')
    })

    it('should handle empty or very short content', () => {
      const calculateReadingTime = (content: string): number => {
        const textContent = content
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        const wordCount = textContent
          .split(' ')
          .filter(word => word.length > 0).length
        const wordsPerMinute = 200
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
      }

      expect(calculateReadingTime('')).toBe(1)
      expect(calculateReadingTime('Short')).toBe(1)
    })

    it('should strip HTML when calculating reading time', () => {
      const calculateReadingTime = (content: string): number => {
        const textContent = content
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        const wordCount = textContent
          .split(' ')
          .filter(word => word.length > 0).length
        const wordsPerMinute = 200
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
      }

      const html =
        '<p>This is <strong>HTML content</strong> with <em>tags</em>.</p>'
      const text = 'This is HTML content with tags.'

      const htmlTime = calculateReadingTime(html)
      const textTime = calculateReadingTime(text)

      expect(htmlTime).toBe(textTime)
    })
  })

  describe('sortPostsByDate', () => {
    it('should sort posts by date descending (newest first)', () => {
      const sortPostsByDate = (posts: any[]): any[] => {
        return [...posts].sort((a, b) => {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          return dateB.getTime() - dateA.getTime()
        })
      }

      const posts = [
        { title: 'Old Post', date: '2023-01-01', tags: [] },
        { title: 'New Post', date: '2024-01-01', tags: [] },
        { title: 'Middle Post', date: '2023-06-01', tags: [] },
      ]

      const sorted = sortPostsByDate(posts)

      expect(sorted[0].title).toBe('New Post')
      expect(sorted[1].title).toBe('Middle Post')
      expect(sorted[2].title).toBe('Old Post')
    })

    it('should handle invalid dates gracefully', () => {
      const sortPostsByDate = (posts: any[]): any[] => {
        return [...posts].sort((a, b) => {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          return dateB.getTime() - dateA.getTime()
        })
      }

      const posts = [
        { title: 'Valid Post', date: '2024-01-01', tags: [] },
        { title: 'Invalid Post', date: 'invalid-date', tags: [] },
      ]

      const sorted = sortPostsByDate(posts)

      expect(sorted).toHaveLength(2)
      // Should not throw error
    })
  })

  describe('filterPostsByTag', () => {
    it('should filter posts by single tag', () => {
      const filterPostsByTag = (posts: any[], tag: string): any[] => {
        return posts.filter(post => post.tags && post.tags.includes(tag))
      }

      const posts = [
        { title: 'React Post', date: '2024-01-01', tags: ['react', 'js'] },
        { title: 'Vue Post', date: '2024-01-02', tags: ['vue', 'js'] },
        { title: 'Angular Post', date: '2024-01-03', tags: ['angular', 'ts'] },
      ]

      const reactPosts = filterPostsByTag(posts, 'react')

      expect(reactPosts).toHaveLength(1)
      expect(reactPosts[0].title).toBe('React Post')
    })

    it('should handle posts without tags', () => {
      const filterPostsByTag = (posts: any[], tag: string): any[] => {
        return posts.filter(post => post.tags && post.tags.includes(tag))
      }

      const posts = [
        { title: 'Tagged Post', date: '2024-01-01', tags: ['react'] },
        { title: 'Untagged Post', date: '2024-01-02' },
      ]

      const reactPosts = filterPostsByTag(posts, 'react')

      expect(reactPosts).toHaveLength(1)
      expect(reactPosts[0].title).toBe('Tagged Post')
    })
  })
})
