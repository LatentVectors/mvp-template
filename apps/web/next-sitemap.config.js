/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mvp-template.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*', '/404', '/500', '/admin/*', '/test/*'],
  additionalPaths: async config => {
    try {
      // Import the built version from the next.js server build
      const { getAllPosts } = await import(
        './.next/server/chunks/lib/content-utils.js'
      ).catch(async () => {
        // Fallback: use dynamic import during build time
        const contentlayer = await import('contentlayer2/generated')
        const posts = contentlayer.allPosts || []
        return { getAllPosts: () => posts }
      })
      const posts = getAllPosts()

      return posts.map(post => ({
        loc: `/blog/${post.slug}`,
        lastmod: new Date(post.date).toISOString(),
        changefreq: 'weekly',
        priority: 0.8,
      }))
    } catch (error) {
      console.warn(
        'Could not load posts for sitemap generation:',
        error.message
      )
      return []
    }
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/api/', '/_next/', '/admin/', '/test/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://mvp-template.vercel.app'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Set different priorities and change frequencies for different page types
    const priority = getPriorityForPath(path)
    const changefreq = getChangefreqForPath(path)

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
    }
  },
}

function getPriorityForPath(path) {
  if (path === '/') return 1.0
  if (path === '/blog') return 0.9
  if (path.startsWith('/blog/')) return 0.8
  if (
    path.includes('/privacy') ||
    path.includes('/terms') ||
    path.includes('/cookies')
  )
    return 0.6
  return 0.7
}

function getChangefreqForPath(path) {
  if (path === '/') return 'daily'
  if (path === '/blog') return 'daily'
  if (path.startsWith('/blog/')) return 'weekly'
  if (
    path.includes('/privacy') ||
    path.includes('/terms') ||
    path.includes('/cookies')
  )
    return 'monthly'
  return 'weekly'
}
