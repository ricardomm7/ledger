# Ledger API - Docker Setup

## Pré-requisitos

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Como rodar com Docker

### 1. Build da imagem e iniciar containers

```bash
# Navega para a pasta da API
cd c:\Users\ricar\Desktop\Estágios\ledger\api

# Build e inicia os containers (PostgreSQL + API)
docker-compose up --build
```

### 2. Apenas iniciar (se já foi feito o build)

```bash
docker-compose up
```

### 3. Rodar em background

```bash
docker-compose up -d
```

## Comandos úteis

### Ver logs
```bash
# Logs da API
docker-compose logs api

# Logs do PostgreSQL
docker-compose logs postgres

# Logs em tempo real
docker-compose logs -f
```

### Parar containers
```bash
docker-compose down
```

### Parar e remover volumes (limpa tudo)
```bash
docker-compose down -v
```

### Aceder ao PostgreSQL dentro do container
```bash
docker-compose exec postgres psql -U postgres -d ledger_db
```

### Ver status dos containers
```bash
docker-compose ps
```

## O que está configurado no docker-compose.yml

✅ **PostgreSQL (latest)** - Com credenciais do .env
✅ **Health Check** - Verifica se PostgreSQL está pronto
✅ **Volumes** - Dados persistidos em `postgres_data`
✅ **Network** - Comunicação entre containers
✅ **API Node.js** - Depende do PostgreSQL estar saudável
✅ **Hot reload** - Alterações refletem automaticamente

## Estrutura dos containers

```
┌─────────────────────────┐
│   ledger-api (Node)     │  :3000
│  (hot reload)           │
└────────────┬────────────┘
             │ (localhost)
┌────────────▼────────────┐
│  ledger-postgres (PG)   │  :5432
│  (dados persistidos)    │
└─────────────────────────┘
```

## Acessar a API

- **Base URL**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/health`
- **Articles**: `http://localhost:3000/api/articles`

## Troubleshooting

### Porta já em uso
```bash
# Encontra processo na porta 3000
netstat -ano | findstr :3000

# Encontra processo na porta 5432
netstat -ano | findstr :5432
```

### Erro de conexão com PostgreSQL
```bash
# Verifica logs
docker-compose logs postgres

# Reinicia
docker-compose restart postgres
```

### Limpar tudo e começar do zero
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```
