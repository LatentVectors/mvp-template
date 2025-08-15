// import Image from "next/image";
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero px-4 py-20 sm:p-16 sm:px-6 sm:py-32 lg:p-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-6xl">
            Build Your MVP Faster Than Ever
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-8 sm:text-xl">
            Launch your startup with our production-ready monorepo template.
            Pre-configured with Next.js 15, TypeScript, Tailwind CSS, and
            everything you need to focus on building your product, not the
            infrastructure.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
            <Button
              size="lg"
              className="w-full px-8 py-3 text-base font-semibold sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full px-8 py-3 text-base font-semibold sm:w-auto"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features bg-muted/50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Launch
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Stop wasting time on boilerplate code. Our template includes all
              the modern tools and best practices you need to build a successful
              product.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            <Card className="feature-card">
              <CardHeader>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                <CardTitle>Lightning Fast Development</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Hot reload, TypeScript support, and modern tooling configured
                  out of the box. Start coding immediately without configuration
                  headaches.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <CardTitle>Production Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built with enterprise-grade tools and best practices. Deploy
                  to Vercel, AWS, or any platform with confidence.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25A1.125 1.125 0 012.25 18.375v-2.25z"
                    />
                  </svg>
                </div>
                <CardTitle>Scalable Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monorepo structure with Turborepo for fast builds. Easily add
                  microservices, shared packages, and scale your team.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                    />
                  </svg>
                </div>
                <CardTitle>Modern UI Components</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Beautiful, accessible components built with Radix UI and
                  Tailwind CSS. Dark mode support and responsive design
                  included.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                    />
                  </svg>
                </div>
                <CardTitle>Developer Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ESLint, Prettier, TypeScript strict mode, and automated
                  testing setup. Maintain code quality across your entire team.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card">
              <CardHeader>
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <svg
                    className="text-primary-foreground h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z"
                    />
                  </svg>
                </div>
                <CardTitle>Global Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built-in internationalization support, SEO optimization, and
                  performance monitoring. Ready for worldwide deployment.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join thousands of developers who have accelerated their MVP
            development with our production-ready template.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6">
            <Button
              size="lg"
              className="w-full px-8 py-3 text-base font-semibold sm:w-auto"
            >
              Start Building Now
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full px-8 py-3 text-base font-semibold sm:w-auto"
            >
              Learn More →
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
