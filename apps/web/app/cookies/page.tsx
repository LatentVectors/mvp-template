import type { Metadata } from 'next'
import React from 'react'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Learn about how MVP Template uses cookies and similar technologies to enhance your browsing experience and analyze website usage.',
  keywords: [
    'cookie policy',
    'cookies',
    'tracking',
    'privacy',
    'web analytics',
    'GDPR compliance',
  ],
  authors: [{ name: 'MVP Template Team' }],
  creator: 'MVP Template',
  publisher: 'MVP Template',
  alternates: {
    canonical: '/cookies',
  },
  openGraph: {
    title: 'Cookie Policy - MVP Template',
    description:
      'Learn about how MVP Template uses cookies and similar technologies to enhance your browsing experience and analyze website usage.',
    type: 'website',
    url: '/cookies',
    siteName: 'MVP Template',
    images: [
      {
        url: '/api/og?title=Cookie Policy&type=legal',
        width: 1200,
        height: 630,
        alt: 'MVP Template Cookie Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy - MVP Template',
    description:
      'Learn about how MVP Template uses cookies and similar technologies to enhance your browsing experience and analyze website usage.',
    images: ['/api/og?title=Cookie Policy&type=legal'],
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

export default function CookiePage() {
  const page = allLegalPages.find(p => p.slug === 'cookies')

  if (!page) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-12">
        Page not found
      </main>
    )
  }

  return <LegalPageTemplate page={page} />
}
