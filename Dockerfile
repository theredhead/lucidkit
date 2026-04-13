# ── Stage 1: Build ───────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json ./
COPY packages/foundation/package.json packages/foundation/
COPY packages/ui-kit/package.json     packages/ui-kit/
COPY packages/ui-blocks/package.json  packages/ui-blocks/
COPY packages/ui-theme/package.json   packages/ui-theme/
COPY packages/ui-forms/package.json   packages/ui-forms/
RUN npm ci

# Copy source
COPY . .

# Build Storybook → dist/storybook
RUN npm run build-storybook

# Build TypeDoc → dev-docs
RUN npm run docs

# ── Stage 2: Serve ───────────────────────────────────────────────
FROM nginx:stable-alpine

# Remove default site config
RUN rm /etc/nginx/conf.d/default.conf

# Add our config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artefacts
COPY --from=build /app/dist/storybook /usr/share/nginx/html/storybook
COPY --from=build /app/dev-docs       /usr/share/nginx/html/docs
COPY landing/index.html               /usr/share/nginx/html/landing/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
