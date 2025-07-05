# Use the official Node.js 20 runtime as base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory to the nodejs user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["pnpm", "start"]
