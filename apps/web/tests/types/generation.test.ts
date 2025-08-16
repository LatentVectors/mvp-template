/**
 * @fileoverview Type Generation Validation Tests
 *
 * Tests to verify that the type generation produces accurate TypeScript
 * definitions that match the actual database schema.
 */

import { describe, expect, it } from 'vitest'
import type {
  Database,
  Profile,
  Subscription,
  UsageCounter,
} from '@repo/types/database'

describe('Type Generation Validation', () => {
  describe('Generated Database Types', () => {
    it('should have Database interface with public schema', () => {
      // This test verifies the Database type exists and has correct structure
      // We can't actually instantiate it, but we can verify type compatibility
      type ExpectedStructure = {
        public: {
          Tables: {
            profiles: any
            subscriptions: any
            usage_counters: any
          }
          Views: any
          Functions: any
          Enums: any
          CompositeTypes: any
        }
        graphql_public: any
      }

      // Type compatibility test - this would fail at compile time if types don't match
      expect(() => {
        ;({}) as ExpectedStructure as Database
      }).not.toThrow() // If we get here, types are compatible
    })

    it('should have correct table definitions', () => {
      // Test that table types exist and are properly shaped
      type ProfileTable = Database['public']['Tables']['profiles']
      type SubscriptionTable = Database['public']['Tables']['subscriptions']
      type UsageCounterTable = Database['public']['Tables']['usage_counters']

      // Type existence test
      expect(() => {
        ;({}) as ProfileTable as ProfileTable
        ;({}) as SubscriptionTable as SubscriptionTable
        ;({}) as UsageCounterTable as UsageCounterTable
      }).not.toThrow() // If we get here, all types exist
    })
  })

  describe('Profile Type Validation', () => {
    it('should have correct Profile type structure', () => {
      const profile: Profile = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      // Type assertions to verify the shape
      expect(typeof profile.id).toBe('string')
      expect(typeof profile.email).toBe('string')
      expect(typeof profile.created_at).toBe('string')
      expect(typeof profile.updated_at).toBe('string')
    })

    it('should have Insert and Update variants', () => {
      type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
      type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

      // Insert type should have required fields
      const insert: ProfileInsert = {
        id: 'test-id',
        email: 'test@example.com',
        // created_at and updated_at should be optional (defaulted)
      }

      // Update type should have all optional fields
      const update: ProfileUpdate = {
        email: 'updated@example.com',
        // All fields should be optional for updates
      }

      expect(insert.id).toBeDefined()
      expect(insert.email).toBeDefined()
      expect(update.email).toBeDefined()
    })
  })

  describe('Subscription Type Validation', () => {
    it('should have correct Subscription type structure', () => {
      const subscription: Subscription = {
        id: 'test-id',
        user_id: 'user-id',
        status: 'trial',
        plan: 'free',
        lemon_squeezy_id: null,
        current_period_start: null,
        current_period_end: null,
        trial_ends_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      expect(typeof subscription.id).toBe('string')
      expect(typeof subscription.user_id).toBe('string')
      expect(subscription.status).toBe('trial')
      expect(subscription.plan).toBe('free')
    })

    it('should enforce status enum values', () => {
      // These should be valid status values
      const validStatuses: Subscription['status'][] = [
        'trial',
        'active',
        'cancelled',
        'expired',
        'past_due',
      ]

      validStatuses.forEach(status => {
        const subscription: Partial<Subscription> = { status }
        expect(subscription.status).toBe(status)
      })

      // TypeScript should prevent invalid values at compile time
      // @ts-expect-error - invalid status should not be allowed
      const invalidSubscription: Partial<Subscription> = { status: 'invalid' }
    })

    it('should enforce plan enum values', () => {
      // These should be valid plan values
      const validPlans: Subscription['plan'][] = ['free', 'basic', 'pro']

      validPlans.forEach(plan => {
        const subscription: Partial<Subscription> = { plan }
        expect(subscription.plan).toBe(plan)
      })

      // TypeScript should prevent invalid values at compile time
      // @ts-expect-error - invalid plan should not be allowed
      const invalidSubscription: Partial<Subscription> = { plan: 'enterprise' }
    })
  })

  describe('Usage Counter Type Validation', () => {
    it('should have correct UsageCounter type structure', () => {
      const usageCounter: UsageCounter = {
        id: 'test-id',
        user_id: 'user-id',
        metric: 'api_calls',
        count: 100,
        window_start: '2025-01-01T00:00:00Z',
        window_end: '2025-01-02T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      expect(typeof usageCounter.id).toBe('string')
      expect(typeof usageCounter.user_id).toBe('string')
      expect(typeof usageCounter.metric).toBe('string')
      expect(typeof usageCounter.count).toBe('number')
      expect(typeof usageCounter.window_start).toBe('string')
      expect(typeof usageCounter.window_end).toBe('string')
    })

    it('should have correct numeric types', () => {
      // Verify count is a number type
      const counter: Pick<UsageCounter, 'count'> = { count: 42 }
      expect(typeof counter.count).toBe('number')

      // Should accept integers
      const integerCounter: Pick<UsageCounter, 'count'> = { count: 0 }
      expect(integerCounter.count).toBe(0)

      // Should accept large numbers
      const largeCounter: Pick<UsageCounter, 'count'> = { count: 999999 }
      expect(largeCounter.count).toBe(999999)
    })
  })

  describe('Type Helper Utilities', () => {
    it('should provide helper type aliases', () => {
      // Verify our helper types work
      const profile: Profile = {} as Profile
      const subscription: Subscription = {} as Subscription
      const usageCounter: UsageCounter = {} as UsageCounter

      expect(profile).toBeDefined()
      expect(subscription).toBeDefined()
      expect(usageCounter).toBeDefined()
    })

    it('should support complex query types', () => {
      // Test type for profile with subscription
      type ProfileWithSubscription = Profile & {
        subscription?: Subscription
      }

      const profileWithSub: ProfileWithSubscription = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        subscription: {
          id: 'sub-id',
          user_id: 'user-id',
          status: 'active',
          plan: 'pro',
          lemon_squeezy_id: null,
          current_period_start: null,
          current_period_end: null,
          trial_ends_at: null,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      }

      expect(profileWithSub.subscription?.plan).toBe('pro')
    })
  })

  describe('Type Compatibility', () => {
    it('should be compatible with Supabase client types', () => {
      // This test ensures our generated types work with Supabase operations
      type SelectQuery = Database['public']['Tables']['profiles']['Row']
      type InsertQuery = Database['public']['Tables']['profiles']['Insert']
      type UpdateQuery = Database['public']['Tables']['profiles']['Update']

      const selectResult: SelectQuery = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      const insertData: InsertQuery = {
        id: 'new-user-id',
        email: 'new@example.com',
      }

      const updateData: UpdateQuery = {
        email: 'updated@example.com',
      }

      expect(selectResult.id).toBeDefined()
      expect(insertData.email).toBeDefined()
      expect(updateData.email).toBeDefined()
    })

    it('should support nullable fields correctly', () => {
      // Verify nullable fields are properly typed
      const subscription: Subscription = {
        id: 'sub-id',
        user_id: 'user-id',
        status: 'trial',
        plan: 'free',
        lemon_squeezy_id: null, // Should be nullable
        current_period_start: null, // Should be nullable
        current_period_end: null, // Should be nullable
        trial_ends_at: null, // Should be nullable
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      // These should also accept string values
      const subscriptionWithValues: Subscription = {
        ...subscription,
        lemon_squeezy_id: 'lemon_123',
        current_period_start: '2025-01-01T00:00:00Z',
        current_period_end: '2025-02-01T00:00:00Z',
        trial_ends_at: '2025-01-15T00:00:00Z',
      }

      expect(subscription.lemon_squeezy_id).toBeNull()
      expect(subscriptionWithValues.lemon_squeezy_id).toBe('lemon_123')
    })
  })

  describe('Type Generation Consistency', () => {
    it('should have consistent timestamp types', () => {
      // Test with actual data to verify timestamp types
      const profile: Profile = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      const subscription: Subscription = {
        id: 'sub-id',
        user_id: 'user-id',
        status: 'trial',
        plan: 'free',
        lemon_squeezy_id: null,
        current_period_start: null,
        current_period_end: null,
        trial_ends_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      const usageCounter: UsageCounter = {
        id: 'counter-id',
        user_id: 'user-id',
        metric: 'api_calls',
        count: 100,
        window_start: '2025-01-01T00:00:00Z',
        window_end: '2025-01-02T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      expect(typeof profile.created_at).toBe('string')
      expect(typeof subscription.created_at).toBe('string')
      expect(typeof usageCounter.created_at).toBe('string')
    })

    it('should have consistent UUID types', () => {
      // Test with actual data to verify ID types
      const profile: Profile = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      const subscription: Subscription = {
        id: 'sub-id',
        user_id: 'user-id',
        status: 'trial',
        plan: 'free',
        lemon_squeezy_id: null,
        current_period_start: null,
        current_period_end: null,
        trial_ends_at: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      const usageCounter: UsageCounter = {
        id: 'counter-id',
        user_id: 'user-id',
        metric: 'api_calls',
        count: 100,
        window_start: '2025-01-01T00:00:00Z',
        window_end: '2025-01-02T00:00:00Z',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      }

      expect(typeof profile.id).toBe('string')
      expect(typeof subscription.id).toBe('string')
      expect(typeof usageCounter.id).toBe('string')
      expect(typeof subscription.user_id).toBe('string')
    })
  })
})
