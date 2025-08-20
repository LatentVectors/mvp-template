import {
  type ComputedFields,
  defineDocumentType,
  makeSource,
} from 'contentlayer2/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc: any) => {
      // Remove the 'posts/' directory from the path for cleaner URLs
      return doc._raw.flattenedPath.replace(/^posts\//, '')
    },
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc: any) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  url: {
    type: 'string',
    resolve: (doc: any) => {
      // Remove the 'posts/' directory from the path for cleaner URLs
      const path = doc._raw.flattenedPath.replace(/^posts\//, '')
      return `/blog/${path}`
    },
  },
  readingTime: {
    type: 'string',
    resolve: (doc: any) => {
      // Simple reading time calculation: ~200 words per minute
      const wordsPerMinute = 200
      const textContent = doc.body.raw.replace(/\s+/g, ' ').trim()
      const wordCount = textContent.split(' ').length
      const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute)
      return `${readingTimeMinutes} min read`
    },
  },
  excerpt: {
    type: 'string',
    resolve: (doc: any) => {
      if (doc.description) {
        return doc.description
      }
      // Generate excerpt from content if no description provided
      const textContent = doc.body.raw
        .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/#+ /g, '') // Remove heading markers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
        .replace(/`(.*?)`/g, '$1') // Remove code markers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()

      if (textContent.length <= 160) {
        return textContent
      }

      // Find the last complete sentence within 160 characters
      const truncated = textContent.substring(0, 160)
      const lastSentence = truncated.lastIndexOf('.')
      const lastSpace = truncated.lastIndexOf(' ')

      if (lastSentence > 100) {
        return textContent.substring(0, lastSentence + 1)
      } else if (lastSpace > 100) {
        return textContent.substring(0, lastSpace) + '...'
      } else {
        return truncated + '...'
      }
    },
  },
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description:
        'A brief description of the post (optional, will generate excerpt if not provided)',
      required: false,
    },
    date: {
      type: 'date',
      description: 'The date the post was published',
      required: true,
    },
    published: {
      type: 'boolean',
      description: 'Whether the post is published or draft',
      default: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'List of tags for the post',
      required: false,
    },
    author: {
      type: 'string',
      description: 'The author of the post',
      required: false,
    },
    image: {
      type: 'string',
      description: 'Featured image URL for the post',
      required: false,
    },
    imageAlt: {
      type: 'string',
      description: 'Alt text for the featured image',
      required: false,
    },
  },
  computedFields,
}))

export const LegalPage = defineDocumentType(() => ({
  name: 'LegalPage',
  filePathPattern: `legal/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the legal page',
      required: true,
    },
    description: {
      type: 'string',
      description: 'A brief description of the legal page',
      required: false,
    },
    lastUpdated: {
      type: 'date',
      description: 'When the legal page was last updated',
      required: true,
    },
    slug: {
      type: 'string',
      description: 'The URL slug for the page',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc: any) => `/${doc.slug}`,
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post, LegalPage],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
      [
        rehypeHighlight,
        {
          ignoreMissing: true,
          subset: false,
        },
      ],
    ],
  },
})
