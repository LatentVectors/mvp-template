import Link from 'next/link'
import { Navigation } from './navigation'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span className="hidden font-bold sm:inline-block brand-title">
              MVP Template
            </span>
          </Link>
        </div>
        
        <Navigation />
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
