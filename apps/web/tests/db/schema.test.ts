/**
 * @fileoverview Database Schema Validation Tests
 *
 * Tests to verify database schema is correctly implemented with proper
 * constraints, indexes, triggers, and table structures.
 */

import { createServiceRoleClient } from '@/lib/supabase/server'
import { beforeAll, describe, expect, it } from 'vitest'

describe('Database Schema Validation', () => {
  let supabase: ReturnType<typeof createServiceRoleClient>

  beforeAll(() => {
    supabase = createServiceRoleClient()
  })

  describe('Core Tables Structure', () => {
    it('should be able to query profiles table', async () => {
      // Test that the table exists and has the expected structure
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, created_at, updated_at')
        .limit(0)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('should be able to query subscriptions table', async () => {
      // Test that the table exists and has the expected structure
      const { data, error } = await supabase
        .from('subscriptions')
        .select(
          'id, user_id, status, plan, lemon_squeezy_id, current_period_start, current_period_end, trial_ends_at, created_at, updated_at'
        )
        .limit(0)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    it('should be able to query usage_counters table', async () => {
      // Test that the table exists and has the expected structure
      const { data, error } = await supabase
        .from('usage_counters')
        .select(
          'id, user_id, metric, count, window_start, window_end, created_at, updated_at'
        )
        .limit(0)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })

  describe('Table Constraints', () => {
    it('should enforce subscription status constraints', async () => {
      // Test invalid status value
      const { error } = await supabase.from('subscriptions').insert({
        user_id: crypto.randomUUID(),
        status: 'invalid_status' as any,
        plan: 'free',
      })

      expect(error).toBeDefined()
      expect(error?.message).toContain('violates check constraint')
    })

    it('should enforce subscription plan constraints', async () => {
      // Test invalid plan value
      const { error } = await supabase.from('subscriptions').insert({
        user_id: crypto.randomUUID(),
        status: 'trial',
        plan: 'invalid_plan' as any,
      })

      expect(error).toBeDefined()
      expect(error?.message).toContain('violates check constraint')
    })

    it('should enforce unique user_id constraint on subscriptions', async () => {
      // Create a test auth user first
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: 'subscription-test@example.com',
          password: 'test-password-123',
          email_confirm: true,
        })

      if (authError || !authUser?.user) {
        throw new Error('Failed to create test user')
      }

      const userId = authUser.user.id

      // Create the corresponding profile
      await supabase.from('profiles').insert({
        id: userId,
        email: 'subscription-test@example.com',
      })

      // Insert first subscription
      const { error: error1 } = await supabase.from('subscriptions').insert({
        user_id: userId,
        status: 'trial',
        plan: 'free',
      })

      expect(error1).toBeNull()

      // Try to insert duplicate subscription for same user
      const { error: error2 } = await supabase.from('subscriptions').insert({
        user_id: userId,
        status: 'active',
        plan: 'pro',
      })

      expect(error2).toBeDefined()
      expect(error2?.message).toContain(
        'duplicate key value violates unique constraint'
      )

      // Cleanup
      await supabase.from('subscriptions').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      await supabase.auth.admin.deleteUser(userId)
    })

    it('should enforce unique constraint on usage_counters composite key', async () => {
      // Create a test auth user first
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: 'usage-test@example.com',
          password: 'test-password-123',
          email_confirm: true,
        })

      if (authError || !authUser?.user) {
        throw new Error('Failed to create test user')
      }

      const userId = authUser.user.id
      const windowStart = new Date().toISOString()

      // Create the corresponding profile
      await supabase.from('profiles').insert({
        id: userId,
        email: 'usage-test@example.com',
      })

      // Insert first usage counter
      const { error: error1 } = await supabase.from('usage_counters').insert({
        user_id: userId,
        metric: 'api_calls',
        count: 10,
        window_start: windowStart,
        window_end: new Date(Date.now() + 86400000).toISOString(),
      })

      expect(error1).toBeNull()

      // Try to insert duplicate usage counter
      const { error: error2 } = await supabase.from('usage_counters').insert({
        user_id: userId,
        metric: 'api_calls',
        count: 20,
        window_start: windowStart,
        window_end: new Date(Date.now() + 86400000).toISOString(),
      })

      expect(error2).toBeDefined()
      expect(error2?.message).toContain(
        'duplicate key value violates unique constraint'
      )

      // Cleanup
      await supabase.from('usage_counters').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      await supabase.auth.admin.deleteUser(userId)
    })
  })

  describe('Foreign Key Relationships', () => {
    it('should enforce foreign key constraint from subscriptions to profiles', async () => {
      const nonExistentUserId = crypto.randomUUID()

      const { error } = await supabase.from('subscriptions').insert({
        user_id: nonExistentUserId,
        status: 'trial',
        plan: 'free',
      })

      expect(error).toBeDefined()
      expect(error?.message).toContain('violates foreign key constraint')
    })

    it('should enforce foreign key constraint from usage_counters to profiles', async () => {
      const nonExistentUserId = crypto.randomUUID()

      const { error } = await supabase.from('usage_counters').insert({
        user_id: nonExistentUserId,
        metric: 'api_calls',
        count: 10,
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 86400000).toISOString(),
      })

      expect(error).toBeDefined()
      expect(error?.message).toContain('violates foreign key constraint')
    })
  })

  describe('Triggers and Functions', () => {
    it('should update updated_at timestamp on profile updates', async () => {
      // Create a test auth user first
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: 'timestamp-test@example.com',
          password: 'test-password-123',
          email_confirm: true,
        })

      if (authError || !authUser?.user) {
        throw new Error('Failed to create test user')
      }

      const userId = authUser.user.id

      // Create test profile
      await supabase.from('profiles').insert({
        id: userId,
        email: 'timestamp-test@example.com',
      })

      // Get initial timestamp
      const { data: initial } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('id', userId)
        .single()

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100))

      // Update profile
      await supabase
        .from('profiles')
        .update({ email: 'updated@example.com' })
        .eq('id', userId)

      // Get updated timestamp
      const { data: updated } = await supabase
        .from('profiles')
        .select('updated_at')
        .eq('id', userId)
        .single()

      expect(new Date(updated?.updated_at || 0)).toBeInstanceOf(Date)
      expect(new Date(updated?.updated_at || 0).getTime()).toBeGreaterThan(
        new Date(initial?.updated_at || 0).getTime()
      )

      // Cleanup
      await supabase.from('profiles').delete().eq('id', userId)
      await supabase.auth.admin.deleteUser(userId)
    })

    it('should update updated_at timestamp on subscription updates', async () => {
      // Create a test auth user first
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: 'sub-timestamp-test@example.com',
          password: 'test-password-123',
          email_confirm: true,
        })

      if (authError || !authUser?.user) {
        throw new Error('Failed to create test user')
      }

      const userId = authUser.user.id

      // Create test profile and subscription
      await supabase.from('profiles').insert({
        id: userId,
        email: 'sub-timestamp-test@example.com',
      })

      await supabase.from('subscriptions').insert({
        user_id: userId,
        status: 'trial',
        plan: 'free',
      })

      // Get initial timestamp
      const { data: initial } = await supabase
        .from('subscriptions')
        .select('updated_at')
        .eq('user_id', userId)
        .single()

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100))

      // Update subscription
      await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('user_id', userId)

      // Get updated timestamp
      const { data: updated } = await supabase
        .from('subscriptions')
        .select('updated_at')
        .eq('user_id', userId)
        .single()

      expect(new Date(updated?.updated_at || 0)).toBeInstanceOf(Date)
      expect(new Date(updated?.updated_at || 0).getTime()).toBeGreaterThan(
        new Date(initial?.updated_at || 0).getTime()
      )

      // Cleanup
      await supabase.from('subscriptions').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      await supabase.auth.admin.deleteUser(userId)
    })
  })

  describe('Storage Configuration', () => {
    it('should have user-files storage bucket configured', async () => {
      const { data: buckets, error } = await supabase.storage.listBuckets()

      expect(error).toBeNull()
      expect(buckets).toBeDefined()

      const userFilesBucket = buckets?.find(
        bucket => bucket.name === 'user-files'
      )
      expect(userFilesBucket).toBeDefined()
      expect(userFilesBucket?.public).toBe(false)
    })

    it('should have storage helper functions available', async () => {
      // Test get_user_file_path function
      const { data: pathResult, error: pathError } = await supabase.rpc(
        'get_user_file_path',
        {
          user_id: crypto.randomUUID(),
          file_name: 'test.jpg',
          file_category: 'profile',
        }
      )

      expect(pathError).toBeNull()
      expect(pathResult).toBeDefined()
      expect(typeof pathResult).toBe('string')
      expect(pathResult).toContain('profile/test.jpg')

      // Test validate_user_file_path function
      const testUserId = crypto.randomUUID()
      const validPath = `${testUserId}/profile/test.jpg`
      const invalidPath = `${crypto.randomUUID()}/profile/test.jpg`

      const { data: validResult, error: validError } = await supabase.rpc(
        'validate_user_file_path',
        {
          file_path: validPath,
          user_id: testUserId,
        }
      )

      const { data: invalidResult, error: invalidError } = await supabase.rpc(
        'validate_user_file_path',
        {
          file_path: invalidPath,
          user_id: testUserId,
        }
      )

      expect(validError).toBeNull()
      expect(validResult).toBe(true)
      expect(invalidError).toBeNull()
      expect(invalidResult).toBe(false)
    })
  })
})
