import type { Metadata } from 'next'
import React from 'react'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the terms and conditions for using MVP Template services. Understand your rights and responsibilities as a user.',
  keywords: [
    'terms of service',
    'user agreement',
    'terms and conditions',
    'legal terms',
    'service agreement',
  ],
  authors: [{ name: 'MVP Template Team' }],
  creator: 'MVP Template',
  publisher: 'MVP Template',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service - MVP Template',
    description:
      'Read the terms and conditions for using MVP Template services. Understand your rights and responsibilities as a user.',
    type: 'website',
    url: '/terms',
    siteName: 'MVP Template',
    images: [
      {
        url: '/api/og?title=Terms of Service&type=legal',
        width: 1200,
        height: 630,
        alt: 'MVP Template Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - MVP Template',
    description:
      'Read the terms and conditions for using MVP Template services. Understand your rights and responsibilities as a user.',
    images: ['/api/og?title=Terms of Service&type=legal'],
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

export default function TermsPage() {
  const page = allLegalPages.find(p => p.slug === 'terms')

  if (!page) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-12">
        Page not found
      </main>
    )
  }

  return <LegalPageTemplate page={page} />
}
