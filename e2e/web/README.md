# E2E for Web

Run Supabase locally first and ensure seed users exist:

```bash
npm run db:restart && npm run db:seed
```

Then run tests:

```bash
cd e2e/web && npx playwright install --with-deps && npm test
```

Credentials used: `alice@example.com` / `password123`.
