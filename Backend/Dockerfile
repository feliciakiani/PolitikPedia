# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:14-slim

# Create and change to the app directory.
WORKDIR /home/c003bsy3376/PolitikPedia/Backend

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --ignore-scripts
RUN npm install bcrypt
RUN npm install dotenv

# Copy local code to the container image.
COPY . ./

# EXPOSE port
EXPOSE 8080

# Run the web service on container startup.
CMD [ "npm", "start" ]