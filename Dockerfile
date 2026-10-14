# ==============================================================================
# Stage 1: Build & Dependencies
# ==============================================================================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL (required by Prisma engines)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy dependency specifications and Prisma config
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma

# Install all dependencies (including devDependencies required by Prisma CLI)
RUN npm ci

# Copy the source code
COPY src ./src

# Generate Prisma Client (outputs to src/generated/prisma as defined in schema.prisma)
RUN npx prisma generate

# Prune development dependencies to keep production footprint minimal
RUN npm prune --omit=dev

# ==============================================================================
# Stage 2: Production Runner
# ==============================================================================
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# Install OpenSSL for Prisma query engine runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Copy built application and pruned production node_modules from builder
COPY --chown=node:node --from=builder /app ./

# Switch to non-root user provided by the official Node image for security
USER node

# Expose the application port
EXPOSE 4000

# Start the Node.js Express server
CMD ["node", "src/server.js"]
