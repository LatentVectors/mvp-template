import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { getAllPosts } from '@/lib/content-utils'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Latest articles, tutorials, and insights from our team. Discover guides, best practices, and tutorials about modern web development.',
  keywords: [
    'blog',
    'articles',
    'tutorials',
    'web development',
    'Next.js',
    'React',
    'TypeScript',
  ],
  authors: [{ name: 'MVP Template Team' }],
  creator: 'MVP Template',
  publisher: 'MVP Template',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog - MVP Template',
    description:
      'Latest articles, tutorials, and insights from our team. Discover guides, best practices, and tutorials about modern web development.',
    type: 'website',
    url: '/blog',
    siteName: 'MVP Template',
    images: [
      {
        url: '/api/og?title=Blog&type=page',
        width: 1200,
        height: 630,
        alt: 'MVP Template Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - MVP Template',
    description:
      'Latest articles, tutorials, and insights from our team. Discover guides, best practices, and tutorials about modern web development.',
    images: ['/api/og?title=Blog&type=page'],
    creator: '@mvptemplate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-muted-foreground text-xl">
            Latest articles, tutorials, and insights from our team
          </p>
        </header>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:gap-12">
            {posts.map(post => (
              <article key={post.slug} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>

                    <h2 className="mb-3">
                      <Link
                        href={post.url as `/blog/${string}`}
                        className="text-foreground hover:text-primary text-2xl font-bold tracking-tight transition-colors lg:text-3xl"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {post.description}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Button variant="ghost" asChild className="group/button">
                      <Link
                        href={post.url as `/blog/${string}`}
                        className="flex items-center gap-2"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-muted-foreground mb-4 text-2xl font-semibold">
              No posts yet
            </h2>
            <p className="text-muted-foreground">
              Check back soon for our latest articles and insights.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
