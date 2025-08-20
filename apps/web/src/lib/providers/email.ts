import 'server-only'
import { ResendEmail } from '@repo/email'

export type EmailProvider = 'resend'

export function getEmail() {
  const provider = (process.env.EMAIL_PROVIDER || 'resend') as EmailProvider
  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY
    const defaultFrom = process.env.EMAIL_FROM
    return new ResendEmail({ apiKey, defaultFrom })
  }
  throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`)
}
