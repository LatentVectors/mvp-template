import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how MVP Template collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR',
    'privacy rights',
    'personal information',
  ],
  authors: [{ name: 'MVP Template Team' }],
  creator: 'MVP Template',
  publisher: 'MVP Template',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - MVP Template',
    description:
      'Learn how MVP Template collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.',
    type: 'website',
    url: '/privacy',
    siteName: 'MVP Template',
    images: [
      {
        url: '/api/og?title=Privacy Policy&type=legal',
        width: 1200,
        height: 630,
        alt: 'MVP Template Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - MVP Template',
    description:
      'Learn how MVP Template collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.',
    images: ['/api/og?title=Privacy Policy&type=legal'],
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

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>

        <p className="text-muted-foreground mb-8 text-lg">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
            <p>
              MVP Template (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              respects your privacy and is committed to protecting your personal
              data. This privacy policy explains how we collect, use, and
              safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Information We Collect
            </h2>
            <h3 className="mb-3 text-xl font-medium">Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Name and email address when you create an account</li>
              <li>Payment information when you subscribe to our services</li>
              <li>Communication data when you contact us</li>
              <li>Usage data about how you interact with our services</li>
            </ul>

            <h3 className="mt-6 mb-3 text-xl font-medium">
              Automatically Collected Information
            </h3>
            <p>
              We automatically collect certain information when you visit our
              website:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages you visit and time spent on our site</li>
              <li>Referral source and search terms</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              How We Use Information
            </h2>
            <p>We use your personal information for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Provide and maintain our services</li>
              <li>Process payments and transactions</li>
              <li>Communicate with you about our services</li>
              <li>Improve our website and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud and security threats</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Data Protection</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. We may share your data only:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>With service providers who help us operate our business</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights and safety</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar technologies to enhance your experience
              on our website. For detailed information about our cookie
              practices, please see our{' '}
              <a href="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill
              the purposes outlined in this policy, comply with legal
              obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              International Transfers
            </h2>
            <p>
              Your personal data may be transferred to and processed in
              countries other than your own. We ensure appropriate safeguards
              are in place to protect your data during such transfers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Updates to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data
              practices, please contact us at:
            </p>
            <div className="bg-muted mt-4 rounded-lg p-4">
              <p className="font-medium">MVP Template</p>
              <p>Email: privacy@mvptemplate.com</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
