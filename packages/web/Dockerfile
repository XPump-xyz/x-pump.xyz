# Base image for dependencies and building
FROM node:18-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache git \
    && pnpm i --frozen-lockfile \
    && pnpm store prune

# Build the application
COPY . .
RUN pnpm build

# Prune development dependencies
RUN pnpm prune --prod

# Install node-prune
RUN apk add --no-cache curl \
    && curl -sf https://gobinaries.com/tj/node-prune | sh -s -- -b /usr/local/bin \
    && node-prune /app \
    && apk del curl

# Production image
FROM node:18-alpine
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "server.js"]