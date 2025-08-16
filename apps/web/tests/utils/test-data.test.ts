import { describe, expect, it } from 'vitest'
import { generateTestEmail } from './test-data'

describe('test-data utilities', () => {
  it('generates unique emails with prefix', () => {
    const a = generateTestEmail('alpha')
    const b = generateTestEmail('alpha')
    expect(a).not.toEqual(b)
    expect(a.startsWith('alpha-')).toBe(true)
    expect(b.startsWith('alpha-')).toBe(true)
  })

  it('appends example.com domain', () => {
    const email = generateTestEmail('domain')
    expect(email.endsWith('@example.com')).toBe(true)
  })
})
