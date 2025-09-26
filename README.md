# API - Denuncias

Estrutura de pastas:

```
rootFolder
├── config/                     # Configurações da aplicação
│   └── envConfig                   # Configuração da .env
├── infra/                      # Arquivos fora da regra de negócio
│   ├── database/                   # Conexão com o banco de dados
│   └── http/                       # Configuração e inicialização do servidor web
├── modules/                    # Módulos da aplicação
│   ├── reports/                    # Módulo de denúncias
│   ├── dashboard/                  # Módulo dos dashboards sobre os dados de denúncias
│   └── [module]/                   # Exemplo de um módulo qualquer
│       ├── controllers/
│       ├── dtos/                       # DTOS de entrada e saida da API
│       ├── factories/                  # Factories dos use cases e dos controllers
│       ├── infra/
│       │   ├── repositories/               # Implementação das interfaces dos repositorios
│       │   └── routes/                     # Rotas desse módulo
│       ├── repositories/               # Interfaces dos repositórios
│       └── usecases/
└── shared/                     # Componentes compartilhados
    ├── dtos/                   # DTOs comuns
    ├── errors/                 # HTTP Errors
    ├── middlewares/            # Middlewares comuns
    ├── patterns/               # Interface dos patterns
    └── types                   # Tipos usados em vários lugares da aplicação

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
