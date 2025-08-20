import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'
import { pageMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  return allLegalPages.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = allLegalPages.find(p => p.slug === slug)
  if (!page) return {}
  return pageMetadata({
    title: page.title,
    description:
      page.description ?? `${page.title} - ${slug.replaceAll('-', ' ')}`,
    pathname: `/legal/${page.slug}` as `/${string}`,
    imageType: 'legal',
  })
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = allLegalPages.find(p => p.slug === slug)
  if (!page) notFound()
  return <LegalPageTemplate page={page} />
}
