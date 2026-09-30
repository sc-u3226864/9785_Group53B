# syntax=docker/dockerfile:1
#
# Production image for the Next.js app. Used by docker-compose.prod.yml.
# Local development does NOT use this file (see docs/01-local-setup.md).
#
# Stages:
#   base      -> shared Node image
#   deps      -> all node_modules (incl. dev deps: prisma CLI, tsx, typescript)
#   builder   -> generates the Prisma client and runs `next build`
#   prod-deps -> node_modules without dev dependencies
#   migrator  -> one-shot container that runs `prisma migrate deploy` (and can run the seed)
#   runner    -> small final image that serves the app as a non-root user

FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json ./
# `npm ci` runs the `postinstall` script (prisma generate), which needs the schema and config.
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ---------- prod-deps ----------
FROM base AS prod-deps
COPY package.json package-lock.json ./
# --ignore-scripts: skip `postinstall` (prisma CLI is a dev dependency and isn't installed here).
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# ---------- migrator ----------
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
USER node
CMD ["npx", "prisma", "migrate", "deploy"]

# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json /app/next.config.ts ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.status < 500 ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "node_modules/next/dist/bin/next", "start"]
