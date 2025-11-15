# Use Node.js Alpine Linux image (lightweight version)
# Alpine 22 provides a minimal footprint while maintaining compatibility
FROM node:22-alpine

# Set the working directory inside the container
# All subsequent commands will be executed in this directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# This is done separately to leverage Docker's layer caching
# Dependencies will only reinstall if these files change
COPY package*.json ./

# Install production dependencies
# Using npm ci for cleaner, faster, and more reliable installs in CI/CD
# Alternative: Use 'npm install' for development flexibility
RUN npm install

# Copy the rest of the application source code
# This includes all application files and directories
# Done after npm install to optimize build cache
COPY . .

# Expose port 4000 to allow external access
# This is a documentation feature and doesn't actually publish the port
# The port must still be mapped when running the container
EXPOSE 4000

# Define the command to run the application
# This starts the Node.js application using the start script from package.json
CMD ["npm", "start"]