import type { Metadata } from 'next'

const SITE_NAME = 'MVP Template'

function buildOgImageUrl(
  title: string,
  type: 'page' | 'legal' | 'post'
): string {
  const params = new URLSearchParams({ title, type })
  return `/api/og?${params.toString()}`
}

export function pageMetadata(options: {
  title: string
  description: string
  pathname: `/${string}`
  keywords?: string[]
  imageType?: 'page' | 'legal' | 'post'
  imageTitle?: string
}): Metadata {
  const {
    title,
    description,
    pathname,
    keywords,
    imageType = 'page',
    imageTitle,
  } = options

  const ogImageUrl = buildOgImageUrl(imageTitle ?? title, imageType)

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pathname },
    openGraph: {
      title: `${title} - ${SITE_NAME}`,
      description,
      type: 'website',
      url: pathname,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} ${title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${SITE_NAME}`,
      description,
      images: [ogImageUrl],
    },
  }
}
