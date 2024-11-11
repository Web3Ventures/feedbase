# Base node image
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install turbo --global
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN apk add --no-cache libc6-compat
RUN apk update

# Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=web --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Debug: List contents before build
RUN ls -la apps/web/

# Build the project and ensure standalone output
RUN cd apps/web && NEXT_TELEMETRY_DISABLED=1 pnpm build
RUN ls -la apps/web/.next/

# Runner stage
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

# Copy standalone directory
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
# Copy static files
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# Copy public files
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Set environment variables
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Update the CMD to use the standalone server
CMD ["node", "server.js"]