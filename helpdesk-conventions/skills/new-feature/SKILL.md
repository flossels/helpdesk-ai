---
description: Scaffold a new feature slice following project conventions
disable-model-invocation: true
allowed-tools: Bash(pnpm lint), Bash(pnpm knip)
---

Create a new feature slice for "$ARGUMENTS" under src/features/<name>/,
following the pattern in src/features/tickets/.

## Steps
1. Create queries/ (cache()-wrapped, org-scoped, select fields), actions/
   ('use server', Zod, auth + scope, ActionResult), and components/.
2. Put the Zod schema and its inferred input type in
   src/shared/types/<name>.ts, so a Client Component can import the type.
3. Server Components by default; 'use client' only where needed.
4. Run pnpm lint and pnpm knip.
