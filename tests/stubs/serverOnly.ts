// Empty stand-in for the `server-only` package in tests. The real
// package throws when imported outside a Server Component build; in
// jsdom we want the importing module to load normally.
export {}
