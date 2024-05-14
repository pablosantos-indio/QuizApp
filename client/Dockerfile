# Use the official Node.js 16 image as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies including React scripts
RUN npm install

# Install the project dependencies
# RUN npm install --legacy-peer-deps

# Bundle the app source inside the Docker image
COPY . .

# Expose the port that React runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
