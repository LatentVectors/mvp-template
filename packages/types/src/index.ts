/**
 * @fileoverview Main entry point for shared types
 */

// Export all database types (including generated ones)
export * from './database'

// Export all Supabase types
export * from './supabase'

// Export common utility types
export * from './common'

// Re-export generated types for direct access
export type { Database } from './generated/supabase'
