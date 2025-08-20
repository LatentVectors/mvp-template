import { describe, expect, it } from 'vitest'
import {
  buildUserFilePath,
  type StoragePort,
  type StorageUploadInput,
} from './port'

describe('StoragePort interface and helpers', () => {
  it('buildUserFilePath returns organized path', () => {
    const userId = '00000000-0000-0000-0000-000000000000'
    const path = buildUserFilePath(userId, 'avatar.png', 'images')
    expect(path).toBe(`${userId}/images/avatar.png`)
  })

  it('type shape covers basic operations', () => {
    const noop: StoragePort = {
      async upload(_input: StorageUploadInput) {
        return { path: 'p' }
      },
      async getUrl() {
        return { url: 'https://example.com' }
      },
      async remove() {
        return { success: true }
      },
    }

    expect(noop).toBeDefined()
  })
})


