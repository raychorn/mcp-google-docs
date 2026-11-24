# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    ASKADS_TELEMETRY=0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN addgroup -S mcp \
    && adduser -S -G mcp mcp \
    && mkdir -p /home/mcp/.config/mcp-google-docs \
    && chown -R mcp:mcp /app /home/mcp
USER mcp
CMD ["node", "dist/index.js"]
