/**
 * @fileoverview Database helper types and utilities
 *
 * This file contains helper types and utilities for working with the database,
 * including convenience type aliases and complex query types.
 */

import type { Database } from "./generated/supabase";

// Convenient type aliases for our tables
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type UsageCounter =
  Database["public"]["Tables"]["usage_counters"]["Row"];

// Insert types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
export type UsageCounterInsert =
  Database["public"]["Tables"]["usage_counters"]["Insert"];

// Update types
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type SubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];
export type UsageCounterUpdate =
  Database["public"]["Tables"]["usage_counters"]["Update"];

// Extract enums from the generated types
export type SubscriptionStatus =
  Database["public"]["Tables"]["subscriptions"]["Row"]["status"];
export type SubscriptionPlan =
  Database["public"]["Tables"]["subscriptions"]["Row"]["plan"];

// Helper types for complex queries (these are safe to define manually)
export interface ProfileWithSubscription extends Profile {
  subscription?: Subscription;
}

export interface SubscriptionWithUsage extends Subscription {
  usage_counters?: UsageCounter[];
}

// Utility function types
export type Functions<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T];

// Storage helper types
export interface FileUploadResult {
  path: string;
  fullPath: string;
  id: string;
}
