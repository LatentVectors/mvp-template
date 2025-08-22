import { describe, expect, it } from 'vitest'
import { buildUserFilePath } from './port'

describe('StoragePort interface and helpers', () => {
  it('buildUserFilePath returns organized path', () => {
    const userId = '00000000-0000-0000-0000-000000000000'
    const path = buildUserFilePath(userId, 'avatar.png', 'images')
    expect(path).toBe(`${userId}/images/avatar.png`)
  })
})


