import Link from 'next/link'
import { Navigation } from './navigation'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-lg font-bold">
                M
              </span>
            </div>
            <span className="brand-title hidden font-bold sm:inline-block">
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
