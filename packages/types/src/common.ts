/**
 * @fileoverview Common utility types used across the application
 */

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Common status types
export type Status = 'idle' | 'loading' | 'success' | 'error'

// Form state types
export interface FormState<T = Record<string, unknown>> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
}

// Environment types
export type Environment = 'development' | 'staging' | 'production'

// Configuration types
export interface AppConfig {
  env: Environment
  supabase: {
    url: string
    anonKey: string
  }
  features: {
    auth: boolean
    storage: boolean
    realtime: boolean
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
}

// Utility types for better type safety
export type NonEmptyArray<T> = [T, ...T[]]
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Date and time types
export type DateString = string // ISO 8601 date string
export type TimestampString = string // ISO 8601 timestamp string

// Branded types for better type safety
export type UserId = string & { readonly __brand: 'UserId' }
export type Email = string & { readonly __brand: 'Email' }
export type Url = string & { readonly __brand: 'Url' }

// Type guards
export const isUserId = (value: string): value is UserId => {
  // UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

export const isEmail = (value: string): value is Email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export const isUrl = (value: string): value is Url => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
