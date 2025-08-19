/**
 * @fileoverview Supabase-specific types and interfaces
 *
 * This file contains types for Supabase client integration,
 * authentication, and storage functionality.
 */

import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./generated/supabase";

// Re-export commonly used Supabase types
export type { Session, User } from "@supabase/supabase-js";

// Typed Supabase client
export type TypedSupabaseClient = SupabaseClient<Database>;

// Storage types
export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
  };
}

export interface StorageError {
  message: string;
  statusCode?: string;
}

// File upload configuration
export interface FileUploadOptions {
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
}

// File organization types
export type FileCategory = "general" | "documents" | "images" | "data" | "temp";

export interface OrganizedFilePath {
  userId: string;
  category: FileCategory;
  fileName: string;
  fullPath: string;
}

// Auth helper types
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface AuthError {
  message: string;
  status?: number;
}
