FROM node:24-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ .
RUN pnpm run build

FROM nginx:alpine

COPY infra/nginx/frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
