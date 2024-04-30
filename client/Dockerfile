# Use the official Node.js 14 image as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies including React scripts
RUN npm install

# Bundle the app source inside the Docker image
COPY . .

# Expose the port that React runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
