# @repo/types

Shared TypeScript types for the MVP template monorepo.

## Overview

This package provides a centralized location for all shared types used across the monorepo, including:

- **Auto-generated Supabase database types** - Generated from your database schema
- **Common utility types** - Shared interfaces and types used across apps
- **Database helper types** - Convenience types and complex query interfaces

## Structure

```
src/
├── index.ts              # Main entry point - exports everything
├── generated/
│   └── supabase.ts      # Auto-generated from Supabase CLI (never edit)
├── common.ts             # Common utility types
└── helpers.ts            # Database helper types and utilities
```

## Usage

### Basic Import

```typescript
import type { Database, Profile, User } from '@repo/types'
```

### Database Types

```typescript
import type { Database } from '@repo/types'

// Use the generated types directly
type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
```

### Helper Types

```typescript
import type { Profile, ProfileWithSubscription } from '@repo/types'

// Use convenience types
const profile: Profile = {
  /* ... */
}
const profileWithSub: ProfileWithSubscription = {
  /* ... */
}
```

### Supabase Client

```typescript
import type { TypedSupabaseClient } from '@repo/types'
import { createClient } from '@supabase/supabase-js'

const supabase: TypedSupabaseClient = createClient(url, key)
```

## Development

### Regenerating Types

When you make database schema changes:

1. Start your local Supabase instance: `npm run db:start`
2. Run the type generation: `npm run typegen:supabase`

This will:

- Generate new types from your current database schema
- Update the types package exports
- Build the package with the new types

### Adding New Types

- **Generated types**: Never edit `src/generated/supabase.ts` - it's auto-generated
- **Helper types**: Add to `src/helpers.ts` for database-related utilities
- **Common types**: Add to `src/common.ts` for general-purpose types
- **Supabase types**: Add to `src/supabase.ts` for Supabase-specific functionality

## Best Practices

1. **Import from the main package**: `import type { ... } from '@repo/types'`
2. **Use generated types directly**: Access the `Database` type for full type safety
3. **Extend, don't modify**: Create new types that extend generated ones
4. **Keep it simple**: Avoid complex re-export chains

## Migration from Old Structure

The old structure had redundant re-exports and multiple entry points. The new structure:

- ✅ Single source of truth for generated types
- ✅ Clear separation of concerns
- ✅ No duplicate exports
- ✅ Simpler import paths
- ✅ Easier maintenance

## Troubleshooting

### Build Errors

If you get build errors after regenerating types:

1. Clean the dist folder: `npm run clean`
2. Rebuild: `npm run build`

### Type Conflicts

If you see duplicate export errors:

1. Check that you're not re-exporting types that already exist in generated files
2. Use explicit imports instead of wildcard exports when needed

### Missing Types

If types aren't available:

1. Regenerate types: `npm run typegen:supabase`
2. Check that the types package is built: `npm run build`
3. Verify your database schema changes are reflected in the generated types
