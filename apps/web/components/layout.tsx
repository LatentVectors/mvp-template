import { Header } from './header'
import { Footer } from './footer'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Skip Links for accessibility */}
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <a
        href="#footer"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-32"
      >
        Skip to footer
      </a>

      <Header />
      <main id="main-content" className="container mx-auto flex-1 px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
