# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the Next.js production build to the container
COPY .next ./.next


# Expose port 3000 to the host machine
EXPOSE 3000

# Start Nginx and serve the Next.js app
CMD npm run start
