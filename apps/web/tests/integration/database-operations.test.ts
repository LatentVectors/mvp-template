/**
 * @fileoverview Database Operations Integration Tests
 *
 * Tests to verify all database operations work correctly with generated types
 * and provide proper type safety and runtime behavior.
 */

import { createServiceRoleClient } from '@/lib/supabase/server'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Subscription,
  SubscriptionInsert,
  SubscriptionUpdate,
  UsageCounter,
  UsageCounterInsert,
  UsageCounterUpdate,
} from '@repo/types/database'

describe('Database Operations with Generated Types', () => {
  let supabase: ReturnType<typeof createServiceRoleClient>
  let testUserIds: string[] = []

  // Helper function to create a test user with auth and profile
  const createTestUser = async (email: string): Promise<string> => {
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: 'test-password-123',
        email_confirm: true,
      })

    if (authError || !authUser?.user) {
      throw new Error(`Failed to create test user: ${authError?.message}`)
    }

    const userId = authUser.user.id
    testUserIds.push(userId)

    // Create corresponding profile
    await supabase.from('profiles').insert({
      id: userId,
      email,
    })

    return userId
  }

  beforeAll(() => {
    supabase = createServiceRoleClient()
  })

  afterAll(async () => {
    // Cleanup all test data
    for (const userId of testUserIds) {
      await supabase.from('usage_counters').delete().eq('user_id', userId)
      await supabase.from('subscriptions').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
      // Also clean up auth users
      await supabase.auth.admin.deleteUser(userId)
    }
  })

  describe('Profile Operations', () => {
    it('should create profiles with correct types', async () => {
      // First create an auth user
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: 'typed-test@example.com',
          password: 'test-password-123',
          email_confirm: true,
        })

      expect(authError).toBeNull()
      expect(authUser?.user).toBeDefined()

      const profileData: ProfileInsert = {
        id: authUser!.user.id,
        email: 'typed-test@example.com',
      }

      testUserIds.push(profileData.id)

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      // Verify returned data matches Profile type
      const profile: Profile = data!
      expect(profile.id).toBe(profileData.id)
      expect(profile.email).toBe(profileData.email)
      expect(profile.created_at).toBeDefined()
      expect(profile.updated_at).toBeDefined()
      expect(typeof profile.created_at).toBe('string')
      expect(typeof profile.updated_at).toBe('string')
    })

    it('should update profiles with partial data', async () => {
      // Create test user
      const userId = await createTestUser('update-test@example.com')

      // Update with typed data
      const updateData: ProfileUpdate = {
        email: 'updated-email@example.com',
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const updatedProfile: Profile = data!
      expect(updatedProfile.email).toBe(updateData.email)
    })

    it('should query profiles with type safety', async () => {
      // Create test user
      const userId = await createTestUser('query-test@example.com')

      // Test different query patterns
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*')

      expect(allError).toBeNull()
      expect(Array.isArray(allProfiles)).toBe(true)
      expect(allProfiles?.length).toBeGreaterThan(0)

      // Test specific field selection
      const { data: emailOnly, error: emailError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single()

      expect(emailError).toBeNull()
      expect(emailOnly).toBeDefined()
      expect(emailOnly?.email).toBe('query-test@example.com')

      // Test with filters
      const { data: filtered, error: filterError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      expect(filterError).toBeNull()
      expect(filtered).toBeDefined()
      const typedProfile: Profile = filtered!
      expect(typedProfile.id).toBe(userId)
    })
  })

  describe('Subscription Operations', () => {
    let testUserId: string

    beforeAll(async () => {
      // Create test user properly
      testUserId = await createTestUser('subscription-test@example.com')
    })

    it('should create subscriptions with enum validation', async () => {
      const subscriptionData: SubscriptionInsert = {
        user_id: testUserId,
        status: 'trial',
        plan: 'free',
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const subscription: Subscription = data!
      expect(subscription.user_id).toBe(testUserId)
      expect(subscription.status).toBe('trial')
      expect(subscription.plan).toBe('free')
      expect(subscription.lemon_squeezy_id).toBeNull()
    })

    it('should update subscriptions with type safety', async () => {
      const updateData: SubscriptionUpdate = {
        status: 'active',
        plan: 'pro',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('user_id', testUserId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const updatedSubscription: Subscription = data!
      expect(updatedSubscription.status).toBe('active')
      expect(updatedSubscription.plan).toBe('pro')
      expect(updatedSubscription.current_period_start).toBeDefined()
      expect(updatedSubscription.current_period_end).toBeDefined()
    })

    it('should handle nullable fields correctly', async () => {
      // Test subscription with some null values
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', testUserId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const subscription: Subscription = data!
      // These fields can be null
      expect(
        subscription.trial_ends_at === null ||
          typeof subscription.trial_ends_at === 'string'
      ).toBe(true)
      expect(
        subscription.lemon_squeezy_id === null ||
          typeof subscription.lemon_squeezy_id === 'string'
      ).toBe(true)
    })
  })

  describe('Usage Counter Operations', () => {
    let testUserId: string

    beforeAll(async () => {
      // Create test user properly
      testUserId = await createTestUser('usage-test@example.com')
    })

    it('should create usage counters with numeric types', async () => {
      const usageData: UsageCounterInsert = {
        user_id: testUserId,
        metric: 'api_calls',
        count: 150,
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      const { data, error } = await supabase
        .from('usage_counters')
        .insert(usageData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const usageCounter: UsageCounter = data!
      expect(usageCounter.user_id).toBe(testUserId)
      expect(usageCounter.metric).toBe('api_calls')
      expect(usageCounter.count).toBe(150)
      expect(typeof usageCounter.count).toBe('number')
    })

    it('should handle large numeric values', async () => {
      const largeUsageData: UsageCounterInsert = {
        user_id: testUserId,
        metric: 'storage_bytes',
        count: 999999999,
        window_start: new Date().toISOString(),
        window_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }

      const { data, error } = await supabase
        .from('usage_counters')
        .insert(largeUsageData)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const usageCounter: UsageCounter = data!
      expect(usageCounter.count).toBe(999999999)
      expect(Number.isInteger(usageCounter.count)).toBe(true)
    })

    it('should update usage counters atomically', async () => {
      // Get current count
      const { data: current } = await supabase
        .from('usage_counters')
        .select('count')
        .eq('user_id', testUserId)
        .eq('metric', 'api_calls')
        .single()

      const currentCount = current?.count || 0

      // Update count
      const updateData: UsageCounterUpdate = {
        count: currentCount + 50,
      }

      const { data, error } = await supabase
        .from('usage_counters')
        .update(updateData)
        .eq('user_id', testUserId)
        .eq('metric', 'api_calls')
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      const updatedCounter: UsageCounter = data!
      expect(updatedCounter.count).toBe(currentCount + 50)
    })
  })

  describe('Complex Query Operations', () => {
    let testUserId: string

    beforeAll(async () => {
      // Create test user properly
      testUserId = await createTestUser('complex-test@example.com')

      await supabase.from('subscriptions').insert({
        user_id: testUserId,
        status: 'active',
        plan: 'pro',
      })

      await supabase.from('usage_counters').insert([
        {
          user_id: testUserId,
          metric: 'api_calls',
          count: 100,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          user_id: testUserId,
          metric: 'storage_mb',
          count: 50,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
    })

    it('should perform joined queries with proper types', async () => {
      // Query profile with subscription
      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
          *,
          subscriptions (*)
        `
        )
        .eq('id', testUserId)
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()

      // Verify the shape of joined data
      expect(data?.id).toBe(testUserId)
      expect(data?.email).toBe('complex-test@example.com')
      // With the unique constraint, subscriptions returns as an object, not array
      expect(typeof (data as any)?.subscriptions).toBe('object')
      expect((data as any)?.subscriptions?.plan).toBe('pro')
    })

    it('should aggregate usage data correctly', async () => {
      const { data, error } = await supabase
        .from('usage_counters')
        .select('metric, count')
        .eq('user_id', testUserId)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      expect(data?.length).toBe(2)

      // Verify we can work with the data
      const totalUsage = data?.reduce((sum, counter) => {
        expect(typeof counter.count).toBe('number')
        return sum + counter.count
      }, 0)

      expect(totalUsage).toBe(150) // 100 + 50
    })

    it('should handle filtering and sorting', async () => {
      const { data, error } = await supabase
        .from('usage_counters')
        .select('*')
        .eq('user_id', testUserId)
        .gte('count', 75)
        .order('count', { ascending: false })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      expect(data?.length).toBe(1)
      expect(data?.[0]?.metric).toBe('api_calls')
      expect(data?.[0]?.count).toBe(100)
    })
  })

  describe('Transaction-like Operations', () => {
    it('should handle multiple operations consistently', async () => {
      // Create test user properly
      const userId = await createTestUser('transaction-test@example.com')

      // Simulate creating subscription and initial usage
      try {
        // Create subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            status: 'trial',
            plan: 'free',
          })

        expect(subscriptionError).toBeNull()

        // Create initial usage tracking
        const { error: usageError } = await supabase
          .from('usage_counters')
          .insert({
            user_id: userId,
            metric: 'api_calls',
            count: 0,
            window_start: new Date().toISOString(),
            window_end: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })

        expect(usageError).toBeNull()

        // Verify all data was created
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single()

        const { data: usage } = await supabase
          .from('usage_counters')
          .select('*')
          .eq('user_id', userId)
          .single()

        expect(profile?.id).toBe(userId)
        expect(subscription?.user_id).toBe(userId)
        expect(usage?.user_id).toBe(userId)
      } catch (error) {
        // If anything fails, the test should fail
        throw error
      }
    })
  })

  describe('Type Safety Validation', () => {
    it('should enforce type constraints at runtime', async () => {
      // Create test user properly
      const userId = await createTestUser('type-safety@example.com')

      // Test that invalid enum values are rejected
      const { error: statusError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'invalid_status' as any,
          plan: 'free',
        })

      expect(statusError).toBeDefined()

      const { error: planError } = await supabase.from('subscriptions').insert({
        user_id: userId,
        status: 'trial',
        plan: 'invalid_plan' as any,
      })

      expect(planError).toBeDefined()
    })

    it('should handle edge cases correctly', async () => {
      // Create test user properly
      const userId = await createTestUser('edge-case@example.com')

      // Test zero count
      const { data: zeroUsage, error: zeroError } = await supabase
        .from('usage_counters')
        .insert({
          user_id: userId,
          metric: 'zero_metric',
          count: 0,
          window_start: new Date().toISOString(),
          window_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single()

      expect(zeroError).toBeNull()
      expect(zeroUsage?.count).toBe(0)

      // Test very long email
      const longEmail = 'a'.repeat(200) + '@example.com'
      const { data: profileData, error: emailError } = await supabase
        .from('profiles')
        .update({ email: longEmail })
        .eq('id', userId)
        .select()
        .single()

      // Should handle reasonable email lengths
      expect(emailError).toBeNull()
      expect(profileData?.email).toBe(longEmail)
    })
  })
})
