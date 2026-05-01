# Dockerfile — Backend NestJS

# --- Build stage ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/torneos_deportivos?schema=public"

RUN npx prisma generate
RUN npm run build

# --- Production stage ---
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

COPY prisma ./prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]