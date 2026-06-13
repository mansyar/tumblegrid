# ──────────────────────────────────────────────────────────────────
#  STAGE 1 — Build the Vite app
# ──────────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

# Corepack ships with Node 24 — pin pnpm to the project version
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

WORKDIR /app

# Install dependencies (cached layer unless lockfile changes)
# Note: pnpm-workspace.yaml is needed to approve @biomejs/biome build scripts
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN HUSKY=0 pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ──────────────────────────────────────────────────────────────────
#  STAGE 2 — Serve static files via Nginx
# ──────────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy our SPA-aware config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
