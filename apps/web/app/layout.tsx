import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/layout'
import {
  WebsiteStructuredData,
  OrganizationStructuredData,
} from '@/components/seo/structured-data'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'MVP Template - Build Your Startup Faster',
    template: '%s | MVP Template',
  },
  description:
    'Launch your startup with our production-ready monorepo template. Pre-configured with Next.js 15, TypeScript, Tailwind CSS, and everything you need to focus on building your product.',
  keywords: [
    'MVP',
    'startup',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'monorepo',
    'template',
    'boilerplate',
  ],
  authors: [{ name: 'MVP Template Team' }],
  creator: 'MVP Template',
  publisher: 'MVP Template',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mvp-template.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mvp-template.vercel.app',
    title: 'MVP Template - Build Your Startup Faster',
    description:
      'Launch your startup with our production-ready monorepo template. Pre-configured with Next.js 15, TypeScript, Tailwind CSS, and everything you need to focus on building your product.',
    siteName: 'MVP Template',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MVP Template - Build Your Startup Faster',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MVP Template - Build Your Startup Faster',
    description:
      'Launch your startup with our production-ready monorepo template. Pre-configured with Next.js 15, TypeScript, Tailwind CSS, and everything you need to focus on building your product.',
    images: ['/twitter-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          forcedTheme={undefined}
          storageKey="theme"
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
