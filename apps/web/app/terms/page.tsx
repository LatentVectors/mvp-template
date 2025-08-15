import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the terms and conditions for using MVP Template services. Understand your rights and responsibilities as a user.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
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
            <h2 className="mb-4 text-2xl font-semibold">Acceptance of Terms</h2>
            <p>
              By accessing and using MVP Template (&quot;the Service&quot;), you
              agree to be bound by these Terms of Service and all applicable
              laws and regulations. If you do not agree with any of these terms,
              you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Description of Service
            </h2>
            <p>
              MVP Template provides a production-ready monorepo template and
              related services to help developers and startups build
              applications faster. Our service includes:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Access to our template codebase and documentation</li>
              <li>Regular updates and improvements</li>
              <li>Community support and resources</li>
              <li>Additional premium features for subscribers</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Use of Service</h2>
            <h3 className="mb-3 text-xl font-medium">Permitted Use</h3>
            <p>
              You may use our service for lawful purposes only. You agree to use
              the service in accordance with:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                All applicable local, state, national, and international laws
              </li>
              <li>These Terms of Service and our Privacy Policy</li>
              <li>Any additional guidelines or rules posted on the website</li>
            </ul>

            <h3 className="mt-6 mb-3 text-xl font-medium">Prohibited Use</h3>
            <p>You agree not to use the service:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                For any unlawful purpose or to solicit others to perform
                unlawful acts
              </li>
              <li>
                To violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li>To submit false or misleading information</li>
              <li>
                To upload or transmit viruses or any other type of malicious
                code
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              User Responsibilities
            </h2>
            <p>As a user of our service, you are responsible for:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your use complies with applicable laws</li>
              <li>Respecting the intellectual property rights of others</li>
              <li>Providing accurate and up-to-date information</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Account Registration
            </h2>
            <p>
              To access certain features of our service, you may be required to
              register for an account. You agree to provide accurate, current,
              and complete information during registration and to update such
              information to keep it accurate, current, and complete.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Intellectual Property
            </h2>
            <p>
              The service and its original content, features, and functionality
              are and will remain the exclusive property of MVP Template and its
              licensors. The service is protected by copyright, trademark, and
              other laws.
            </p>
            <p className="mt-4">
              Our template code is provided under specific licensing terms that
              allow you to use, modify, and distribute your applications built
              with our template, subject to the license conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Payment Terms</h2>
            <p>
              If you purchase a subscription or premium features, you agree to
              pay all fees and charges incurred in connection with your account.
              All fees are non-refundable unless otherwise specified in our
              refund policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              , which also governs your use of the service, to understand our
              practices.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including but not
              limited to a breach of the Terms.
            </p>
            <p className="mt-4">
              If you wish to terminate your account, you may simply discontinue
              using the service or contact us to request account deletion.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Disclaimers</h2>
            <p>
              The service is provided on an &quot;AS IS&quot; and &quot;AS
              AVAILABLE&quot; basis. MVP Template expressly disclaims all
              warranties of any kind, whether express or implied, including but
              not limited to the implied warranties of merchantability, fitness
              for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              Limitation of Liability
            </h2>
            <p>
              In no event shall MVP Template, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your use of
              the service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Governing Law</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of [Your
              Jurisdiction], without regard to its conflict of law provisions.
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking
              effect.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="bg-muted mt-4 rounded-lg p-4">
              <p className="font-medium">MVP Template</p>
              <p>Email: legal@mvptemplate.com</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
