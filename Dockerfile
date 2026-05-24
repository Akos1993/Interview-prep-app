# Use the lightweight Node.js 20 Alpine image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions and configuration files
COPY package*.json tsconfig.json vite.config.ts server.ts index.html ./

# Install development dependencies to compile the application
RUN npm ci

# Copy application source code
COPY src/ ./src/

# Build both frontend and backend for production configuration
RUN npm run build

# --- RUNTIME STAGE ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary production assets and servers
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Expose port 3000 for incoming Azure load balancers / VM traffic
EXPOSE 3000

# Run the compiled commonJS production server
CMD ["npm", "run", "start"]
