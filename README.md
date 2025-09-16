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
