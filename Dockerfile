# ─── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY tsconfig.json ./
COPY src ./src/

# Build TypeScript
RUN npm run build

# ─── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup -S phonex && adduser -S phonex -G phonex

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --omit=dev

# Generate Prisma client in production stage
RUN npx prisma generate

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Copy SSL certificate for Aiven PostgreSQL
COPY ca.pem ./ca.pem

# Set ownership
RUN chown -R phonex:phonex /app

# Switch to non-root
USER phonex

# Cloud Run uses PORT env var
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Run migrations then start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]