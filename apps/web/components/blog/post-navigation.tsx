import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Post {
  slug: string
  title: string
  url: string
}

interface PostNavigationProps {
  previousPost?: Post | null
  nextPost?: Post | null
}

export function PostNavigation({
  previousPost,
  nextPost,
}: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <nav className="mt-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Previous Post */}
        <div className={cn(!previousPost && 'sm:col-start-2')}>
          {previousPost ? (
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  asChild
                  className="h-auto w-full justify-start p-0"
                >
                  <Link
                    href={previousPost.url as `/blog/${string}`}
                    className="flex items-start gap-3"
                  >
                    <ChevronLeft className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-muted-foreground mb-1 text-sm">
                        Previous
                      </div>
                      <div className="line-clamp-2 font-medium">
                        {previousPost.title}
                      </div>
                    </div>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Next Post */}
        <div>
          {nextPost ? (
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  asChild
                  className="h-auto w-full justify-end p-0"
                >
                  <Link
                    href={nextPost.url as `/blog/${string}`}
                    className="flex items-start gap-3"
                  >
                    <div className="text-right">
                      <div className="text-muted-foreground mb-1 text-sm">
                        Next
                      </div>
                      <div className="line-clamp-2 font-medium">
                        {nextPost.title}
                      </div>
                    </div>
                    <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
