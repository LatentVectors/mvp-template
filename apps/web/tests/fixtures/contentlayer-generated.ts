export const allPosts: Array<{
  title: string
  slug: string
  date: string
  url: string
  tags?: string[]
  body: { raw: string; code: string }
}> = [
  {
    title: 'GFM Showcase',
    slug: 'gfm',
    date: '2024-01-01',
    url: '/blog/gfm',
    tags: ['seo', 'gfm'],
    body: {
      raw: '~~strike~~\n\n|a|b|\n- [x] done\n```ts\nconst x=1\n```\n\n# Heading Example',
      // Simulate compiled MDX output markers we assert for
      code:
        '<del>strike</del><table><thead></thead><tbody></tbody></table>' +
        '<input type="checkbox"/>' +
        '<pre class="hljs"><code class="language-typescript">const x=1</code></pre>' +
        '<h1 id="heading-example"><a class="heading-anchor">Link to section</a>Heading Example</h1>',
    },
  },
]
