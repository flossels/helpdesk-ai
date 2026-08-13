# syntax=docker/dockerfile:1

# ── Stage 1: install dependencies ──
FROM node:24-alpine AS deps
RUN corepack enable
WORKDIR /app

# pnpm-workspace.yaml carries the allowBuilds list, so the approved build
# scripts (@sentry/cli, esbuild) run during install. corepack reads the
# pnpm version from package.json's packageManager field.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

# ── Stage 2: build the application ──
FROM node:24-alpine AS builder
RUN corepack enable
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# The build reads the database twice: prisma.config.ts resolves
# datasource.url from DIRECT_URL, and generateStaticParams asks for every
# published article slug. A secret mount keeps the connection string out
# of every layer, unlike ARG or ENV.
RUN --mount=type=secret,id=database_url \
    DATABASE_URL="$(cat /run/secrets/database_url)" \
    DIRECT_URL="$(cat /run/secrets/database_url)" \
    pnpm prisma generate

# NEXT_PUBLIC_ values are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_MIXPANEL_TOKEN
ARG DEPLOYMENT_ID
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_MIXPANEL_TOKEN=$NEXT_PUBLIC_MIXPANEL_TOKEN
ENV DEPLOYMENT_ID=$DEPLOYMENT_ID
ENV NEXT_TELEMETRY_DISABLED=1

# SENTRY_AUTH_TOKEN comes in as a BuildKit secret so it never lands in an
# image layer. withSentryConfig uploads source maps when it is present.
RUN --mount=type=secret,id=sentry_auth_token \
    --mount=type=secret,id=database_url \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    DATABASE_URL="$(cat /run/secrets/database_url)" \
    DIRECT_URL="$(cat /run/secrets/database_url)" \
    pnpm build

# ── Stage 3: production runner ──
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# The standalone output does not bundle .next/static, so it is copied
# separately. A project with a public/ directory copies that too.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# The migrations, for a runner that ever needs to inspect them.
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider \
    http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]