// Footer component with useful links

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                                     <a
                     href={link.href}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {link.name}
                   </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                                     <a
                     href={link.href}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {link.name}
                   </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                                     <a
                     href={link.href}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {link.name}
                   </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                                     <a
                     href={link.href}
                     className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {link.name}
                   </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold">MVP Template</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {currentYear} MVP Template. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
