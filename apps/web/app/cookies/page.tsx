import type { Metadata } from 'next'
import React from 'react'

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
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Cookie Policy
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
            <h2 className="mb-4 text-2xl font-semibold">What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or
              mobile device when you visit our website. They are widely used to
              make websites work more efficiently and to provide information to
              website owners.
            </p>
            <p className="mt-4">
              Cookies allow us to recognize your device and store some
              information about your preferences or past actions to improve your
              experience on our website.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">How We Use Cookies</h2>
            <p>We use cookies for several purposes:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>To ensure our website functions properly</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze how visitors use our website</li>
              <li>
                To improve our website&apos;s performance and user experience
              </li>
              <li>To provide personalized content and features</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Types of Cookies</h2>

            <h3 className="mb-3 text-xl font-medium">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly.
              They enable basic functions like page navigation, access to secure
              areas, and remember your login status. The website cannot function
              properly without these cookies.
            </p>

            <h3 className="mt-6 mb-3 text-xl font-medium">
              Functional Cookies
            </h3>
            <p>
              These cookies enable the website to provide enhanced functionality
              and personalization. They may be set by us or by third-party
              providers whose services we have added to our pages.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Theme preferences (dark/light mode)</li>
              <li>Language settings</li>
              <li>User interface preferences</li>
            </ul>

            <h3 className="mt-6 mb-3 text-xl font-medium">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously. This
              helps us improve our website&apos;s performance and content.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Google Analytics for website traffic analysis</li>
              <li>Page view tracking</li>
              <li>User journey analysis</li>
              <li>Performance monitoring</li>
            </ul>

            <h3 className="mt-6 mb-3 text-xl font-medium">Marketing Cookies</h3>
            <p>
              These cookies are used to track visitors across websites. The
              intention is to display ads that are relevant and engaging for
              individual users and thereby more valuable for publishers and
              third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Third-Party Cookies</h2>
            <p>
              Some cookies on our website are set by third-party services. We
              use these services to enhance functionality and analyze website
              performance:
            </p>

            <div className="mt-4 space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold">Google Analytics</h4>
                <p className="mt-2 text-sm">
                  We use Google Analytics to understand how visitors use our
                  website. These cookies collect information about website
                  usage, which we use to improve our website.
                </p>
                <p className="mt-2 text-sm">
                  <a
                    href="https://policies.google.com/privacy"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Privacy Policy
                  </a>
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold">Content Delivery Networks</h4>
                <p className="mt-2 text-sm">
                  We use CDNs to deliver content efficiently. These may set
                  cookies to optimize content delivery and performance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Managing Cookies</h2>

            <h3 className="mb-3 text-xl font-medium">Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their
              settings preferences. You can set your browser to:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Accept all cookies</li>
              <li>Reject all cookies</li>
              <li>Notify you when a cookie is set</li>
              <li>Delete cookies after you leave the website</li>
            </ul>

            <h3 className="mt-6 mb-3 text-xl font-medium">Cookie Consent</h3>
            <p>
              When you first visit our website, you&apos;ll see a cookie consent
              banner. You can choose which types of cookies to accept or reject.
              You can change your preferences at any time by clicking the cookie
              settings link in our footer.
            </p>

            <h3 className="mt-6 mb-3 text-xl font-medium">Opt-Out Links</h3>
            <p>You can opt out of specific tracking services:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out
                </a>
              </li>
              <li>
                <a
                  href="https://www.aboutads.info/choices/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Digital Advertising Alliance Opt-out
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Cookie Retention</h2>
            <p>Different cookies have different retention periods:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Session cookies:</strong> Deleted when you close your
                browser
              </li>
              <li>
                <strong>Persistent cookies:</strong> Remain until they expire or
                you delete them
              </li>
              <li>
                <strong>Analytics cookies:</strong> Typically expire after 2
                years
              </li>
              <li>
                <strong>Functional cookies:</strong> Usually expire after 1 year
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Impact of Disabling Cookies
            </h2>
            <p>
              If you choose to disable cookies, some features of our website may
              not function properly:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>You may need to re-enter information more frequently</li>
              <li>Personalized content and preferences may not be saved</li>
              <li>Some interactive features may not work correctly</li>
              <li>
                We won&apos;t be able to remember your cookie consent
                preferences
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Updates to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. Please revisit this page regularly to stay
              informed about our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">More Information</h2>
            <p>
              For more information about our data practices, please see our{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact
              us:
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
