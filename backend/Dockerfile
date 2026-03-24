FROM node:24-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# 运行阶段
FROM node:24-alpine

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

RUN apk add --no-cache wget

EXPOSE 8080

CMD ["node", "dist/index.js"]