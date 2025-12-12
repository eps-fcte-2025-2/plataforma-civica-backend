# 🚨 Plataforma Cívica - Backend API

API REST para sistema de denúncias de manipulação em apostas esportivas, desenvolvida com **Fastify**, **Prisma** e **PostgreSQL**.

## ✅ Status do Desenvolvimento

### 📋 Módulo Reports (Implementado)
O módulo principal de denúncias está **completamente implementado** com:

- ✅ **Estrutura completa**: Controllers, Use Cases, Repositories, DTOs
- ✅ **CRUD completo**: Criar, listar, visualizar denúncias
- ✅ **Entidades relacionadas**: Pessoas, clubes, evidências, focos de manipulação
- ✅ **Validação robusta**: DTOs com Zod para todas as entradas
- ✅ **Documentação Swagger**: Disponível em `/docs`
- ✅ **Migrações**: Schema do banco implementado e versionado
- ✅ **Testes funcionais**: Endpoints testados e funcionais

## 🚀 Acesso Rápido

| Recurso | URL |
|---------|-----|
| **API Base** | http://localhost:3333 |
| **Documentação Swagger** | http://localhost:3333/docs |
| **Documentação Detalhada** | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |

## 📊 Endpoints Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/v1/reports` | Criar denúncia completa |
| `GET` | `/v1/reports` | Listar denúncias (paginado) |
| `GET` | `/v1/reports/:id` | Visualizar denúncia específica |
| `PATCH` | `/v1/reports/:id` | Atualizar status (preparado) |
| `GET` | `/v1/reports/municipios` | Listar municípios |
| `GET` | `/v1/chatbot/webhook` | Webhook de verificação (GET) |
| `POST` | `/v1/chatbot/webhook` | Processar mensagem do chatbot |

## 🛠 Tecnologias

- **Framework**: [Fastify](https://fastify.dev/) - Framework web rápido e eficiente
- **ORM**: [Prisma](https://prisma.io/) - Toolkit para banco de dados moderno
- **Banco**: [PostgreSQL](https://postgresql.org/) - Banco relacional robusto
- **Validação**: [Zod](https://zod.dev/) - Schema validation com TypeScript
- **Documentação**: [Swagger/OpenAPI](https://swagger.io/) - Documentação interativa da API
- **Runtime**: [Node.js 18+](https://nodejs.org/) - Ambiente de execução JavaScript

## 🏗 Arquitetura do Projeto

```
src/
├── config/                     # Configurações da aplicação
│   └── envConfig.ts               # Configuração das variáveis de ambiente
├── infra/                      # Infraestrutura (fora da regra de negócio)
│   ├── database/                  # Conexão com PostgreSQL via Prisma
│   └── http/                      # Servidor Fastify e configurações
├── modules/                    # Módulos da aplicação (Clean Architecture)
│   ├── reports/                   # ✅ Módulo de denúncias (IMPLEMENTADO)
│   │   ├── controllers/              # Controllers REST
│   │   ├── dtos/                     # DTOs validados com Zod
│   │   ├── factories/                # Dependency Injection
│   │   ├── infra/
│   │   │   ├── repositories/            # Implementação Prisma
│   │   │   └── routes/                  # Rotas documentadas
│   │   ├── repositories/             # Interfaces dos repositórios
│   │   └── usecases/                 # Regras de negócio
│   └── [outros módulos]           # Estrutura padrão para novos módulos
└── shared/                     # Componentes compartilhados
    ├── dtos/                      # DTOs comuns
    ├── errors/                    # Tratamento de erros HTTP
    ├── middlewares/               # Middlewares globais
    ├── patterns/                  # Interfaces de padrões
    └── types/                     # Tipos TypeScript compartilhados
```

## Modelo de dados

![Modelo de dados](/assets/database-diagram.png)

## 🚀 Como Executar

### 📋 Pré-requisitos
- **Node.js** 18+ 
- **Docker** e **Docker Compose**
- **pnpm** (recomendado) ou npm

### ⚡ Início Rápido

```bash
# 1. Clone o repositório e entre na pasta
cd plataforma-civica-backend

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Efetuar a troca do localhost no .env para rodar APENAS o banco de dados
POSTGRES_HOST=localhost

# 4. Iniciar banco de dados PostgreSQL
docker compose up -d database

# 5. Executar migrações do Prisma
npx prisma migrate dev

# 6. (Opcional) Popular banco com dados de teste
npx ts-node-dev --transpile-only --exit-child seed.ts

# 7. Iniciar servidor de desenvolvimento
pnpm dev
```

### 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Inicia servidor em modo watch

# Banco de dados
npx prisma migrate dev      # Executa migrações
npx prisma studio          # Interface visual do banco
npx prisma generate         # Gera cliente Prisma

# Docker
docker compose up -d        # Inicia todos os serviços
docker compose up database  # Apenas o banco PostgreSQL
```

### 🌐 Acessos Locais

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **API** | http://localhost:3333 | Servidor principal |
| **Swagger UI** | http://localhost:3333/docs | Documentação interativa |
| **Prisma Studio** | http://localhost:5555 | Interface do banco |
| **PostgreSQL** | localhost:5555 | Banco de dados |

## 🗄 Banco de Dados

### Configuração PostgreSQL
```env
POSTGRES_USER=maeJoana
POSTGRES_PASSWORD=SenhaDeMais!
POSTGRES_DB=Policia
POSTGRES_HOST=database
POSTGRES_PORT=5555
DATABASE_URL=postgresql://maeJoana:SenhaDeMais!@database:5555/Policia?schema=public
```

### Schema Principal
- **Reports**: Denúncias de manipulação
- **Pessoas**: Dados dos envolvidos
- **Clubes**: Times de futebol
- **Evidências**: Arquivos e provas
- **Municípios**: Localização geográfica

## 🧪 Testes

### Configurar Banco de Teste

```bash
# 1. Criar banco de teste no PostgreSQL
psql -U maeJoana -h localhost -p 5555 -d Policia -c "CREATE DATABASE \"Policia_test\";"
# Senha: SenhaDeMais!

# 2. Aplicar migrations no banco de teste
pnpm run test:db:setup

# 3. Executar testes
pnpm test

# 4. Executar testes específicos
pnpm test Login
pnpm test Perfil

# 5. Executar em modo watch
pnpm test:watch
```

### Scripts de Teste Disponíveis

```bash
pnpm test                 # Executa todos os testes
pnpm test:db:setup        # Configura banco de teste (migrations)
pnpm test:db:reset        # Reseta banco de teste (⚠️ apaga dados)
pnpm test:watch           # Modo watch
pnpm test:coverage        # Cobertura de código
```

### Nota sobre execução (paralelismo)

Algumas suítes E2E podem apresentar instabilidade quando executadas em paralelo devido a recursos compartilhados (banco de testes, servidor, fixtures). Se você observar testes E2E intermitentes (por exemplo 404 em endpoints autenticados), execute os testes E2E em modo serial como mitigação rápida:

```bash
# Executa toda a suíte em modo serial (desativa paralelismo de arquivos)
npm test -- --run --no-file-parallelism
# ou
npx vitest run --no-file-parallelism
```

Sugestão para CI: executar os testes E2E em série ou separar unitários e E2E em jobs distintos. Exemplo (GitHub Actions):

```yaml
# step: run e2e tests serially
- name: Run E2E tests (serial)
  run: npm test -- --run --no-file-parallelism
```

### Dados de Teste
O projeto inclui arquivos JSON para testes manuais:
- `test_denuncia.json` - Denúncia básica
- `test_denuncia_partida.json` - Denúncia com dados de partida

### Testando Endpoints
Use a documentação Swagger em `/docs` ou ferramentas como:
- **Postman** / **Insomnia**
- **cURL**
- **Thunder Client** (VS Code)

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) | Documentação detalhada da API |
| [`ISSUE_DENUNCIAS.md`](./ISSUE_DENUNCIAS.md) | Issues relacionadas a denúncias |
| [`ISSUE_PESSOAS.md`](./ISSUE_PESSOAS.md) | Issues relacionadas a pessoas |
| [`PR_MESSAGE.md`](./PR_MESSAGE.md) | Template para pull requests |

## 🤝 Como Contribuir

Para contribuir, acesse o [Guia de Contribuição](./CONTRIBUTING.md)

Basicamente:
1. **Clone** o repositório.
2. **Crie** uma branch para trabalhar conforme o guia de contribuição, exemplo: `git checkout -b <tipo>/<numero-da-issue>-<nome-da-funcionalidade>`.
3. **Implemente** suas alterações seguindo a arquitetura existente.
4. **Teste** localmente com os dados de exemplo.
5. **Commit** suas mudanças conforme o guia de contribuição, exemplo: `git commit -m 'feat(#<numero-da-issue>): adiciona tal coisa'`.
7. **Push** para sua branch.
8. **Abra** um pull request.

### Padrões do Projeto
- **Clean Architecture** para organização de código
- **DTOs validados** com Zod
- **Dependency Injection** via factories
- **Documentação Swagger** para todos os endpoints
- **TypeScript** strict mode

## ❓ Solução de Problemas

### Problema com Docker
```bash
# Reiniciar containers
docker compose down
docker compose up -d

# Limpar volumes (⚠️ apaga dados)
docker compose down -v
```

### Problema com Prisma
```bash
# Regenerar cliente
npx prisma generate

# Resetar banco (⚠️ apaga dados)  
npx prisma migrate reset
```

### Problema com Dependências
```bash
# Limpar cache do pnpm
pnpm store prune

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

# mudanças pra issue 2

fizemos apenas as rotas e o fluxo de autenticação com JWT (sem banco)

e alteramos a tabela de user no schema do prismaa  (só adicionamos senhas)

O que foi alterado


## 1. infra/http/server.ts


- Adicionamos o plugin de JWT.

- Registramos as rotas de usuários.

- Mantivemos CORS, Swagger, Zod e o error handler existentes.

## 2. prisma/schema.prisma


- Criamos o modelo User (tabela de usuários)

## 3. modules/users/infra/routes/usersRoutes.ts


- Rotas criadas apenas para DEV (sem persistência):
	- POST /users: valida payload e retorna um usuário “fake”.

	- POST /sessions: gera JWT com isAdmin: true.

	- GET /me: requer autenticação.

	- GET /admin/health: requer autenticação (todos são admins).

## 4. shared/middlewares/auth.ts


- Pre-handlers de autenticação. Como todo usuário é admin, requireAdmin é um alias de verifyJWT.


## 5. shared/types/fastify-jwt.d.ts


- Tipagem do JWT para o Fastify (req.user).


## Como rodar


1. Defina variáveis de ambiente:


- JWT_SECRET: chave longa

- PORT: porta do servidor


1. Inicie o servidor:


- Com o script atual do projeto (ex.: ts-node no server.ts).

## Como testar


- Criar usuário (DEV):

```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"StrongPass123!"}'
```
- Login (gera token de DEV):
```bash
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"StrongPass123!"}'
```
- Usar o token nas rotas protegidas:
```bash
curl http://localhost:3333/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

curl http://localhost:3333/admin/health \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

# Implementado pósteriormente

- Integrar Prisma nas rotas:
	- Persistir usuário no POST /users (hash de senha).

	- Validar credenciais no POST /sessions.
- Ajustar o modelo User (passwordHash, campos de auditoria).

- Adicionar schemas das rotas no Swagger (schema.body/response) para exibir nos docs.

- Seed de um admin inicial (opcional).

- Garantir que tsconfig inclui os .d.ts (include: ["/*.ts", "/*.d.ts"]). 

## Como testar o que foi implementado posteriormente

- Prisma integrado nas rotas
  
    ```bash
    curl -X POST http://localhost:${PORT:-3333}/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"Admin","email":"admin@example.com","password":"StrongPass123!"}'
    ```
  
  - Login (valida credenciais com hash e retorna JWT + dados do usuário):
    ```bash
    curl -X POST http://localhost:${PORT:-3333}/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@example.com","password":"StrongPass123!"}'
    ```

    ```bash
    pnpm prisma studio
    ```
    Abra a tabela `User` e confirme o novo registro. O campo `passwordHash` deve conter um hash (não a senha em texto puro). Campos `createdAt` e `updatedAt` devem estar preenchidos automaticamente.


  - Após criar um usuário, confira no Prisma Studio que:
    - `passwordHash` está preenchido (hash Bcrypt).
    - `createdAt` e `updatedAt` possuem valores consistentes.
  - Teste login com senha incorreta para validar a proteção:
    ```bash
    curl -X POST http://localhost:${PORT:-3333}/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@example.com","password":"SenhaErrada123!"}'
    ```
    Esperado: erro 401 (credenciais inválidas).

- Schemas no Swagger (body/response)
  - Acesse a documentação: http://localhost:${PORT:-3333}/docs
  - Verifique que as rotas de `Usuários` exibem os esquemas de request/response (por exemplo, `POST /auth/register` e `POST /auth/login`).

-
