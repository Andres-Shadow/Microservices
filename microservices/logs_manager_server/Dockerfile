FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci --only=production=false

COPY ./src ./src
RUN npm run build

# ── Runtime image ──────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 9091

CMD ["node", "dist/index.js"]
