import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/og/route'
import { NextRequest } from 'next/server'

describe('Open Graph Image Route', () => {
  it('handles title and theme params', async () => {
    const req = new NextRequest(
      'http://test/api/og?title=Hello&type=blog&theme=dark'
    )
    const res = (await GET(
      req as unknown as NextRequest
    )) as unknown as Response
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toContain('immutable')
  })

  it('falls back to defaults when params missing', async () => {
    const req = new NextRequest('http://test/api/og')
    const res = (await GET(
      req as unknown as NextRequest
    )) as unknown as Response
    expect(res.status).toBe(200)
  })
})
