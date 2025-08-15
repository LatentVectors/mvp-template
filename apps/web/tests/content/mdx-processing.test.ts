import { describe, it, expect } from 'vitest'
import { allPosts } from '../../.contentlayer/generated'

describe('MDX Processing', () => {
  it('should process GitHub Flavored Markdown features', () => {
    // Find a post that might contain GFM features
    const postsWithContent = allPosts.filter(
      post => post.body.code.length > 100
    )

    if (postsWithContent.length > 0) {
      postsWithContent.forEach(post => {
        const code = post.body.code

        // Should handle strikethrough (check for del element in compiled code)
        if (post.body.raw.includes('~~')) {
          expect(code).toMatch(/del/)
        }

        // Should handle tables (check for table elements in compiled code)
        if (post.body.raw.includes('|')) {
          expect(code).toMatch(/table|thead|tbody|tr|td/)
        }

        // Should handle task lists (check for checkbox inputs in compiled code)
        if (
          post.body.raw.includes('- [ ]') ||
          post.body.raw.includes('- [x]')
        ) {
          expect(code).toMatch(/checkbox/)
        }
      })
    }
  })

  it('should generate heading anchors with rehype-slug', () => {
    allPosts.forEach(post => {
      const code = post.body.code

      // Check for heading IDs in the compiled code
      if (post.body.raw.includes('#')) {
        expect(code).toMatch(
          /id.*welcome-to-our-blog|id.*getting-started-with-nextjs|id.*features-were-demonstrating/
        )
      }
    })
  })

  it('should generate heading anchor links with rehype-autolink-headings', () => {
    allPosts.forEach(post => {
      const code = post.body.code

      // Check for anchor links in the compiled code
      if (post.body.raw.includes('#')) {
        expect(code).toMatch(/heading-anchor/)
        expect(code).toMatch(/Link to section/)
      }
    })
  })

  it('should apply syntax highlighting to code blocks', () => {
    allPosts.forEach(post => {
      const code = post.body.code

      // Check for syntax highlighting in code blocks
      if (post.body.raw.includes('```')) {
        expect(code).toMatch(/hljs/)
        expect(code).toMatch(/language-tsx|language-typescript/)
      }
    })
  })

  it('should preserve custom MDX components', () => {
    allPosts.forEach(post => {
      const code = post.body.code

      // Check that custom components are compiled properly
      // The code should not contain raw component syntax
      expect(code).not.toMatch(/<.*Component.*>/)
      expect(code).toMatch(/jsx|jsxs/) // Should contain React JSX calls
    })
  })

  it('should handle frontmatter validation errors gracefully', () => {
    // This test ensures our schema validation works
    // All posts in allPosts should have passed validation
    allPosts.forEach(post => {
      expect(post._id).toBeDefined()
      expect(post._raw).toBeDefined()
      expect(post.title).toBeDefined()
      expect(post.date).toBeDefined()
    })
  })
})
