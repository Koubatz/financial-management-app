# Stage 1: install dependencies and build the API
FROM node:20-alpine AS builder
RUN corepack enable && apk add --no-cache bash
WORKDIR /app

# Copy only the files needed for dependency resolution and build
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm --filter api run build

# Remove dev-only dependencies to slim down the runtime image
RUN pnpm prune --prod

# Stage 2: create the runtime image with compiled sources
FROM node:20-alpine AS runner
RUN corepack enable
WORKDIR /app

# Copy production node_modules and built artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
