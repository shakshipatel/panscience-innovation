# -----------------------------
# Stage 1: Builder
# -----------------------------
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy rest of the app
COPY . .

# Build (optional - only if your app requires build step)
# For example: bun run build
# RUN bun run build


# -----------------------------
# Stage 2: Runner
# -----------------------------
FROM oven/bun:1 AS runner

# Set working directory
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app /app

# Expose port (change if needed)
EXPOSE 3000

# Default command (change to your entrypoint)
# Example: if your app starts with `bun run start`
CMD ["bun", "run", "dev"]
