# Ledger - Sistema de Gestão de Artigos

Sistema full-stack para gestão de artigos com suporte a criação manual, upload JSON e criação em massa. Construído com arquitetura Onion/Clean Architecture.

## Stack Tecnológica

- **Backend**: Node.js 18 + Express.js (Onion Architecture)
- **Frontend**: React 18 + Vite
- **Base de Dados**: PostgreSQL
- **Containerização**: Docker + Docker Compose

## Características

✅ CRUD completo de artigos (Criar, Ler, Deletar)  
✅ Criação manual, via JSON individual ou upload em massa (500+ artigos)  
✅ Geração automática de IDs no formato `NFxxxxx`  
✅ Pesquisa avançada por ID, Tipo ou Descrição  
✅ Paginação (20 artigos por página)  
✅ Geração de QR Code para cada artigo  
✅ Impressão de etiquetas individual e em massa (múltiplos QR Codes por página)  
✅ Interface responsiva com design moderno  
✅ Validação robusta de dados (backend + frontend)

## Iniciar o Projeto

### Opção 1: Com Docker (Recomendado)

```bash
# Na raiz do projeto
cd api
docker-compose up --build
```

Acede a aplicação em:
- **Frontend**: http://localhost
- **API**: http://localhost:3000

### Opção 2: Desenvolvimento Local

**Backend:**
```bash
cd api
cp .env.example .env
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev -- --host
```

## Estrutura do Projeto

```
ledger/
├── api/                      # Backend Express.js
│   ├── src/
│   │   ├── domain/          # Entidades e lógica de negócio
│   │   ├── repositories/    # Acesso a dados
│   │   ├── services/        # Lógica de aplicação
│   │   ├── controllers/     # Handlers HTTP
│   │   └── routes/          # Definição de rotas
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/                # Frontend React + Vite
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client
│   │   └── dtos/            # Data Transfer Objects
│   ├── Dockerfile
│   └── nginx.conf
│
└── docs/                    # Documentação detalhada
```

## Endpoints Principais da API

- `GET /api/articles` - Listar todos os artigos
- `GET /api/articles/search?id=&type=&description=` - Pesquisa avançada
- `GET /api/articles/:id` - Obter artigo por ID
- `POST /api/articles` - Criar artigo individual
- `POST /api/articles/bulk` - Criar múltiplos artigos
- `DELETE /api/articles/:id` - Deletar artigo

## Documentação Adicional

- [Configuração Docker](docs/DOCKER.md) - Guia completo de Docker
- [API Backend](docs/BACKEND.md) - Documentação da API
- [Frontend](docs/FRONTEND.md) - Documentação do React

## Licença

Este projeto está sob a licença MIT.
