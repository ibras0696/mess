# Placeholder Dockerfile for the frontend (React/Vite expected).
# Frontend engineer should replace COPY/RUN steps once package.json is present.

FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies; this will be replaced when real package.json exists.
# Keeping a noop here so the image builds even before the app is scaffolded.
RUN npm init vite@latest placeholder -- --template react-ts >/dev/null 2>&1 || true

EXPOSE 3000

# Frontend engineer should set the real start command (e.g. npm run dev -- --host).
CMD ["sh", "-c", "echo 'Frontend scaffold not yet added. Provide package.json and update this CMD.' && sleep infinity"]
