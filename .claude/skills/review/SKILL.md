---
description: Review the staged diff against project conventions
disable-model-invocation: true
allowed-tools: Bash(git diff --staged), Bash(pnpm lint)
---

Review the staged changes for this Next.js 16 project. Flag:
- any 'use client' on a data-fetching component, or a server-only import
  in a Client Component
- params/searchParams/cookies()/headers() not awaited
- a stale caching call (getServerSideProps, fetch revalidate) in place of
  'use cache'
- a Server Action missing 'use server', Zod, the auth + scope check, or
  ActionResult
- a query not scoped by organizationId

Report issues by severity. Do not fix anything unless asked.
