# @repo/types

Shared TypeScript types for the MVP template monorepo.

## Overview

This package provides type-safe interfaces for:

- **Database schema types** (auto-generated from Supabase)
- **Supabase client types**
- **Common utility types**
- **API response types**

## Usage

```typescript
import type { Database, Profile, Subscription, UsageCounter } from '@repo/types'

// Use the types in your code
const user: Profile = {
  id: 'user-id',
  email: 'user@example.com',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
}
```

## Development Workflow

### ⚠️ Important: Generated Types

The database types are **automatically generated** from your Supabase schema and should **never be
edited manually**.

### Setup for New Developers

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start Supabase locally**: `npm run db:start`
4. **Generate types**: `npm run typegen:supabase`
5. **Build types package**: `cd packages/types && npm run build`

### When Database Schema Changes

After updating migration files:

```bash
# Apply migrations
npm run db:reset

# Regenerate types
npm run typegen:supabase
```

### Generated Files

These files are **automatically generated** and excluded from git:

- `src/generated/supabase.ts` - Database schema types
- `dist/` - Compiled JavaScript output

### CI/CD Pipeline

Your CI/CD should:

1. Start Supabase services
2. Run `npm run typegen:supabase`
3. Build the types package
4. Build/deploy applications

## File Structure

```
packages/types/
├── src/
│   ├── generated/          # Auto-generated (gitignored)
│   │   └── supabase.ts     # Generated database types
│   ├── common.ts           # Utility types
│   ├── database.ts         # Database helpers (imports generated)
│   ├── supabase.ts         # Supabase client types
│   └── index.ts            # Main exports
├── dist/                   # Compiled output (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Type Safety

This package ensures type safety across the entire monorepo by:

- **Generating exact types** from database schema
- **Providing branded types** for better type safety
- **Exporting utility types** for common patterns
- **Maintaining consistency** across all applications

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run clean` - Remove compiled output
- `npm run type-check` - Type checking without compilation

## Adding New Types

### For Database Changes

1. Create migration files in `supabase/migrations/`
2. Apply migrations: `npm run db:reset`
3. Regenerate types: `npm run typegen:supabase`

### For Application Types

Add them to the appropriate file:

- `common.ts` - Shared utility types
- `supabase.ts` - Supabase-specific types
- Create new files as needed and export from `index.ts`

## Best Practices

### ✅ Do

- Use generated types for all database operations
- Create helper types that extend generated types
- Use branded types for IDs and sensitive data
- Document complex type utilities

### ❌ Don't

- Edit generated files manually
- Commit generated files to git
- Create duplicate types for database objects
- Use `any` or loose typing

## Troubleshooting

### "Cannot find module './generated/supabase'"

Run the type generation:

```bash
npm run typegen:supabase
```

### "Supabase CLI not found"

Install Supabase CLI:

```bash
npm install -g supabase
```

### Build Errors After Schema Changes

1. Reset database: `npm run db:reset`
2. Regenerate types: `npm run typegen:supabase`
3. Rebuild package: `npm run build`
