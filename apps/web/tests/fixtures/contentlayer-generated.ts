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

export const allLegalPages: Array<{
  title: string
  slug: string
  lastUpdated: string
  body: { html: string }
}> = [
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    lastUpdated: '2024-08-01',
    body: {
      html:
        '<p>Last updated: August 1, 2024</p>' +
        '<h2>Introduction</h2>' +
        '<h2>Information We Collect</h2>' +
        '<h3>Personal Information</h3>' +
        '<ul><li>Name and email</li></ul>' +
        '<h3>Automatically Collected Information</h3>' +
        '<h2>How We Use Information</h2>' +
        '<h2>Data Protection</h2>' +
        '<h2>Data Sharing</h2>' +
        '<h2>Your Rights</h2>' +
        '<h2>Cookies and Tracking</h2>' +
        '<h2>Data Retention</h2>' +
        '<h2>International Transfers</h2>' +
        '<h2>Updates to This Policy</h2>' +
        '<h2>Contact Us</h2>',
    },
  },
  {
    title: 'Terms of Service',
    slug: 'terms',
    lastUpdated: '2024-08-01',
    body: {
      html:
        '<p>Last updated: August 1, 2024</p>' +
        '<h2>Acceptance of Terms</h2>' +
        '<h2>Description of Service</h2>' +
        '<h2>Use of Service</h2>' +
        '<h2>User Responsibilities</h2>' +
        '<h2>Account Registration</h2>' +
        '<h2>Intellectual Property</h2>' +
        '<h2>Payment Terms</h2>' +
        '<h2>Privacy Policy</h2>' +
        '<h2>Termination</h2>' +
        '<h2>Disclaimers</h2>' +
        '<h2>Limitation of Liability</h2>' +
        '<h2>Governing Law</h2>' +
        '<h2>Changes to Terms</h2>' +
        '<h2>Contact Information</h2>',
    },
  },
  {
    title: 'Cookie Policy',
    slug: 'cookies',
    lastUpdated: '2024-08-01',
    body: {
      html:
        '<p>Last updated: August 1, 2024</p>' +
        '<h2>What Are Cookies</h2>' +
        '<h2>How We Use Cookies</h2>' +
        '<h2>Types of Cookies</h2>' +
        '<h3>Essential Cookies</h3>' +
        '<h3>Functional Cookies</h3>' +
        '<h3>Analytics Cookies</h3>' +
        '<h3>Marketing Cookies</h3>' +
        '<h2>Third-Party Cookies</h2>' +
        '<h2>Managing Cookies</h2>' +
        '<h3>Browser Settings</h3>' +
        '<h3>Cookie Consent</h3>' +
        '<h3>Opt-Out Links</h3>' +
        '<h2>Cookie Retention</h2>' +
        '<h2>Impact of Disabling Cookies</h2>' +
        '<h2>Updates to This Policy</h2>' +
        '<h2>More Information</h2>' +
        '<h2>Contact Us</h2>',
    },
  },
]
