#!/bin/sh

echo "🚀 Iniciando aplicação Plataforma Cívica Backend..."

# Aguardar o banco de dados estar disponível
echo "⏳ Aguardando banco de dados PostgreSQL..."
timeout=60
counter=0

until nc -z database 5555; do
  if [ $counter -ge $timeout ]; then
    echo "❌ Timeout: Banco de dados não está disponível após ${timeout} segundos"
    exit 1
  fi
  echo "🔄 Banco não está pronto, aguardando... (${counter}/${timeout}s)"
  sleep 2
  counter=$((counter + 2))
done

echo "✅ Banco de dados PostgreSQL disponível!"

# Aplicar migrations do Prisma
echo "📊 Aplicando migrations do Prisma..."
npx prisma migrate deploy

# Verificar se as migrations foram aplicadas com sucesso
if [ $? -eq 0 ]; then
  echo "✅ Migrations aplicadas com sucesso!"
else
  echo "❌ Erro ao aplicar migrations do Prisma!"
  exit 1
fi

# Opcional: Verificar se o banco está populado e executar seed se necessário
echo "🌱 Verificando se precisa executar seed..."
# Esta verificação pode ser customizada conforme necessário

# Iniciar o servidor
echo "🚀 Iniciando servidor Fastify na porta 3333..."
echo "📚 Documentação disponível em: http://localhost:3333/docs"
exec pnpm dev