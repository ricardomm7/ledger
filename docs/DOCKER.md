# Docker - Guia Completo

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/) (incluído no Docker Desktop)

## Arquitetura Docker

```
┌─────────────────────────────┐
│  ledger-frontend (Nginx)    │  :80
│  (React build otimizado)    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│   ledger-api (Node.js)      │  :3000
│   (Express + Onion Arch)    │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│  ledger-postgres (PG)       │  :5432
│  (Dados persistidos)        │
└─────────────────────────────┘
```

## Como Rodar

### Iniciar todos os serviços

```bash
cd api
docker-compose up --build
```

### Rodar em background

```bash
docker-compose up -d
```

### Ver logs em tempo real

```bash
docker-compose logs -f
```

## Serviços Disponíveis

Após `docker-compose up`, terás:

- **Frontend**: http://localhost
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## Comandos Úteis

### Ver status dos containers

```bash
docker-compose ps
```

### Ver logs específicos

```bash
# Logs do frontend
docker-compose logs frontend

# Logs da API
docker-compose logs api

# Logs do PostgreSQL
docker-compose logs postgres
```

### Parar containers

```bash
docker-compose down
```

### Parar e remover volumes (limpa banco de dados)

```bash
docker-compose down -v
```

### Reiniciar serviço específico

```bash
docker-compose restart api
docker-compose restart frontend
```

### Aceder ao container PostgreSQL

```bash
docker-compose exec postgres psql -U postgres -d ledger_db
```

### Rebuild apenas um serviço

```bash
docker-compose up --build frontend
```

## Configuração dos Containers

### Frontend (Nginx)

- **Imagem**: Multi-stage build (Node.js → Nginx Alpine)
- **Stage 1**: Build da aplicação Vite
- **Stage 2**: Serve ficheiros estáticos via Nginx
- **Proxy reverso**: `/api` → `http://api:3000`
- **Otimizações**: Gzip, cache de assets, compressão

### API (Node.js)

- **Imagem**: Node.js 18 Alpine
- **Health Check**: Verifica conexão com PostgreSQL
- **Hot Reload**: Volumes mapeados para desenvolvimento
- **Variáveis de ambiente**: Carregadas do `.env`

### PostgreSQL

- **Imagem**: PostgreSQL Latest
- **Health Check**: `pg_isready`
- **Volume**: Dados persistidos em `postgres_data`
- **Inicialização**: Tabela `articles` criada automaticamente

## Troubleshooting

### Porta já em uso

```bash
# Windows - encontrar processo na porta
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Matar processo (usar PID do comando acima)
taskkill /PID <PID> /F
```

### Erro de conexão PostgreSQL

```bash
# Verificar logs
docker-compose logs postgres

# Reiniciar PostgreSQL
docker-compose restart postgres

# Se persistir, limpar volumes
docker-compose down -v
docker-compose up --build
```

### Rebuild completo

```bash
# Limpar tudo
docker-compose down -v
docker system prune -a

# Rebuild do zero
docker-compose up --build
```

### Frontend não carrega

```bash
# Verificar se nginx está a servir
docker-compose logs frontend

# Verificar se build foi bem-sucedido
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### API não conecta ao PostgreSQL

```bash
# Verificar se PostgreSQL está healthy
docker-compose ps

# Verificar variáveis de ambiente
docker-compose exec api printenv | grep DB_
```

## Variáveis de Ambiente

As variáveis estão definidas em `api/.env`:

```env
# API
PORT=3000
NODE_ENV=production

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ledger_db
```

## Volumes e Persistência

- **postgres_data**: Volume nomeado para dados do PostgreSQL
- **api/node_modules**: Volume anónimo para dependências Node.js
- **Código fonte**: Mapeado para hot reload em desenvolvimento

## Network

Todos os containers partilham a rede `ledger-network` (bridge), permitindo comunicação interna por nome de serviço (e.g., `http://api:3000`).
