# Stage 1: build workspace and compile the web app
FROM node:20-alpine AS builder
RUN corepack enable && apk add --no-cache bash
WORKDIR /app

# Copy workspace manifests first
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm --filter web run build

# Stage 2: serve static bundle via nginx
FROM nginx:1.27-alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
