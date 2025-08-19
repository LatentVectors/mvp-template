/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      env: {
        NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY,
        SUPABASE_DB_URL: env.SUPABASE_DB_URL,
        NODE_ENV: 'test' as const,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '.contentlayer/generated': path.resolve(
          __dirname,
          'tests/fixtures/contentlayer-generated.ts'
        ),
      },
    },
  }
})
