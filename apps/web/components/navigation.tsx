'use client'

import * as React from 'react'
import Link from 'next/link'
import { MenuIcon, XIcon } from 'lucide-react'
import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Features',
    href: '/features',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu
        className="hidden md:flex lg:flex"
        aria-label="Main navigation"
      >
        <NavigationMenuList role="menubar">
          {navItems.map(item => (
            <NavigationMenuItem key={item.href} role="none">
              <Link href={item.href as never} legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  role="menuitem"
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation Button */}
      <Button
        variant="ghost"
        className="md:hidden"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <XIcon className="h-4 w-4" />
        ) : (
          <MenuIcon className="h-4 w-4" />
        )}
      </Button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav
          id="mobile-menu"
          className="bg-background absolute top-full right-0 left-0 z-50 border-b shadow-lg md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-2" role="menu">
              {navItems.map(item => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href as never}
                    className={cn(
                      'hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                    )}
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                    tabIndex={0}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  )
}
