# syntax=docker/dockerfile:1

# Base stage with pnpm enabled
FROM node:20-alpine AS base
RUN apk add --no-cache bash git openssh-client \
  && corepack enable
WORKDIR /app

# Workspace stage with source code
FROM base AS workspace
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps

# Install all workspace dependencies once for reuse
FROM workspace AS deps
ENV CI=true
RUN pnpm install --frozen-lockfile

# Build the API application
FROM deps AS api-builder
RUN pnpm --filter api build

# Prepare production-only dependencies for the API
FROM base AS api-prod-deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --prod --frozen-lockfile --filter api...

# Final API runtime image
FROM node:20-alpine AS api-runner
WORKDIR /app/apps/api
COPY --from=api-prod-deps /app/node_modules /app/node_modules
COPY --from=api-prod-deps /app/apps/api/node_modules ./node_modules
COPY --from=api-builder /app/apps/api/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]

# Build the web application
FROM deps AS web-builder
RUN pnpm --filter web run build

# Final web runtime image served by nginx
FROM nginx:1.27-alpine AS web-runner
COPY --from=web-builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=workspace /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
