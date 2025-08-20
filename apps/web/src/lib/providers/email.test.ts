import { describe, it, expect, vi } from 'vitest'

vi.mock('@repo/email', () => ({
  ResendEmail: class {},
}))

describe('email provider binding', () => {
  it('defaults to resend', async () => {
    delete process.env.EMAIL_PROVIDER
    const mod = await import('./email')
    const client = mod.getEmail()
    expect(client).toBeTruthy()
  })

  it('throws on unsupported provider', async () => {
    process.env.EMAIL_PROVIDER = 'unknown' as any
    const mod = await import('./email')
    expect(() => mod.getEmail()).toThrow(/Unsupported EMAIL_PROVIDER/)
  })
})
