import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as server from '@/lib/supabase/server'
import { supabase as browserSupabase } from '@/lib/supabase/client'
import {
  getClientSession,
  getClientUser,
  getServerSession,
  getServerUser,
} from '@/lib/supabase/auth'

vi.mock('@/lib/supabase/client', async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    supabase: {
      auth: {
        getSession: vi.fn(),
        getUser: vi.fn(),
      },
    },
  }
})

describe('session helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('getServerSession returns session or null', async () => {
    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: { id: 's' } },
        }),
      },
    } as never)
    expect(await getServerSession()).toEqual({ id: 's' })

    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'x' },
        }),
      },
    } as never)
    expect(await getServerSession()).toBeNull()
  })

  it('getServerUser returns user or null', async () => {
    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u' } } }),
      },
    } as never)
    expect(await getServerUser()).toEqual({ id: 'u' })

    vi.spyOn(server, 'createClient').mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as never)
    expect(await getServerUser()).toBeNull()
  })

  it('client helpers return session/user or null', async () => {
    ;(
      browserSupabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { session: { id: 'cs' } },
    })
    expect(await getClientSession()).toEqual({ id: 'cs' })
    ;(
      browserSupabase.auth.getSession as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { session: null },
      error: { message: 'x' },
    })
    expect(await getClientSession()).toBeNull()
    ;(
      browserSupabase.auth.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { user: { id: 'cu' } },
    })
    expect(await getClientUser()).toEqual({ id: 'cu' })
    ;(
      browserSupabase.auth.getUser as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { user: null },
    })
    expect(await getClientUser()).toBeNull()
  })
})
