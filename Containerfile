# syntax=docker/dockerfile:1

# See https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
# See https://depot.dev/docs/languages/node-pnpm-dockerfile
# See https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

#===============================================================================
# Development
#===============================================================================

# Set up the dev environment
FROM node:20 AS dev-setup
WORKDIR /app
# Avoid Git's "suspicious user" error when trying to install tools when building and running the
# image as non-root
RUN git config --global --add safe.directory /app
RUN corepack enable && yarn set version stable
COPY . .
RUN yarn install
# Install nano as text editor to be used with Git
RUN --mount=type=cache,target=/var/cache/apt apt-get update && apt-get install nano
# Install browsers and tools for running end-to-end test
RUN --mount=type=cache,target=/var/cache/apt yarn playwright install --with-deps
RUN yarn gulp installDev
EXPOSE 3000

#===============================================================================
# Production
#===============================================================================

# Use Alpine, a lighter weight OS
FROM node:20-alpine AS base-prod

ENV PROD_NODE_DIR=/home/node
ENV PROD_APP_DIR=$PROD_NODE_DIR/app

# Install dependencies
FROM base-prod AS deps-prod
# Install Yarn
RUN corepack enable && yarn set version stable
# Create directory for app and switch to it
WORKDIR $PROD_APP_DIR
# Copying these files before running `yarn install` allows us to take advantage
# of the caching mechanism
COPY package.json yarn.lock .yarnrc.yml ./
# Install production dependencies while using cache
RUN --mount=type=cache,target=$PROD_NODE_DIR/.yarn YARN_CACHE_FOLDER=$PROD_NODE_DIR/.yarn yarn workspaces focus --all --production

# Build the standalone
FROM base-prod AS build-prod
# Install Yarn
RUN corepack enable && yarn set version stable
# Create directory for app and switch to it
WORKDIR $PROD_APP_DIR
# Copy installed dependencies from "deps-prod" stage
COPY --from=deps-prod $PROD_APP_DIR/node_modules ./node_modules
### Copy files in a way to take advantage of caching
# Copy static assets
COPY public/ public/
# Copy configuration files
COPY .env .env.production* .swcrc gulpfile.* LICENSE.* next.config.* postcss.config.* tsconfig.json .
# Copy source files without the tests
COPY --exclude=**/*.test.* --exclude=**/testing/* --exclude=**/e2e/ src/ src/
# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./
# Build
RUN yarn build:standalone

# NOTE: The last stage is the stage used as the default
# Run standalone output
FROM base-prod AS prod
# Create directory with restricted file permissions
RUN mkdir -p $PROD_APP_DIR && chown -R node:node $PROD_APP_DIR
# Switch to new directory
WORKDIR $PROD_APP_DIR
# Switch user to ensure that all of the application files are owned by this
# non-root user
USER node
# Copy the built standalone app
COPY --from=build-prod --chown=node:node $PROD_APP_DIR/.next/standalone .
# Start server at localhost:3000
EXPOSE 3000
CMD ["node", "server.js"]
