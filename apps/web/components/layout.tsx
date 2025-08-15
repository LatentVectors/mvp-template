import { Header } from './header'
import { Footer } from './footer'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip Links for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
      <a 
        href="#footer" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-32 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to footer
      </a>
      
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
