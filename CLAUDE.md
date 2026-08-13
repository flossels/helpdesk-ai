@AGENTS.md

## Next.js conventions (this is Next.js 16, not the older Next.js)

- Components are Server Components by default. Add 'use client' only for
  interactivity or hooks. Never import `db` or a `server-only` module into
  a Client Component.
- `params`, `searchParams`, `cookies()`, and `headers()` are async. Always
  await them.
- Caching is Cache Components: mark cacheable reads with 'use cache' plus
  cacheLife/cacheTag, invalidate with revalidateTag. Do not use
  getServerSideProps or fetch(url, { next: { revalidate } }); that is the
  old model.
- Metadata comes from the `metadata` export or generateMetadata, never
  next/head. Navigation is next/navigation, never next/router.
- A page reads no request data in its body. Pass `params` and `searchParams`
  down and await them inside a `<Suspense>` boundary.

## Server Actions

- Every mutation is a Server Action: 'use server', Zod validation, auth +
  scope check (getCurrentUser + hasScope), ActionResult<T>. Prefer a Server
  Action over a route.ts + client fetch.

## Data and tenancy

- Every query is scoped by `organizationId`. There are no exceptions.
- Queries live in `queries/`, wrapped in `cache()`, and `select` fields
  rather than returning whole entities.
- A feature slice is `src/features/<name>/` with schemas, queries, actions
  and components. Every import names the file it means: import
  `@/features/tickets/queries/getTickets`, never a slice root.

## Commands

- `pnpm validate` runs tsc, eslint (zero warnings), prettier, knip and the
  unit tests. Run it before saying a change is done.
- `pnpm test:e2e` runs the end-to-end suite.
- Never run `prisma migrate reset` or `prisma db push`.
