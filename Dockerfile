FROM node:20-slim AS base

WORKDIR /app

# Copy compiled output and production manifest from the dist repo
COPY dist/ dist/
COPY package.json .

# Install production dependencies only
RUN npm install --omit=dev --ignore-scripts

ENTRYPOINT ["node", "dist/index.js"]
