/**
 * @fileoverview Storage Bucket Operations Tests
 *
 * Tests to verify storage bucket operations work correctly with proper
 * access controls and file management.
 */

import { createClient } from '@/lib/supabase/client'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Storage Bucket Operations', () => {
  let serviceClient: ReturnType<typeof createServiceRoleClient>
  let userClient: ReturnType<typeof createClient>
  let testUserId: string
  let otherUserId: string

  beforeAll(async () => {
    serviceClient = createServiceRoleClient()
    userClient = createClient()

    // Clean up any existing test users first
    const existingUsers = await serviceClient.auth.admin.listUsers()
    if (existingUsers.data?.users) {
      for (const user of existingUsers.data.users) {
        if (
          user.email === 'storage-test-1@example.com' ||
          user.email === 'storage-test-2@example.com'
        ) {
          await serviceClient.auth.admin.deleteUser(user.id)
        }
      }
    }

    // Create test users using service client
    const { data: user1, error: error1 } =
      await serviceClient.auth.admin.createUser({
        email: 'storage-test-1@example.com',
        password: 'test-password-123',
        email_confirm: true,
      })

    const { data: user2, error: error2 } =
      await serviceClient.auth.admin.createUser({
        email: 'storage-test-2@example.com',
        password: 'test-password-123',
        email_confirm: true,
      })

    if (error1 || error2 || !user1?.user || !user2?.user) {
      console.error('User creation errors:', { error1, error2 })
      console.error('User data:', { user1, user2 })
      throw new Error(
        `Failed to create test users: ${
          error1?.message || error2?.message || 'Unknown error'
        }`
      )
    }

    testUserId = user1.user.id
    otherUserId = user2.user.id

    // Create corresponding profiles
    await serviceClient.from('profiles').insert([
      { id: testUserId, email: 'storage-test-1@example.com' },
      { id: otherUserId, email: 'storage-test-2@example.com' },
    ])
  })

  afterAll(async () => {
    // Cleanup test data
    if (testUserId && otherUserId) {
      // Clean up any test files first
      await serviceClient.storage
        .from('user-files')
        .remove([`${testUserId}/test/`, `${otherUserId}/test/`])

      await serviceClient.auth.admin.deleteUser(testUserId)
      await serviceClient.auth.admin.deleteUser(otherUserId)
    }
  })

  beforeEach(async () => {
    // Sign in as test user
    await userClient.auth.signInWithPassword({
      email: 'storage-test-1@example.com',
      password: 'test-password-123',
    })
  })

  describe('Bucket Configuration', () => {
    it('should have user-files bucket configured correctly', async () => {
      const { data: buckets, error } = await serviceClient.storage.listBuckets()

      expect(error).toBeNull()
      expect(buckets).toBeDefined()

      const userFilesBucket = buckets?.find(
        bucket => bucket.name === 'user-files'
      )

      expect(userFilesBucket).toBeDefined()
      expect(userFilesBucket?.public).toBe(false)
      expect(userFilesBucket?.file_size_limit).toBe(52428800) // 50MB
      expect(userFilesBucket?.allowed_mime_types).toContain('image/jpeg')
      expect(userFilesBucket?.allowed_mime_types).toContain('application/pdf')
    })
  })

  describe('File Upload Operations', () => {
    it('should allow users to upload files to their own directory', async () => {
      const fileName = 'test-image.jpg'
      const filePath = `${testUserId}/profile/${fileName}`
      const fileContent = new Blob(['fake image content'], {
        type: 'image/jpeg',
      })

      const { data, error } = await userClient.storage
        .from('user-files')
        .upload(filePath, fileContent)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.path).toBe(filePath)

      // Cleanup
      await userClient.storage.from('user-files').remove([filePath])
    })

    it("should prevent users from uploading to other users' directories", async () => {
      const fileName = 'malicious-upload.jpg'
      const filePath = `${otherUserId}/profile/${fileName}`
      const fileContent = new Blob(['fake content'], { type: 'image/jpeg' })

      const { data, error } = await userClient.storage
        .from('user-files')
        .upload(filePath, fileContent)

      expect(data).toBeNull()
      expect(error).toBeDefined()
      // Should fail due to RLS policy
    })

    it('should enforce file size limits', async () => {
      const fileName = 'large-file.jpg'
      const filePath = `${testUserId}/test/${fileName}`
      // Create a file larger than 50MB limit
      const largeContent = new Blob([new ArrayBuffer(52428801)], {
        type: 'image/jpeg',
      })

      const { data, error } = await serviceClient.storage
        .from('user-files')
        .upload(filePath, largeContent)

      expect(data).toBeNull()
      expect(error).toBeDefined()
      expect(error?.message).toContain('file size')
    })

    it('should enforce allowed MIME types', async () => {
      const fileName = 'test-executable.exe'
      const filePath = `${testUserId}/test/${fileName}`
      const fileContent = new Blob(['fake executable'], {
        type: 'application/octet-stream',
      })

      const { data, error } = await serviceClient.storage
        .from('user-files')
        .upload(filePath, fileContent)

      expect(data).toBeNull()
      expect(error).toBeDefined()
      expect(error?.message).toContain('mime type')
    })
  })

  describe('File Download Operations', () => {
    let testFilePath: string

    beforeAll(async () => {
      // Upload a test file for download tests
      testFilePath = `${testUserId}/test/download-test.txt`
      const fileContent = new Blob(['test file content'], {
        type: 'text/plain',
      })

      await serviceClient.storage
        .from('user-files')
        .upload(testFilePath, fileContent)
    })

    afterAll(async () => {
      // Cleanup test file
      await serviceClient.storage.from('user-files').remove([testFilePath])
    })

    it('should allow users to download their own files', async () => {
      const { data, error } = await userClient.storage
        .from('user-files')
        .download(testFilePath)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data).toBeInstanceOf(Blob)
    })

    it("should prevent users from downloading other users' files", async () => {
      const otherUserFilePath = `${otherUserId}/test/private-file.txt`

      // First upload a file as the other user (using service client)
      await serviceClient.storage
        .from('user-files')
        .upload(
          otherUserFilePath,
          new Blob(['private content'], { type: 'text/plain' })
        )

      // Try to download as current user
      const { data, error } = await userClient.storage
        .from('user-files')
        .download(otherUserFilePath)

      expect(data).toBeNull()
      expect(error).toBeDefined()

      // Cleanup
      await serviceClient.storage.from('user-files').remove([otherUserFilePath])
    })

    it('should create signed URLs for authenticated access', async () => {
      const { data, error } = await userClient.storage
        .from('user-files')
        .createSignedUrl(testFilePath, 3600) // 1 hour

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.signedUrl).toContain('http')
      expect(data?.signedUrl).toContain(testFilePath)
    })
  })

  describe('File Management Operations', () => {
    it('should allow users to list their own files', async () => {
      // Upload some test files
      const testFiles = [
        `${testUserId}/documents/file1.pdf`,
        `${testUserId}/documents/file2.txt`,
        `${testUserId}/images/photo.jpg`,
      ]

      for (const filePath of testFiles) {
        await serviceClient.storage
          .from('user-files')
          .upload(filePath, new Blob(['content'], { type: 'text/plain' }))
      }

      // List files in user's directory
      const { data, error } = await userClient.storage
        .from('user-files')
        .list(`${testUserId}/documents`)

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      expect(data?.length).toBeGreaterThan(0)

      // Cleanup
      await serviceClient.storage.from('user-files').remove(testFiles)
    })

    it("should prevent users from listing other users' files", async () => {
      const { data, error } = await userClient.storage
        .from('user-files')
        .list(`${otherUserId}/documents`)

      // Should either return empty or error due to RLS
      expect(error !== null || data?.length === 0).toBe(true)
    })

    it('should allow users to delete their own files', async () => {
      const testFilePath = `${testUserId}/temp/delete-test.txt`

      // Upload file
      await serviceClient.storage
        .from('user-files')
        .upload(testFilePath, new Blob(['delete me'], { type: 'text/plain' }))

      // Delete file as user
      const { data, error } = await userClient.storage
        .from('user-files')
        .remove([testFilePath])

      expect(error).toBeNull()
      expect(data).toBeDefined()

      // Verify file is deleted
      const { data: downloadData, error: downloadError } =
        await userClient.storage.from('user-files').download(testFilePath)

      expect(downloadData).toBeNull()
      expect(downloadError).toBeDefined()
    })

    it("should prevent users from deleting other users' files", async () => {
      const otherUserFilePath = `${otherUserId}/important/important-file.txt`

      // Upload file as other user
      await serviceClient.storage
        .from('user-files')
        .upload(
          otherUserFilePath,
          new Blob(['important data'], { type: 'text/plain' })
        )

      // Try to delete as current user
      const { error } = await userClient.storage
        .from('user-files')
        .remove([otherUserFilePath])

      expect(error).toBeDefined()

      // Verify file still exists
      const { data: downloadData, error: downloadError } =
        await serviceClient.storage
          .from('user-files')
          .download(otherUserFilePath)

      expect(downloadError).toBeNull()
      expect(downloadData).toBeDefined()

      // Cleanup
      await serviceClient.storage.from('user-files').remove([otherUserFilePath])
    })
  })

  describe('Storage Helper Functions', () => {
    it('should generate correct user file paths', async () => {
      const userId = testUserId
      const fileName = 'test-document.pdf'
      const category = 'documents'

      const { data: path, error } = await serviceClient.rpc(
        'get_user_file_path',
        {
          user_id: userId,
          file_name: fileName,
          file_category: category,
        }
      )

      expect(error).toBeNull()
      expect(path).toBe(`${userId}/${category}/${fileName}`)
    })

    it('should validate file paths belong to correct user', async () => {
      const userId = testUserId
      const validPath = `${userId}/documents/my-file.pdf`
      const invalidPath = `${otherUserId}/documents/their-file.pdf`

      // Test valid path
      const { data: validResult, error: validError } = await serviceClient.rpc(
        'validate_user_file_path',
        {
          file_path: validPath,
          user_id: userId,
        }
      )

      expect(validError).toBeNull()
      expect(validResult).toBe(true)

      // Test invalid path
      const { data: invalidResult, error: invalidError } =
        await serviceClient.rpc('validate_user_file_path', {
          file_path: invalidPath,
          user_id: userId,
        })

      expect(invalidError).toBeNull()
      expect(invalidResult).toBe(false)
    })
  })

  describe('Unauthenticated Access', () => {
    it('should prevent unauthenticated storage access', async () => {
      const anonClient = createClient()

      const testFilePath = `${testUserId}/test/anon-test.txt`
      const fileContent = new Blob(['test'], { type: 'text/plain' })

      // Try to upload without authentication
      const { data, error } = await anonClient.storage
        .from('user-files')
        .upload(testFilePath, fileContent)

      expect(data).toBeNull()
      expect(error).toBeDefined()
    })

    it('should prevent unauthenticated file listing', async () => {
      const anonClient = createClient()

      const { error } = await anonClient.storage.from('user-files').list('')

      expect(error).toBeDefined()
    })
  })

  describe('Service Role Access', () => {
    it('should allow service role to manage all files', async () => {
      const testFilePath = `${testUserId}/admin/service-managed.txt`
      const fileContent = new Blob(['service content'], { type: 'text/plain' })

      // Upload with service role
      const { data: uploadData, error: uploadError } =
        await serviceClient.storage
          .from('user-files')
          .upload(testFilePath, fileContent)

      expect(uploadError).toBeNull()
      expect(uploadData).toBeDefined()

      // Download with service role
      const { data: downloadData, error: downloadError } =
        await serviceClient.storage.from('user-files').download(testFilePath)

      expect(downloadError).toBeNull()
      expect(downloadData).toBeDefined()

      // Delete with service role
      const { data: deleteData, error: deleteError } =
        await serviceClient.storage.from('user-files').remove([testFilePath])

      expect(deleteError).toBeNull()
      expect(deleteData).toBeDefined()
    })
  })
})
