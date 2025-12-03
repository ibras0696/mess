FROM node:20-bullseye-slim AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates wget gnupg \
  && rm -rf /var/lib/apt/lists/* \
  && npm ci \
  && npx playwright install --with-deps chromium

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
