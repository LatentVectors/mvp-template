import React from 'react'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import {
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from '@/lib/content-utils'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MDXContent } from '@/components/blog/mdx-content'
import { PostNavigation } from '@/components/blog/post-navigation'
import {
  BlogPostStructuredData,
  BreadcrumbStructuredData,
} from '@/components/seo/structured-data'

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
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description =
    post.description ||
    post.excerpt ||
    `Read ${post.title} on MVP Template blog`

  const baseMeta = pageMetadata({
    title: post.title,
    description,
    pathname: post.url as `/${string}`,
    ...(post.tags && post.tags.length ? { keywords: post.tags } : {}),
    imageType: 'post',
    imageTitle: post.title,
  })

  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.date).toISOString(),
      tags: post.tags,
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
    <>
      {/* Structured Data */}
      <BlogPostStructuredData
        title={post.title}
        description={post.description || post.excerpt || ''}
        datePublished={post.date}
        dateModified={post.date}
        author="MVP Template Team"
        slug={post.slug}
        tags={post.tags || []}
        readingTime={
          typeof post.readingTime === 'string'
            ? parseInt(post.readingTime)
            : post.readingTime
        }
      />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://mvp-template.vercel.app/' },
          { name: 'Blog', url: 'https://mvp-template.vercel.app/blog' },
          {
            name: post.title,
            url: `https://mvp-template.vercel.app/blog/${post.slug}`,
          },
        ]}
      />

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
                <span>
                  {typeof post.readingTime === 'string'
                    ? post.readingTime
                    : `${post.readingTime} min read`}
                </span>
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
    </>
  )
}
