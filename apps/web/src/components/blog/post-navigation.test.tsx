import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { PostNavigation } from './post-navigation'

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

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
