# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
# These are passed at build time and baked into the build
ARG VITE_API_BASE_URL=http://localhost:3000/api/v1
ARG VITE_APP_NAME=Ecommerce Store
ARG VITE_APP_VERSION=1.0.0
ARG VITE_ENABLE_FEATURES=all
ARG VITE_DEFAULT_CURRENCY=USD
ARG VITE_DEFAULT_LANGUAGE=en
ARG VITE_BUILD_MODE=production

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_ENABLE_FEATURES=$VITE_ENABLE_FEATURES
ENV VITE_DEFAULT_CURRENCY=$VITE_DEFAULT_CURRENCY
ENV VITE_DEFAULT_LANGUAGE=$VITE_DEFAULT_LANGUAGE
ENV VITE_BUILD_MODE=$VITE_BUILD_MODE

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY .nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
