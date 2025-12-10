# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm i -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Instalar TODAS as dependências (incluindo dev para ter tsx)
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Production stage
FROM node:22-alpine AS production

# Instalar netcat para verificação de conectividade do banco
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Instalar pnpm
RUN npm i -g pnpm

# Copiar dependências da fase de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiar código fonte e arquivos gerados
COPY --from=builder /app .

# Script para aplicar migrations e iniciar o servidor
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 3333 || exit 1

CMD [ "sh", "./docker-entrypoint.sh" ]
