/**
 * Content processing utilities for blog posts and other content
 */

import { allPosts } from '.contentlayer/generated'

export interface ContentItem {
  title: string
  date: string
  tags?: string[] | undefined
  [key: string]: unknown
}

/**
 * Generate a text excerpt from HTML or markdown content
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 160
): string {
  // Strip HTML tags
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-z]+;/gi, '') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  if (textContent.length <= maxLength) {
    return textContent
  }

  // Find the last complete sentence within maxLength
  const truncated = textContent.substring(0, maxLength)
  const lastSentence = truncated.lastIndexOf('.')
  const lastSpace = truncated.lastIndexOf(' ')

  // Prefer sentence boundary, fall back to word boundary
  if (lastSentence > maxLength * 0.6) {
    return textContent.substring(0, lastSentence + 1)
  } else if (lastSpace > maxLength * 0.6) {
    return textContent.substring(0, lastSpace) + '...'
  } else {
    return truncated + '...'
  }
}

/**
 * Calculate reading time for text content
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): string {
  // Strip HTML and normalize whitespace
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-z]+;/gi, '') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  if (!textContent || textContent.length === 0) {
    return '1 min read'
  }

  const wordCount = textContent.split(' ').length
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute)

  return readingTimeMinutes === 1
    ? '1 min read'
    : `${readingTimeMinutes} min read`
}

/**
 * Sort posts by date in descending order (newest first)
 */
export function sortPostsByDate<T extends ContentItem>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    // Handle invalid dates by putting them at the end
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) {
      return 0
    }
    if (isNaN(dateA.getTime())) {
      return 1
    }
    if (isNaN(dateB.getTime())) {
      return -1
    }

    return dateB.getTime() - dateA.getTime()
  })
}

/**
 * Filter posts by a specific tag
 */
export function filterPostsByTag<T extends ContentItem>(
  posts: T[],
  tag: string
): T[] {
  return posts.filter(
    post => post.tags && Array.isArray(post.tags) && post.tags.includes(tag)
  )
}

/**
 * Get unique tags from all posts
 */
export function getAllTags<T extends ContentItem>(posts: T[]): string[] {
  const tagSet = new Set<string>()

  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagSet.add(tag))
    }
  })

  return Array.from(tagSet).sort()
}

/**
 * Group posts by year for archive display
 */
export function groupPostsByYear<T extends ContentItem>(
  posts: T[]
): Record<string, T[]> {
  const postsByYear: Record<string, T[]> = {}

  posts.forEach(post => {
    const year = new Date(post.date).getFullYear().toString()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })

  return postsByYear
}

/**
 * Get related posts based on shared tags
 */
export function getRelatedPosts<T extends ContentItem>(
  currentPost: T,
  allPosts: T[],
  limit: number = 3
): T[] {
  if (!currentPost.tags || !Array.isArray(currentPost.tags)) {
    return []
  }

  const currentTags = currentPost.tags
  const otherPosts = allPosts.filter(post => post !== currentPost)

  // Score posts based on number of shared tags
  const scoredPosts = otherPosts.map(post => {
    if (!post.tags || !Array.isArray(post.tags)) {
      return { post, score: 0 }
    }

    const sharedTags = post.tags.filter(tag => currentTags.includes(tag))
    return { post, score: sharedTags.length }
  })

  // Sort by score (most shared tags first), then by date
  return scoredPosts
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })
    .slice(0, limit)
    .map(({ post }) => post)
}

/**
 * Validate post frontmatter
 */
export function validatePost(post: unknown): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!post || typeof post !== 'object') {
    errors.push('Post must be an object')
    return { valid: false, errors }
  }

  const postObj = post as Record<string, unknown>

  if (!postObj.title || typeof postObj.title !== 'string') {
    errors.push('Title is required and must be a string')
  }

  if (!postObj.date) {
    errors.push('Date is required')
  } else if (
    typeof postObj.date === 'string' &&
    isNaN(new Date(postObj.date).getTime())
  ) {
    errors.push('Date must be a valid date')
  }

  if (postObj.tags && !Array.isArray(postObj.tags)) {
    errors.push('Tags must be an array')
  }

  if (
    postObj.published !== undefined &&
    typeof postObj.published !== 'boolean'
  ) {
    errors.push('Published must be a boolean')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get all posts from contentlayer
 */
export function getAllPosts() {
  return allPosts
}

/**
 * Get a post by its slug
 */
export function getPostBySlug(slug: string) {
  return allPosts.find(post => post.slug === slug) ?? null
}

/**
 * Get the previous and next posts for a given post
 */
export function getAdjacentPosts(currentSlug: string) {
  const posts = getAllPosts()
  const sortedPosts = sortPostsByDate(posts)
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug)

  if (currentIndex === -1) {
    return { previousPost: null, nextPost: null }
  }

  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const nextPost =
    currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return {
    previousPost: previousPost
      ? {
          slug: previousPost.slug as string,
          title: previousPost.title as string,
          url: previousPost.url as string,
        }
      : null,
    nextPost: nextPost
      ? {
          slug: nextPost.slug as string,
          title: nextPost.title as string,
          url: nextPost.url as string,
        }
      : null,
  }
}
