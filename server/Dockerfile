# Use the official Node.js 20 image as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port that NestJS runs on
EXPOSE 3001

# Define the command to run the app
CMD ["npm", "run", "start:prod"]
