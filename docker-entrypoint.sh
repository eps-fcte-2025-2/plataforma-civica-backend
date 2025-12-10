#!/bin/sh

echo "Iniciando aplicacao Plataforma Civica Backend..."

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados PostgreSQL..."
timeout=60
counter=0

until nc -z database 5555; do
  if [ $counter -ge $timeout ]; then
    echo "ERRO: Timeout - Banco de dados nao esta disponivel apos ${timeout} segundos"
    exit 1
  fi
  echo "Banco nao esta pronto, aguardando... (${counter}/${timeout}s)"
  sleep 2
  counter=$((counter + 2))
done

echo "Banco de dados PostgreSQL disponivel!"

# Aplicar migrations do Prisma
echo "Aplicando migrations do Prisma..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# Verificar se as migrations foram aplicadas
if [ $? -eq 0 ]; then
  echo "Migrations aplicadas com sucesso!"
else
  echo "ERRO: Falha ao aplicar migrations!"
  exit 1
fi

# Garantir que o cliente Prisma esteja atualizado
echo "Gerando cliente Prisma..."
npx prisma generate

# Iniciar o servidor
echo "Iniciando servidor Fastify na porta 3333..."
echo "Documentacao disponivel em: http://localhost:3333/docs"
exec pnpm dev