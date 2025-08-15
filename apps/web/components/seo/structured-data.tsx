import React from 'react'

interface BlogPostStructuredDataProps {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author: string
  slug: string
  tags?: string[]
  readingTime?: number
}

export function BlogPostStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  author,
  slug,
  tags = [],
  readingTime,
}: BlogPostStructuredDataProps) {
  const baseUrl = 'https://mvp-template.vercel.app'
  const postUrl = `${baseUrl}/blog/${slug}`
  const imageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&type=blog`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: [imageUrl],
    datePublished: new Date(datePublished).toISOString(),
    dateModified: new Date(dateModified || datePublished).toISOString(),
    author: {
      '@type': 'Organization',
      name: author,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MVP Template',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 120,
        height: 40,
      },
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    keywords: tags.join(', '),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
    inLanguage: 'en-US',
    isFamilyFriendly: true,
    copyrightYear: new Date(datePublished).getFullYear(),
    copyrightHolder: {
      '@type': 'Organization',
      name: 'MVP Template',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface WebsiteStructuredDataProps {
  url?: string
}

export function WebsiteStructuredData({
  url = 'https://mvp-template.vercel.app',
}: WebsiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MVP Template',
    description:
      'Launch your startup with our production-ready monorepo template. Pre-configured with Next.js 15, TypeScript, Tailwind CSS, and everything you need to focus on building your product.',
    url: url,
    publisher: {
      '@type': 'Organization',
      name: 'MVP Template',
      logo: {
        '@type': 'ImageObject',
        url: `${url}/logo.png`,
        width: 120,
        height: 40,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://github.com/mvp-template',
      'https://twitter.com/mvptemplate',
    ],
    inLanguage: 'en-US',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface OrganizationStructuredDataProps {
  url?: string
}

export function OrganizationStructuredData({
  url = 'https://mvp-template.vercel.app',
}: OrganizationStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MVP Template',
    description:
      'Providing production-ready monorepo templates for fast startup development',
    url: url,
    logo: {
      '@type': 'ImageObject',
      url: `${url}/logo.png`,
      width: 120,
      height: 40,
    },
    sameAs: [
      'https://github.com/mvp-template',
      'https://twitter.com/mvptemplate',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@mvptemplate.com',
    },
    founder: {
      '@type': 'Person',
      name: 'MVP Template Team',
    },
    foundingDate: '2024',
    knowsAbout: [
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'Startup Development',
      'MVP Development',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
