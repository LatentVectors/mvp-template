import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { CodeBlock } from '@/components/blog/code-block'
import { PostNavigation } from '@/components/blog/post-navigation'
import { TableOfContents } from '@/components/blog/table-of-contents'

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Blog Components', () => {
  describe('CodeBlock', () => {
    it('renders code with language label', () => {
      render(
        <CodeBlock className="language-javascript">
          console.log('Hello, world!');
        </CodeBlock>
      )

      expect(screen.getByText('javascript')).toBeInTheDocument()
      expect(
        screen.getByText("console.log('Hello, world!');")
      ).toBeInTheDocument()
    })

    it('defaults to text language when no className provided', () => {
      render(<CodeBlock>Plain text content</CodeBlock>)

      expect(screen.getByText('text')).toBeInTheDocument()
      expect(screen.getByText('Plain text content')).toBeInTheDocument()
    })
  })

  describe('PostNavigation', () => {
    const mockPosts = {
      previousPost: {
        slug: 'previous-post',
        title: 'Previous Post Title',
        url: '/blog/previous-post',
      },
      nextPost: {
        slug: 'next-post',
        title: 'Next Post Title',
        url: '/blog/next-post',
      },
    }

    it('renders both previous and next post links', () => {
      render(
        <PostNavigation
          previousPost={mockPosts.previousPost}
          nextPost={mockPosts.nextPost}
        />
      )

      expect(screen.getByText('Previous Post Title')).toBeInTheDocument()
      expect(screen.getByText('Next Post Title')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('renders only next post when no previous post', () => {
      render(<PostNavigation nextPost={mockPosts.nextPost} />)

      expect(screen.queryByText('Previous Post Title')).not.toBeInTheDocument()
      expect(screen.getByText('Next Post Title')).toBeInTheDocument()
    })

    it('renders only previous post when no next post', () => {
      render(<PostNavigation previousPost={mockPosts.previousPost} />)

      expect(screen.getByText('Previous Post Title')).toBeInTheDocument()
      expect(screen.queryByText('Next Post Title')).not.toBeInTheDocument()
    })

    it('renders nothing when no posts provided', () => {
      const { container } = render(<PostNavigation />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('TableOfContents', () => {
    beforeEach(() => {
      // Mock DOM methods used by TableOfContents
      vi.stubGlobal(
        'IntersectionObserver',
        vi.fn(() => ({
          observe: vi.fn(),
          disconnect: vi.fn(),
        }))
      )

      // Mock document.querySelectorAll to return empty array
      vi.spyOn(document, 'querySelectorAll').mockReturnValue([] as any)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
      vi.restoreAllMocks()
    })

    it('renders nothing when no headings found', () => {
      const { container } = render(<TableOfContents />)
      expect(container.firstChild).toBeNull()
    })

    it('applies custom className when provided', () => {
      // Mock some headings for this test
      const mockHeadings = [
        { id: 'heading-1', textContent: 'Heading 1', tagName: 'H1' },
      ]
      vi.spyOn(document, 'querySelectorAll').mockReturnValue(
        mockHeadings as any
      )

      render(<TableOfContents className="custom-class" />)

      expect(screen.getByRole('navigation')).toHaveClass('custom-class')
    })
  })
})
