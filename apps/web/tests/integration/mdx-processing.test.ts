import { describe, expect, it } from 'vitest'
import { allPosts } from '.contentlayer/generated'

describe('MDX Processing', () => {
  it('should process GitHub Flavored Markdown features', () => {
    const post = allPosts[0]!
    const code = post.body.code
    expect(code).toMatch(/del/)
    expect(code).toMatch(/table|thead|tbody|tr|td/)
    expect(code).toMatch(/checkbox/)
  })

  it('should generate heading anchors with rehype-slug', () => {
    const code = allPosts[0]!.body.code
    expect(code).toMatch(/id="heading-example"/)
  })

  it('should generate heading anchor links with rehype-autolink-headings', () => {
    const code = allPosts[0]!.body.code
    expect(code).toMatch(/heading-anchor/)
    expect(code).toMatch(/Link to section/)
  })

  it('should apply syntax highlighting to code blocks', () => {
    const code = allPosts[0]!.body.code
    expect(code).toMatch(/hljs/)
    expect(code).toMatch(/language-typescript/)
  })

  it('should preserve custom MDX components markers', () => {
    const code = allPosts[0]!.body.code
    expect(code).not.toMatch(/<.*Component.*>/)
  })

  it('should have required frontmatter fields', () => {
    const post = allPosts[0]!
    expect(post.title).toBeDefined()
    expect(post.date).toBeDefined()
    expect(post.slug).toBeDefined()
  })
})
