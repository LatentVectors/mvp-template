import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
} from '@/lib/content-utils'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MDXContent } from '@/components/blog/mdx-content'
import { PostNavigation } from '@/components/blog/post-navigation'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: 'MVP Template Team' }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: post.url,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&type=blog`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&type=blog`],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { previousPost, nextPost } = getAdjacentPosts(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="group">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            {post.title}
          </h1>

          <p className="text-muted-foreground text-xl">{post.description}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-gray dark:prose-invert lg:prose-lg max-w-none">
          <MDXContent code={post.body.code} />
        </article>

        {/* Post Navigation */}
        <PostNavigation previousPost={previousPost} nextPost={nextPost} />

        {/* Footer Navigation */}
        <footer className="mt-12 border-t pt-8">
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/blog">← Back to all posts</Link>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
