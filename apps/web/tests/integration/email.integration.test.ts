import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn(async () => ({ data: { id: 'int_email_1' }, error: null })),
      },
    })),
  }
})

describe('Email integration (Resend)', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    delete process.env.RESEND_API_KEY
    delete process.env.EMAIL_FROM
  })

  it('returns not configured status when missing API key', async () => {
    const { ResendEmail } = await import('@repo/email')
    const email = new ResendEmail()
    const res = await email.send({ to: 'u@example.com', subject: 'Hello' })
    expect(res.ok).toBe(false)
  })

  it('succeeds when API key and from are configured', async () => {
    process.env.RESEND_API_KEY = 'int_key'
    process.env.EMAIL_FROM = 'noreply@example.com'
    const { ResendEmail } = await import('@repo/email')
    const email = new ResendEmail()
    const res = await email.send({ to: 'u@example.com', subject: 'Hello' })
    expect(res.ok).toBe(true)
    if (res.ok) expect(res.id).toBe('int_email_1')
  })
})
