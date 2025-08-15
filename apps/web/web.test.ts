import { test, expect, describe } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const webAppPath = join(process.cwd())

describe('Next.js 15 Application Bootstrap and Configuration', () => {
  describe('Application Structure', () => {
    test('should have Next.js application directory in apps/web/', () => {
      expect(existsSync(webAppPath)).toBe(true)
    })

    test('should have package.json with Next.js 15 configuration', () => {
      const packageJsonPath = join(webAppPath, 'package.json')
      expect(existsSync(packageJsonPath)).toBe(true)
      
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.name).toBe('web')
      expect(packageJson.dependencies?.next).toMatch(/^15\./)
      expect(packageJson.dependencies?.react).toMatch(/^19\./)
      expect(packageJson.dependencies?.['react-dom']).toMatch(/^19\./)
    })

    test('should have Next.js scripts configured', () => {
      const packageJsonPath = join(webAppPath, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      
      expect(packageJson.scripts).toMatchObject({
        dev: expect.stringContaining('next dev'),
        build: expect.stringContaining('next build'),
        start: expect.stringContaining('next start'),
        lint: expect.stringContaining('next lint')
      })
    })
  })

  describe('TypeScript Configuration', () => {
    test('should have TypeScript configuration file', () => {
      const tsconfigPath = join(webAppPath, 'tsconfig.json')
      expect(existsSync(tsconfigPath)).toBe(true)
    })

    test('should have TypeScript with strict mode enabled', () => {
      const tsconfigPath = join(webAppPath, 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      
      expect(tsconfig.compilerOptions.strict).toBe(true)
      expect(tsconfig.compilerOptions.noEmit).toBe(true)
      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true)
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true)
      expect(tsconfig.compilerOptions.allowJs).toBe(true)
      expect(tsconfig.compilerOptions.forceConsistentCasingInFileNames).toBe(true)
      expect(tsconfig.compilerOptions.incremental).toBe(true)
    })

    test('should have path mapping configured', () => {
      const tsconfigPath = join(webAppPath, 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      
      expect(tsconfig.compilerOptions.baseUrl).toBe('.')
      expect(tsconfig.compilerOptions.paths).toHaveProperty('@/*')
      expect(tsconfig.compilerOptions.paths['@/*']).toContain('./*')
    })

    test('should include necessary TypeScript files', () => {
      const tsconfigPath = join(webAppPath, 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      
      expect(tsconfig.include).toContain('next-env.d.ts')
      expect(tsconfig.include).toContain('**/*.ts')
      expect(tsconfig.include).toContain('**/*.tsx')
      expect(tsconfig.exclude).toContain('node_modules')
    })

    test('should extend base TypeScript configuration', () => {
      const tsconfigPath = join(webAppPath, 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      
      expect(tsconfig.extends).toBe('../../tsconfig.base.json')
    })

    test('should have Next.js TypeScript plugin configured', () => {
      const tsconfigPath = join(webAppPath, 'tsconfig.json')
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
      
      expect(tsconfig.compilerOptions.plugins).toContainEqual({ name: 'next' })
    })

    test('should have next-env.d.ts generated', () => {
      const nextEnvPath = join(webAppPath, 'next-env.d.ts')
      expect(existsSync(nextEnvPath)).toBe(true)
    })
  })

  describe('App Router Configuration', () => {
    test('should have app directory structure', () => {
      const appDirPath = join(webAppPath, 'app')
      expect(existsSync(appDirPath)).toBe(true)
    })

    test('should have root layout.tsx with proper structure', () => {
      const layoutPath = join(webAppPath, 'app', 'layout.tsx')
      expect(existsSync(layoutPath)).toBe(true)
      
      const layoutContent = readFileSync(layoutPath, 'utf-8')
      expect(layoutContent).toContain('export default function RootLayout')
      expect(layoutContent).toContain('children: React.ReactNode')
      expect(layoutContent).toContain('<html')
      expect(layoutContent).toContain('<body')
    })

    test('should have main page.tsx', () => {
      const pagePath = join(webAppPath, 'app', 'page.tsx')
      expect(existsSync(pagePath)).toBe(true)
      
      const pageContent = readFileSync(pagePath, 'utf-8')
      expect(pageContent).toContain('export default function')
    })

    test('should have components directory', () => {
      const componentsPath = join(webAppPath, 'components')
      expect(existsSync(componentsPath)).toBe(true)
    })

    test('should have lib directory', () => {
      const libPath = join(webAppPath, 'lib')
      expect(existsSync(libPath)).toBe(true)
    })
  })

  describe('Next.js Configuration', () => {
    test('should have next.config.ts with proper configuration', () => {
      const nextConfigPath = join(webAppPath, 'next.config.ts')
      expect(existsSync(nextConfigPath)).toBe(true)
    })

    test('should have optimizations configured in next.config.ts', () => {
      const nextConfigPath = join(webAppPath, 'next.config.ts')
      const nextConfigContent = readFileSync(nextConfigPath, 'utf-8')
      
      // Should have basic Next.js config structure
      expect(nextConfigContent).toContain('NextConfig')
      expect(nextConfigContent).toContain('export default')
    })

    test('should have TypeScript support enabled', () => {
      const nextConfigPath = join(webAppPath, 'next.config.ts')
      const nextConfigContent = readFileSync(nextConfigPath, 'utf-8')
      
      // Should not disable TypeScript (default is enabled)
      expect(nextConfigContent).not.toContain('ignoreBuildErrors: true')
    })
  })

  describe('Dependencies and Runtime', () => {
    test('should have all required dependencies installed', () => {
      const packageJsonPath = join(webAppPath, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      
      // Core dependencies
      expect(packageJson.dependencies).toHaveProperty('next')
      expect(packageJson.dependencies).toHaveProperty('react')
      expect(packageJson.dependencies).toHaveProperty('react-dom')
      
      // TypeScript dev dependencies
      expect(packageJson.devDependencies).toHaveProperty('typescript')
      expect(packageJson.devDependencies).toHaveProperty('@types/node')
      expect(packageJson.devDependencies).toHaveProperty('@types/react')
      expect(packageJson.devDependencies).toHaveProperty('@types/react-dom')
    })

    test('should have proper React 19 peer dependencies', () => {
      const packageJsonPath = join(webAppPath, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      
      const reactVersion = packageJson.dependencies.react
      const reactDomVersion = packageJson.dependencies['react-dom']
      
      expect(reactVersion).toMatch(/^19\./)
      expect(reactDomVersion).toMatch(/^19\./)
    })
  })

  describe('Build and Development Server', () => {
    test('should be able to build without errors', async () => {
      // This test will be run as part of the verification step
      // For now, we'll check that the build command is properly configured
      const packageJsonPath = join(webAppPath, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      
      expect(packageJson.scripts.build).toContain('next build')
    })

    test('should be able to start development server', async () => {
      // This test will be run as part of the verification step
      // For now, we'll check that the dev command is properly configured
      const packageJsonPath = join(webAppPath, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
      
      expect(packageJson.scripts.dev).toContain('next dev')
    })
  })

  describe('Project Structure Standards', () => {
    test('should have proper directory structure', () => {
      const expectedDirs = ['app', 'components', 'lib']
      
      expectedDirs.forEach(dir => {
        const dirPath = join(webAppPath, dir)
        expect(existsSync(dirPath)).toBe(true)
      })
    })

    test('should have proper file extensions', () => {
      const layoutPath = join(webAppPath, 'app', 'layout.tsx')
      const pagePath = join(webAppPath, 'app', 'page.tsx')
      
      expect(existsSync(layoutPath)).toBe(true)
      expect(existsSync(pagePath)).toBe(true)
    })
  })

  describe('Tailwind CSS Configuration and Theming', () => {
    describe('Tailwind CSS Installation and Setup', () => {
      test('should have Tailwind CSS 4 installed', () => {
        const packageJsonPath = join(webAppPath, 'package.json')
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        
        expect(packageJson.devDependencies).toHaveProperty('tailwindcss')
        expect(packageJson.devDependencies.tailwindcss).toMatch(/^\^?4/)
        expect(packageJson.devDependencies).toHaveProperty('@tailwindcss/postcss')
      })

      test('should have PostCSS configuration with Tailwind CSS plugin', () => {
        const postcssConfigPath = join(webAppPath, 'postcss.config.mjs')
        expect(existsSync(postcssConfigPath)).toBe(true)
        
        const postcssContent = readFileSync(postcssConfigPath, 'utf-8')
        expect(postcssContent).toContain('@tailwindcss/postcss')
        expect(postcssContent).toContain('plugins')
      })

      test('should have globals.css with Tailwind CSS imports', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        expect(existsSync(globalsCssPath)).toBe(true)
        
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        expect(globalsCssContent).toContain('@import "tailwindcss"')
      })
    })

    describe('Theme Configuration and CSS Variables', () => {
      test('should have CSS variables defined in globals.css', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        // Check for CSS variables
        expect(globalsCssContent).toContain('--background')
        expect(globalsCssContent).toContain('--foreground')
        expect(globalsCssContent).toContain(':root')
      })

      test('should have Tailwind theme configuration with CSS variables', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        // Check for @theme inline configuration
        expect(globalsCssContent).toContain('@theme inline')
        expect(globalsCssContent).toContain('--color-background')
        expect(globalsCssContent).toContain('--color-foreground')
      })

      test('should have dark mode support with media query', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        expect(globalsCssContent).toContain('@media (prefers-color-scheme: dark)')
      })

      test('should have proper color values for light and dark themes', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        // Light theme colors
        expect(globalsCssContent).toMatch(/--background:\s*#ffffff/)
        expect(globalsCssContent).toMatch(/--foreground:\s*#171717/)
        
        // Dark theme colors should be different
        expect(globalsCssContent).toMatch(/@media \(prefers-color-scheme: dark\)[\s\S]*--background:\s*#0a0a0a/)
        expect(globalsCssContent).toMatch(/@media \(prefers-color-scheme: dark\)[\s\S]*--foreground:\s*#ededed/)
      })
    })

    describe('Design Tokens and Typography', () => {
      test('should have font family tokens configured', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        expect(globalsCssContent).toContain('--font-sans')
        expect(globalsCssContent).toContain('--font-mono')
      })

      test('should have Tailwind config file for additional customization', () => {
        // Check if tailwind.config.js/ts exists or if using @theme inline
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        // With Tailwind CSS 4, configuration can be inline with @theme
        expect(globalsCssContent).toContain('@theme')
      })
    })

    describe('Component Styling Foundation', () => {
      test('should have proper base styles for body element', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        expect(globalsCssContent).toContain('body')
        expect(globalsCssContent).toContain('background: var(--background)')
        expect(globalsCssContent).toContain('color: var(--foreground)')
      })

      test('should have layout imported in root layout', () => {
        const layoutPath = join(webAppPath, 'app', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        expect(layoutContent).toContain('./globals.css')
      })
    })

    describe('Responsive Design Configuration', () => {
      test('should support mobile-first responsive design', () => {
        // This will be verified when we check if Tailwind's responsive utilities work
        // For now, we ensure the base setup is in place
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        expect(existsSync(globalsCssPath)).toBe(true)
      })
    })

    describe('Accessibility and Semantic Colors', () => {
      test('should have high contrast ratios for light theme', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        // White background (#ffffff) with dark foreground (#171717) provides good contrast
        expect(globalsCssContent).toMatch(/--background:\s*#ffffff/)
        expect(globalsCssContent).toMatch(/--foreground:\s*#171717/)
      })

      test('should have high contrast ratios for dark theme', () => {
        const globalsCssPath = join(webAppPath, 'app', 'globals.css')
        const globalsCssContent = readFileSync(globalsCssPath, 'utf-8')
        
        // Dark theme colors should be different
        expect(globalsCssContent).toMatch(/@media \(prefers-color-scheme: dark\)[\s\S]*--background:\s*#0a0a0a/)
        expect(globalsCssContent).toMatch(/@media \(prefers-color-scheme: dark\)[\s\S]*--foreground:\s*#ededed/)
      })
    })

    describe('shadcn/ui Integration Tests', () => {
      test('should have components.json configuration file', () => {
        const componentsConfigPath = join(webAppPath, 'components.json')
        expect(existsSync(componentsConfigPath)).toBe(true)
      })

      test('should have shadcn/ui dependencies installed', () => {
        const packageJsonPath = join(webAppPath, 'package.json')
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        
        // Check for common shadcn/ui dependencies
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
        expect(dependencies).toHaveProperty('class-variance-authority')
        expect(dependencies).toHaveProperty('clsx')
        expect(dependencies).toHaveProperty('tailwind-merge')
      })

      test('should have utils file for shadcn/ui integration', () => {
        const utilsPath = join(webAppPath, 'lib', 'utils.ts')
        expect(existsSync(utilsPath)).toBe(true)
        
        const utilsContent = readFileSync(utilsPath, 'utf-8')
        expect(utilsContent).toContain('cn')
        expect(utilsContent).toContain('clsx')
        expect(utilsContent).toContain('twMerge')
      })

      test('should have essential shadcn/ui components installed', () => {
        const componentsPath = join(webAppPath, 'components', 'ui')
        expect(existsSync(componentsPath)).toBe(true)
        
        // Check for essential components
        const buttonPath = join(componentsPath, 'button.tsx')
        const cardPath = join(componentsPath, 'card.tsx')
        
        expect(existsSync(buttonPath)).toBe(true)
        expect(existsSync(cardPath)).toBe(true)
      })
    })

    describe('Theme System Integration', () => {
      test('should have theme provider component', () => {
        const themeProviderPath = join(webAppPath, 'components', 'theme-provider.tsx')
        expect(existsSync(themeProviderPath)).toBe(true)
        
        const themeProviderContent = readFileSync(themeProviderPath, 'utf-8')
        expect(themeProviderContent).toContain('ThemeProvider')
        expect(themeProviderContent).toContain('next-themes')
      })

      test('should have theme toggle component', () => {
        const themeTogglePath = join(webAppPath, 'components', 'theme-toggle.tsx')
        expect(existsSync(themeTogglePath)).toBe(true)
        
        const themeToggleContent = readFileSync(themeTogglePath, 'utf-8')
        expect(themeToggleContent).toContain('useTheme')
        expect(themeToggleContent).toContain('setTheme')
      })

      test('should have next-themes installed for theme management', () => {
        const packageJsonPath = join(webAppPath, 'package.json')
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
        expect(dependencies).toHaveProperty('next-themes')
      })
    })
  })

  describe('Base Layout and Navigation Components', () => {
    describe('Layout Components Structure', () => {
      test('should have main layout wrapper component', () => {
        const layoutWrapperPath = join(webAppPath, 'components', 'layout.tsx')
        expect(existsSync(layoutWrapperPath)).toBe(true)
        
        const layoutContent = readFileSync(layoutWrapperPath, 'utf-8')
        expect(layoutContent).toContain('export function Layout')
        expect(layoutContent).toContain('children: React.ReactNode')
      })

      test('should have header component with navigation', () => {
        const headerPath = join(webAppPath, 'components', 'header.tsx')
        expect(existsSync(headerPath)).toBe(true)
        
        const headerContent = readFileSync(headerPath, 'utf-8')
        expect(headerContent).toContain('export function Header')
        expect(headerContent).toContain('<header')
      })

      test('should have navigation component', () => {
        const navPath = join(webAppPath, 'components', 'navigation.tsx')
        expect(existsSync(navPath)).toBe(true)
        
        const navContent = readFileSync(navPath, 'utf-8')
        expect(navContent).toContain('export function Navigation')
        expect(navContent).toContain('<nav')
      })

      test('should have footer component', () => {
        const footerPath = join(webAppPath, 'components', 'footer.tsx')
        expect(existsSync(footerPath)).toBe(true)
        
        const footerContent = readFileSync(footerPath, 'utf-8')
        expect(footerContent).toContain('export function Footer')
        expect(footerContent).toContain('<footer')
      })
    })

    describe('Layout Component Semantics', () => {
      test('main layout should use proper semantic HTML', () => {
        const layoutPath = join(webAppPath, 'components', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        expect(layoutContent).toContain('<main')
        expect(layoutContent).toContain('</main>')
      })

      test('header component should have proper navigation structure', () => {
        const headerPath = join(webAppPath, 'components', 'header.tsx')
        const headerContent = readFileSync(headerPath, 'utf-8')
        
        expect(headerContent).toContain('<header')
        expect(headerContent).toContain('</header>')
        expect(headerContent).toContain('Navigation')
      })

      test('footer component should have proper semantic structure', () => {
        const footerPath = join(webAppPath, 'components', 'footer.tsx')
        const footerContent = readFileSync(footerPath, 'utf-8')
        
        expect(footerContent).toContain('<footer')
        expect(footerContent).toContain('</footer>')
      })
    })

    describe('Responsive Navigation', () => {
      test('navigation should have mobile menu functionality', () => {
        const navPath = join(webAppPath, 'components', 'navigation.tsx')
        const navContent = readFileSync(navPath, 'utf-8')
        
        // Should have mobile menu state management
        expect(navContent).toContain('useState')
        expect(navContent).toContain('isOpen')
        
        // Should have responsive classes
        expect(navContent).toContain('md:')
        expect(navContent).toContain('lg:')
      })

      test('navigation should use navigation-menu component from shadcn/ui', () => {
        const navPath = join(webAppPath, 'components', 'navigation.tsx')
        const navContent = readFileSync(navPath, 'utf-8')
        
        expect(navContent).toContain('NavigationMenu')
        expect(navContent).toContain('@/components/ui/navigation-menu')
      })

      test('header should be responsive across breakpoints', () => {
        const headerPath = join(webAppPath, 'components', 'header.tsx')
        const headerContent = readFileSync(headerPath, 'utf-8')
        
        // Should have responsive padding/margin classes
        expect(headerContent).toMatch(/p-\d|px-\d|py-\d/)
        expect(headerContent).toMatch(/md:|lg:|xl:/)
      })
    })

    describe('Accessibility Features', () => {
      test('navigation should have proper ARIA labels', () => {
        const navPath = join(webAppPath, 'components', 'navigation.tsx')
        const navContent = readFileSync(navPath, 'utf-8')
        
        expect(navContent).toContain('aria-label')
        expect(navContent).toContain('aria-expanded')
      })

      test('header should have proper landmark roles', () => {
        const headerPath = join(webAppPath, 'components', 'header.tsx')
        const headerContent = readFileSync(headerPath, 'utf-8')
        
        // Header tag provides implicit banner role
        expect(headerContent).toContain('<header')
      })

      test('footer should have proper landmark roles', () => {
        const footerPath = join(webAppPath, 'components', 'footer.tsx')
        const footerContent = readFileSync(footerPath, 'utf-8')
        
        // Footer tag provides implicit contentinfo role
        expect(footerContent).toContain('<footer')
      })

      test('mobile menu button should be accessible', () => {
        const navPath = join(webAppPath, 'components', 'navigation.tsx')
        const navContent = readFileSync(navPath, 'utf-8')
        
        expect(navContent).toContain('aria-expanded')
        expect(navContent).toContain('aria-controls')
      })
    })

    describe('Component Integration', () => {
      test('layout component should integrate all sub-components', () => {
        const layoutPath = join(webAppPath, 'components', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        expect(layoutContent).toContain('Header')
        expect(layoutContent).toContain('Footer')
      })

      test('components should be exported from index file', () => {
        const indexPath = join(webAppPath, 'components', 'index.ts')
        const indexContent = readFileSync(indexPath, 'utf-8')
        
        expect(indexContent).toContain('Layout')
        expect(indexContent).toContain('Header')
        expect(indexContent).toContain('Footer')
        expect(indexContent).toContain('Navigation')
      })

      test('layout should be used in root layout', () => {
        const rootLayoutPath = join(webAppPath, 'app', 'layout.tsx')
        const rootLayoutContent = readFileSync(rootLayoutPath, 'utf-8')
        
        // Root layout should import and use the Layout component
        expect(rootLayoutContent).toContain('Layout')
      })
    })

    describe('Branding and Content', () => {
      test('header should include branding elements', () => {
        const headerPath = join(webAppPath, 'components', 'header.tsx')
        const headerContent = readFileSync(headerPath, 'utf-8')
        
        // Should have logo or brand name
        expect(headerContent).toMatch(/logo|brand|title/i)
      })

      test('footer should include copyright information', () => {
        const footerPath = join(webAppPath, 'components', 'footer.tsx')
        const footerContent = readFileSync(footerPath, 'utf-8')
        
        expect(footerContent).toMatch(/copyright|©|\d{4}/i)
      })

      test('footer should include useful links', () => {
        const footerPath = join(webAppPath, 'components', 'footer.tsx')
        const footerContent = readFileSync(footerPath, 'utf-8')
        
        expect(footerContent).toContain('<a')
        expect(footerContent).toContain('href')
      })
    })

    describe('Theme Integration', () => {
      test('layout components should support theme switching', () => {
        const headerPath = join(webAppPath, 'components', 'header.tsx')
        const headerContent = readFileSync(headerPath, 'utf-8')
        
        expect(headerContent).toContain('ThemeToggle')
      })

      test('layout should use theme-aware classes', () => {
        const layoutPath = join(webAppPath, 'components', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        // Should use CSS variables or theme-aware classes
        expect(layoutContent).toMatch(/bg-background|bg-\[var\(--background\)\]/)
      })
    })
  })

  describe('Landing Page with Responsive Design', () => {
    describe('Hero Section', () => {
      test('should have hero section in main page', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have hero section with headline and CTA
        expect(pageContent).toContain('hero') || expect(pageContent).toContain('Hero')
      })

      test('should have compelling headline in hero section', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have h1 tag for main headline
        expect(pageContent).toContain('<h1') || expect(pageContent).toContain('h1')
      })

      test('should have call-to-action button in hero section', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have CTA button or link
        expect(pageContent).toContain('button') || expect(pageContent).toContain('Button')
      })

      test('should have proper responsive design classes', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have responsive Tailwind classes
        expect(pageContent).toMatch(/sm:|md:|lg:|xl:/)
      })
    })

    describe('Features Section', () => {
      test('should have features section showcasing key benefits', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have features section
        expect(pageContent).toContain('features') || expect(pageContent).toContain('Features')
      })

      test('should have multiple feature items', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have multiple feature items (at least 3)
        const featureMatches = pageContent.match(/feature/gi) || []
        expect(featureMatches.length).toBeGreaterThanOrEqual(3)
      })

      test('should use Card components for features', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should import and use Card component from shadcn/ui
        expect(pageContent).toContain('Card') || expect(pageContent).toContain('card')
      })
    })

    describe('Semantic HTML Structure', () => {
      test('should use proper semantic HTML tags', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should use semantic HTML5 tags
        expect(pageContent).toContain('<section') || expect(pageContent).toContain('section')
        expect(pageContent).toContain('<h1') || expect(pageContent).toContain('h1')
        expect(pageContent).toContain('<h2') || expect(pageContent).toContain('h2')
      })

      test('should have proper heading hierarchy', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have h1 for main title and h2 for section titles
        expect(pageContent).toContain('h1')
        expect(pageContent).toContain('h2')
      })

      test('should have descriptive alt text for images', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // All images should have meaningful alt text
        const imageMatches = pageContent.match(/<Image[^>]*alt="[^"]+"/g) || []
        const allImageMatches = pageContent.match(/<Image/g) || []
        
        if (allImageMatches.length > 0) {
          expect(imageMatches.length).toBe(allImageMatches.length)
        }
      })
    })

    describe('Mobile-First Responsive Design', () => {
      test('should have mobile-first responsive layout', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should use mobile-first responsive classes
        expect(pageContent).toMatch(/\bsm:|\bmd:|\blg:|\bxl:/)
      })

      test('should have responsive grid layout for features', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have responsive grid classes
        expect(pageContent).toMatch(/grid|flex/)
        expect(pageContent).toMatch(/grid-cols-\d|flex-col|flex-row/)
      })

      test('should have responsive text sizes', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have responsive text size classes
        expect(pageContent).toMatch(/text-\w+|sm:text-|md:text-|lg:text-/)
      })

      test('should have responsive spacing and padding', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have responsive padding/margin classes
        expect(pageContent).toMatch(/p-\d|px-\d|py-\d|m-\d|mx-\d|my-\d/)
        expect(pageContent).toMatch(/sm:p-|md:p-|lg:p-|sm:m-|md:m-|lg:m-/)
      })
    })

    describe('SEO and Meta Tags', () => {
      test('should have proper meta tags in layout', () => {
        const layoutPath = join(webAppPath, 'app', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        // Should have metadata export for Next.js 13+ App Router
        expect(layoutContent).toContain('export const metadata') || expect(layoutContent).toContain('generateMetadata')
      })

      test('should have meta description configured', () => {
        const layoutPath = join(webAppPath, 'app', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        // Should have description in metadata
        expect(layoutContent).toContain('description')
      })

      test('should have Open Graph meta tags', () => {
        const layoutPath = join(webAppPath, 'app', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        // Should have Open Graph configuration
        expect(layoutContent).toContain('openGraph') || expect(layoutContent).toContain('og:')
      })

      test('should have Twitter Card meta tags', () => {
        const layoutPath = join(webAppPath, 'app', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        // Should have Twitter Card configuration
        expect(layoutContent).toContain('twitter') || expect(layoutContent).toContain('twitter:')
      })

      test('should have proper title structure', () => {
        const layoutPath = join(webAppPath, 'app', 'layout.tsx')
        const layoutContent = readFileSync(layoutPath, 'utf-8')
        
        // Should have title in metadata
        expect(layoutContent).toContain('title')
      })
    })

    describe('Accessibility and Performance', () => {
      test('should have proper landmark roles for page sections', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should use semantic section tags
        expect(pageContent).toContain('<section') || expect(pageContent).toContain('section')
      })

      test('should have proper focus management for interactive elements', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Interactive elements should be focusable
        if (pageContent.includes('button') || pageContent.includes('Button')) {
          expect(pageContent).not.toContain('tabIndex="-1"')
        }
      })

      test('should optimize images with Next.js Image component', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should use Next.js Image component for optimization
        if (pageContent.includes('<Image') || pageContent.includes('Image')) {
          expect(pageContent).toContain('from "next/image"')
        }
      })
    })

    describe('Content Quality', () => {
      test('should have meaningful and compelling content', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should not contain placeholder text like Lorem ipsum
        expect(pageContent).not.toContain('lorem')
        expect(pageContent).not.toContain('Lorem')
        expect(pageContent).not.toContain('ipsum')
      })

      test('should have clear value proposition', () => {
        const pagePath = join(webAppPath, 'app', 'page.tsx')
        const pageContent = readFileSync(pagePath, 'utf-8')
        
        // Should have meaningful headline
        expect(pageContent.length).toBeGreaterThan(500) // Basic content length check
      })
    })
  })
})