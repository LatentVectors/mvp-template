import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { getAllPosts } from '@/lib/content-utils'
import BlogPage from '@/app/(public)/blog/page'

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
  getAllPosts: vi.fn(),
}))

// Mock utils
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn((date: string) => new Date(date).toLocaleDateString()),
  cn: vi.fn((...classes: unknown[]) => classes.filter(Boolean).join(' ')),
}))

const mockPosts = [
  {
    _id: 'test-post-1.mdx',
    _raw: {},
    type: 'Post',
    published: true,
    slug: 'test-post-1',
    title: 'Test Post 1',
    description: 'Description for test post 1',
    date: '2024-01-01',
    readingTime: 5,
    url: '/blog/test-post-1',
    tags: ['react', 'typescript'],
    body: { code: '', raw: '' },
  },
  {
    _id: 'test-post-2.mdx',
    _raw: {},
    type: 'Post',
    published: true,
    slug: 'test-post-2',
    title: 'Test Post 2',
    description: 'Description for test post 2',
    date: '2024-01-02',
    readingTime: 3,
    url: '/blog/test-post-2',
    tags: ['nextjs'],
    body: { code: '', raw: '' },
  },
] as any[]

describe('Blog Index Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders blog page header correctly', () => {
    vi.mocked(getAllPosts).mockReturnValue(mockPosts)

    render(<BlogPage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Blog')
    expect(
      screen.getByText('Latest articles, tutorials, and insights from our team')
    ).toBeInTheDocument()
  })

  it('renders list of blog posts when posts exist', () => {
    vi.mocked(getAllPosts).mockReturnValue(mockPosts)

    render(<BlogPage />)

    // Check that both posts are rendered
    expect(screen.getByText('Test Post 1')).toBeInTheDocument()
    expect(screen.getByText('Test Post 2')).toBeInTheDocument()
    expect(screen.getByText('Description for test post 1')).toBeInTheDocument()
    expect(screen.getByText('Description for test post 2')).toBeInTheDocument()
  })

  it('renders post metadata correctly', () => {
    vi.mocked(getAllPosts).mockReturnValue(mockPosts)

    render(<BlogPage />)

    // Check reading time
    expect(screen.getByText('5 min read')).toBeInTheDocument()
    expect(screen.getByText('3 min read')).toBeInTheDocument()

    // Check tags
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
  })

  it('renders read more buttons for each post', () => {
    vi.mocked(getAllPosts).mockReturnValue(mockPosts)

    render(<BlogPage />)

    const readMoreButtons = screen.getAllByText('Read more')
    expect(readMoreButtons).toHaveLength(2)
  })

  it('renders empty state when no posts exist', () => {
    vi.mocked(getAllPosts).mockReturnValue([])

    render(<BlogPage />)

    expect(screen.getByText('No posts yet')).toBeInTheDocument()
    expect(
      screen.getByText('Check back soon for our latest articles and insights.')
    ).toBeInTheDocument()
  })

  it('post titles are clickable links', () => {
    vi.mocked(getAllPosts).mockReturnValue(mockPosts)

    render(<BlogPage />)

    const postLink1 = screen.getByRole('link', { name: 'Test Post 1' })
    const postLink2 = screen.getByRole('link', { name: 'Test Post 2' })

    expect(postLink1).toHaveAttribute('href', '/blog/test-post-1')
    expect(postLink2).toHaveAttribute('href', '/blog/test-post-2')
  })
})
