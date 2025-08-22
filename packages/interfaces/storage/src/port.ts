export type StorageBucket = 'user-files'

export type StorageUploadInput = {
  bucket: StorageBucket
  path: string
  blob: Blob | ArrayBuffer | Uint8Array
  contentType?: string
  upsert?: boolean
}

export type StorageGetUrlInput = {
  bucket: StorageBucket
  path: string
  expiresInSeconds?: number
}

export type StorageRemoveInput = {
  bucket: StorageBucket
  paths: string[]
}

export type StorageUploadResult = {
  path: string
}

export type StorageGetUrlResult = {
  url: string
}

export enum StorageProvider {
  Supabase = 'supabase',
}

export interface StoragePort {
  upload(input: StorageUploadInput): Promise<StorageUploadResult>
  getUrl(input: StorageGetUrlInput): Promise<StorageGetUrlResult>
  remove(input: StorageRemoveInput): Promise<{ success: boolean }>
}

export function buildUserFilePath(
  userId: string,
  fileName: string,
  category: string = 'general'
): string {
  return `${userId}/${category}/${fileName}`
}


