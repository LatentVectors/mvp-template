import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAdjacentPosts } from '@/lib/content-utils'
import BlogPostPage from '@/app/(public)/blog/[slug]/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock the content-utils
vi.mock('@/lib/content-utils', () => ({
  getPostBySlug: vi.fn(),
  getAdjacentPosts: vi.fn(),
}))

// Mock utils
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn((date: string) => new Date(date).toLocaleDateString()),
  cn: vi.fn((...classes: unknown[]) => classes.filter(Boolean).join(' ')),
}))

// Mock MDX components
vi.mock('@/components/blog/mdx-content', () => ({
  MDXContent: ({ code }: { code: string }) => (
    <div data-testid="mdx-content">{code}</div>
  ),
}))

vi.mock('@/components/blog/post-navigation', () => ({
  PostNavigation: ({ previousPost, nextPost }: any) => (
    <div data-testid="post-navigation">
      {previousPost && <span>Previous: {previousPost.title}</span>}
      {nextPost && <span>Next: {nextPost.title}</span>}
    </div>
  ),
}))

const mockPost = {
  _id: 'test-post.mdx',
  _raw: {},
  type: 'Post',
  published: true,
  slug: 'test-post',
  title: 'Test Post Title',
  description: 'Test post description',
  date: '2024-01-01',
  readingTime: 5,
  url: '/blog/test-post',
  tags: ['react', 'typescript'],
  body: {
    code: 'Mock MDX content',
    raw: '',
  },
} as any

const mockAdjacentPosts = {
  previousPost: {
    slug: 'previous-post',
    title: 'Previous Post',
    url: '/blog/previous-post',
  },
  nextPost: {
    slug: 'next-post',
    title: 'Next Post',
    url: '/blog/next-post',
  },
}

describe('Blog Post Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders blog post content when post exists', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    vi.mocked(getAdjacentPosts).mockReturnValue(mockAdjacentPosts)

    const params = Promise.resolve({ slug: 'test-post' })
    render(await BlogPostPage({ params }))

    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText('Test post description')).toBeInTheDocument()
    expect(screen.getByText('5 min read')).toBeInTheDocument()
    expect(screen.getByTestId('mdx-content')).toBeInTheDocument()
  })

  it('displays post tags when available', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    vi.mocked(getAdjacentPosts).mockReturnValue(mockAdjacentPosts)

    const params = Promise.resolve({ slug: 'test-post' })
    render(await BlogPostPage({ params }))

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('renders back to blog navigation', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    vi.mocked(getAdjacentPosts).mockReturnValue(mockAdjacentPosts)

    const params = Promise.resolve({ slug: 'test-post' })
    render(await BlogPostPage({ params }))

    const backLinks = screen.getAllByText(/Back to/i)
    expect(backLinks.length).toBeGreaterThan(0)
  })

  it('renders post navigation when adjacent posts exist', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    vi.mocked(getAdjacentPosts).mockReturnValue(mockAdjacentPosts)

    const params = Promise.resolve({ slug: 'test-post' })
    render(await BlogPostPage({ params }))

    expect(screen.getByTestId('post-navigation')).toBeInTheDocument()
    expect(screen.getByText('Previous: Previous Post')).toBeInTheDocument()
    expect(screen.getByText('Next: Next Post')).toBeInTheDocument()
  })

  it('calls notFound when post does not exist', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(null)
    vi.mocked(getAdjacentPosts).mockReturnValue({
      previousPost: null,
      nextPost: null,
    })

    const params = Promise.resolve({ slug: 'non-existent-post' })

    // Since notFound() throws, we need to handle it
    try {
      await BlogPostPage({ params })
    } catch (error) {
      // Expected to throw
    }

    expect(notFound).toHaveBeenCalled()
  })

  it('renders post metadata correctly', async () => {
    vi.mocked(getPostBySlug).mockReturnValue(mockPost)
    vi.mocked(getAdjacentPosts).mockReturnValue(mockAdjacentPosts)

    const params = Promise.resolve({ slug: 'test-post' })
    render(await BlogPostPage({ params }))

    // Check for calendar and clock icons content
    expect(screen.getByText('5 min read')).toBeInTheDocument()

    // Check that date is formatted and displayed
    const dateElement = screen.getByText(
      new Date('2024-01-01').toLocaleDateString()
    )
    expect(dateElement).toBeInTheDocument()
  })
})
