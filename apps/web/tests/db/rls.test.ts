/**
 * @fileoverview Row Level Security (RLS) Policy Tests
 *
 * Tests to verify RLS policies are correctly implemented and enforce
 * proper access controls for different user contexts.
 */

import { createClient } from '@/lib/supabase/client'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Row Level Security Policies', () => {
  let serviceClient: ReturnType<typeof createServiceRoleClient>
  let userClient: ReturnType<typeof createClient>
  let testUserId: string
  let otherUserId: string

  beforeAll(async () => {
    serviceClient = createServiceRoleClient()
    userClient = createClient()

    // Create test users using service client
    const { data: user1, error: error1 } =
      await serviceClient.auth.admin.createUser({
        email: 'test-user-1@example.com',
        password: 'test-password-123',
        email_confirm: true,
      })

    const { data: user2, error: error2 } =
      await serviceClient.auth.admin.createUser({
        email: 'test-user-2@example.com',
        password: 'test-password-123',
        email_confirm: true,
      })

    if (error1 || error2 || !user1?.user || !user2?.user) {
      throw new Error('Failed to create test users')
    }

    testUserId = user1.user.id
    otherUserId = user2.user.id

    // Create corresponding profiles
    await serviceClient.from('profiles').insert([
      { id: testUserId, email: 'test-user-1@example.com' },
      { id: otherUserId, email: 'test-user-2@example.com' },
    ])
  })

  afterAll(async () => {
    // Clean up test data
    await serviceClient
      .from('usage_counters')
      .delete()
      .eq('user_id', testUserId)
    await serviceClient
      .from('usage_counters')
      .delete()
      .eq('user_id', otherUserId)
    await serviceClient.from('subscriptions').delete().eq('user_id', testUserId)
    await serviceClient
      .from('subscriptions')
      .delete()
      .eq('user_id', otherUserId)
    await serviceClient.from('profiles').delete().eq('id', testUserId)
    await serviceClient.from('profiles').delete().eq('id', otherUserId)

    // Clean up auth users
    await serviceClient.auth.admin.deleteUser(testUserId)
    await serviceClient.auth.admin.deleteUser(otherUserId)

    // Sign out any remaining sessions
    await userClient.auth.signOut()
  })

  beforeEach(async () => {
    // Ensure we start each test with a clean session state
    await userClient.auth.signOut()
  })

  describe('Profiles Table RLS', () => {
    beforeEach(async () => {
      // Sign in as test user
      await userClient.auth.signInWithPassword({
        email: 'test-user-1@example.com',
        password: 'test-password-123',
      })
    })

    it('should allow users to read their own profile', async () => {
      const { data, error } = await userClient
        .from('profiles')
        .select('*')
        .eq('id', testUserId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.id).toBe(testUserId)
    })

    it('should prevent users from reading other profiles', async () => {
      const { data, error } = await userClient
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single()

      // Should either return empty result or error due to RLS
      expect(
        error || data === null || (Array.isArray(data) && data.length === 0)
      ).toBeTruthy()
    })

    it('should allow users to update their own profile', async () => {
      const updateData = { email: 'updated-test-1@example.com' }

      const { data, error } = await userClient
        .from('profiles')
        .update(updateData)
        .eq('id', testUserId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data?.email).toBe(updateData.email)

      // Restore original email
      await userClient
        .from('profiles')
        .update({ email: 'test-user-1@example.com' })
        .eq('id', testUserId)
    })

    it('should prevent users from updating other profiles', async () => {
      const updateData = { email: 'malicious-update@example.com' }

      const { data, error } = await userClient
        .from('profiles')
        .update(updateData)
        .eq('id', otherUserId)
        .select()

      // Should fail due to RLS policy - either return error or empty result
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })

    it('should prevent users from inserting profiles for other users', async () => {
      const newUserId = crypto.randomUUID()

      const { data, error } = await userClient
        .from('profiles')
        .insert({
          id: newUserId,
          email: 'malicious-insert@example.com',
        })
        .select()

      // Should fail due to RLS policy - either return error or empty result
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })

    it('should prevent users from deleting other profiles', async () => {
      const { data, error } = await userClient
        .from('profiles')
        .delete()
        .eq('id', otherUserId)
        .select()

      // Should fail due to RLS policy - either return error or empty result
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })
  })

  describe('Subscriptions Table RLS', () => {
    let testSubscriptionId: string

    beforeAll(async () => {
      // Create test subscription using service client
      const { data, error } = await serviceClient
        .from('subscriptions')
        .insert({
          user_id: testUserId,
          status: 'trial',
          plan: 'free',
        })
        .select()
        .single()

      if (error || !data) {
        throw new Error('Failed to create test subscription')
      }
      testSubscriptionId = data.id
    })

    beforeEach(async () => {
      // Sign in as test user
      await userClient.auth.signInWithPassword({
        email: 'test-user-1@example.com',
        password: 'test-password-123',
      })
    })

    it('should allow users to read their own subscription', async () => {
      const { data, error } = await userClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', testUserId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.user_id).toBe(testUserId)
    })

    it('should prevent users from reading other subscriptions', async () => {
      const { data, error } = await userClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', otherUserId)

      expect(data).toEqual([])
      expect(error).toBeNull() // Empty result, not error
    })

    it('should prevent users from modifying subscriptions', async () => {
      const { data, error } = await userClient
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', testSubscriptionId)
        .select()

      // Should fail due to RLS policy - only service role can modify
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })

    it('should prevent users from inserting subscriptions', async () => {
      const { data, error } = await userClient
        .from('subscriptions')
        .insert({
          user_id: testUserId,
          status: 'active',
          plan: 'pro',
        })
        .select()

      // Should fail due to RLS policy - only service role can insert
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })

    it('should prevent users from deleting subscriptions', async () => {
      const { data, error } = await userClient
        .from('subscriptions')
        .delete()
        .eq('id', testSubscriptionId)
        .select()

      // Should fail due to RLS policy - only service role can delete
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })
  })

  describe('Usage Counters Table RLS', () => {
    let testCounterId: string

    beforeAll(async () => {
      // Create test usage counter using service client
      const { data, error } = await serviceClient
        .from('usage_counters')
        .insert({
          user_id: testUserId,
          metric: 'api_calls',
          count: 10,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + 86400000).toISOString(), // +1 day
        })
        .select()
        .single()

      if (error || !data) {
        throw new Error('Failed to create test usage counter')
      }
      testCounterId = data.id
    })

    beforeEach(async () => {
      // Sign in as test user
      await userClient.auth.signInWithPassword({
        email: 'test-user-1@example.com',
        password: 'test-password-123',
      })
    })

    it('should allow users to read their own usage data', async () => {
      const { data, error } = await userClient
        .from('usage_counters')
        .select('*')
        .eq('user_id', testUserId)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      expect(data?.length).toBeGreaterThan(0)
      expect(data?.[0]?.user_id).toBe(testUserId)
    })

    it('should prevent users from reading other usage data', async () => {
      const { data, error } = await userClient
        .from('usage_counters')
        .select('*')
        .eq('user_id', otherUserId)

      expect(data).toEqual([])
      expect(error).toBeNull() // Empty result, not error
    })

    it('should prevent users from modifying usage counters', async () => {
      const { data, error } = await userClient
        .from('usage_counters')
        .update({ count: 999 })
        .eq('id', testCounterId)
        .select()

      // Should fail due to RLS policy - only service role can modify
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })

    it('should prevent users from inserting usage counters', async () => {
      const { data, error } = await userClient
        .from('usage_counters')
        .insert({
          user_id: testUserId,
          metric: 'storage_mb',
          count: 100,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + 86400000).toISOString(),
        })
        .select()

      // Should fail due to RLS policy - only service role can insert
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })

    it('should prevent users from deleting usage counters', async () => {
      const { data, error } = await userClient
        .from('usage_counters')
        .delete()
        .eq('id', testCounterId)
        .select()

      // Should fail due to RLS policy - only service role can delete
      expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy()
    })
  })

  describe('Service Role Access', () => {
    it('should allow service role to manage all profiles', async () => {
      // Test read access
      const { data: profiles, error: readError } = await serviceClient
        .from('profiles')
        .select('*')

      expect(readError).toBeNull()
      expect(profiles).toBeDefined()
      expect(profiles?.length).toBeGreaterThan(0)

      // Test update access
      const { data: updated, error: updateError } = await serviceClient
        .from('profiles')
        .update({ email: 'service-updated@example.com' })
        .eq('id', testUserId)
        .select()
        .single()

      expect(updateError).toBeNull()
      expect(updated).toBeDefined()

      // Restore original email
      await serviceClient
        .from('profiles')
        .update({ email: 'test-user-1@example.com' })
        .eq('id', testUserId)
    })

    it('should allow service role to manage all subscriptions', async () => {
      // Test read access
      const { data: subscriptions, error: readError } = await serviceClient
        .from('subscriptions')
        .select('*')

      expect(readError).toBeNull()
      expect(subscriptions).toBeDefined()

      // Test insert access
      const { data: inserted, error: insertError } = await serviceClient
        .from('subscriptions')
        .insert({
          user_id: otherUserId,
          status: 'trial',
          plan: 'basic',
        })
        .select()
        .single()

      expect(insertError).toBeNull()
      expect(inserted).toBeDefined()

      // Test update access
      const { data: updated, error: updateError } = await serviceClient
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('id', inserted!.id)
        .select()
        .single()

      expect(updateError).toBeNull()
      expect(updated?.status).toBe('active')

      // Cleanup
      await serviceClient.from('subscriptions').delete().eq('id', inserted!.id)
    })

    it('should allow service role to manage all usage counters', async () => {
      // Test read access
      const { data: counters, error: readError } = await serviceClient
        .from('usage_counters')
        .select('*')

      expect(readError).toBeNull()
      expect(counters).toBeDefined()

      // Test insert access
      const { data: inserted, error: insertError } = await serviceClient
        .from('usage_counters')
        .insert({
          user_id: otherUserId,
          metric: 'storage_mb',
          count: 50,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + 86400000).toISOString(),
        })
        .select()
        .single()

      expect(insertError).toBeNull()
      expect(inserted).toBeDefined()

      // Test update access
      const { data: updated, error: updateError } = await serviceClient
        .from('usage_counters')
        .update({ count: 75 })
        .eq('id', inserted!.id)
        .select()
        .single()

      expect(updateError).toBeNull()
      expect(updated?.count).toBe(75)

      // Cleanup
      await serviceClient.from('usage_counters').delete().eq('id', inserted!.id)
    })
  })

  describe('Unauthenticated Access', () => {
    it('should prevent unauthenticated access to profiles', async () => {
      const anonClient = createClient()
      // Ensure the client is unauthenticated
      await anonClient.auth.signOut()

      const { data, error } = await anonClient.from('profiles').select('*')

      expect(data).toEqual([])
      expect(error).toBeNull() // RLS filters results, doesn't error
    })

    it('should prevent unauthenticated access to subscriptions', async () => {
      const anonClient = createClient()
      // Ensure the client is unauthenticated
      await anonClient.auth.signOut()

      const { data, error } = await anonClient.from('subscriptions').select('*')

      expect(data).toEqual([])
      expect(error).toBeNull() // RLS filters results, doesn't error
    })

    it('should prevent unauthenticated access to usage_counters', async () => {
      const anonClient = createClient()
      // Ensure the client is unauthenticated
      await anonClient.auth.signOut()

      const { data, error } = await anonClient
        .from('usage_counters')
        .select('*')

      expect(data).toEqual([])
      expect(error).toBeNull() // RLS filters results, doesn't error
    })
  })
})
