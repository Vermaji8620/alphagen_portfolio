# Production Dockerfile for Single-Service Unified Deployment
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy application source files
COPY . .

# Build the frontend assets into dist/
RUN npm run build

# Default port (cloud providers like Render/Railway/Fly automatically override via $PORT)
ENV PORT=5000
EXPOSE 5000

# Start unified Express server serving both /api and the static React frontend
CMD ["npm", "start"]
