# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy application files
COPY . .

# Create reports directory
RUN mkdir -p /app/data

# Expose port (optional, for health checks)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run the bot
CMD ["node", "index.mjs"]
