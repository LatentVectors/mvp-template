export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now()
  const unique = (globalThis.crypto?.randomUUID?.() ?? `${Math.random()}`)
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 16)
  return `${prefix}-${timestamp}-${unique}@example.com`
}
