# ─────────────────────────────────────────────
#  Stage 1: Dependency Installation
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package manifests
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# ─────────────────────────────────────────────
#  Stage 2: Builder (for TypeScript / bundled apps)
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY . .

# Build the application (e.g. Next.js, tsc, vite, etc.)
RUN npm run build

# ─────────────────────────────────────────────
#  Stage 3: Runtime
# ─────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production node_modules and build output
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=builder /app/dist       ./dist
COPY --from=builder /app/package.json .

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
