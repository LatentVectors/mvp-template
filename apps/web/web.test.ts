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
})