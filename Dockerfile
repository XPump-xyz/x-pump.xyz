# Base stage for shared setup
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/app

# Dependencies stage
FROM base AS build
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/api/package.json ./packages/api/
COPY packages/web/package.json ./packages/web/
RUN apk add --no-cache python3 make g++
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
COPY . .
RUN pnpm --filter ./packages/web/ build
RUN pnpm --filter ./packages/api/ build


# Production stage
FROM base AS production
COPY --from=build /usr/app/package.json /usr/app/pnpm-lock.yaml* /usr/app/pnpm-workspace.yaml* ./
COPY --from=build /usr/app/packages/api/package.json ./packages/api/
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/packages/api/node_modules ./packages/api/node_modules
COPY --from=build /usr/app/packages/api/dist ./packages/api/dist
COPY --from=build /usr/app/packages/web/out ./packages/api/dist/static



EXPOSE 5000

ENTRYPOINT ["node", "/usr/app/packages/api/dist/main.js"]