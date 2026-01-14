# Backend API - Documentação

## Arquitetura

O backend segue **Onion Architecture** (Clean Architecture) com separação clara de responsabilidades:

```
┌─────────────────────────────────────┐
│         Controllers (HTTP)          │
│    ┌───────────────────────────┐   │
│    │       Services             │   │
│    │  ┌─────────────────────┐  │   │
│    │  │   Repositories       │  │   │
│    │  │  ┌───────────────┐  │  │   │
│    │  │  │    Domain     │  │  │   │
│    │  │  │  (Entities)   │  │  │   │
│    │  │  └───────────────┘  │  │   │
│    │  └─────────────────────┘  │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Camadas

1. **Domain** (`src/domain/`)
   - Entidades: `Article.js`
   - Factories: `ArticleFactory.js`
   - Validações de negócio
   - Zero dependências externas

2. **Repositories** (`src/repositories/`)
   - Acesso a dados (PostgreSQL)
   - Implementa `IArticleRepository`
   - Conversão de dados para entidades

3. **Services** (`src/services/`)
   - Lógica de aplicação
   - Orquestração entre camadas
   - Geração de IDs (NFxxxxx)

4. **Controllers** (`src/controllers/`)
   - Handlers HTTP
   - Validação de requests
   - Formatação de respostas

5. **Routes** (`src/routes/`)
   - Definição de endpoints
   - Mapeamento para controllers

## Endpoints da API

### Health Check

```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-14T12:00:00.000Z"
}
```

### Listar Todos os Artigos

```http
GET /api/articles
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "NF00001",
      "type": "Monitor",
      "description": "ultrawide 34 polegadas",
      "created_at": "2026-01-14T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Pesquisa Avançada

```http
GET /api/articles/search?id=NF00001&type=Monitor&description=ultrawide
```

**Query Parameters:**
- `id` (opcional): Pesquisa parcial por ID
- `type` (opcional): Pesquisa parcial por tipo
- `description` (opcional): Pesquisa parcial por descrição

**Resposta:** Igual ao listar artigos

### Obter Artigo por ID

```http
GET /api/articles/:id
```

**Exemplo:**
```http
GET /api/articles/NF00001
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "NF00001",
    "type": "Monitor",
    "description": "ultrawide 34 polegadas",
    "created_at": "2026-01-14T12:00:00.000Z"
  }
}
```

### Criar Artigo Individual

```http
POST /api/articles
Content-Type: application/json

{
  "type": "Monitor",
  "description": "ultrawide 34 polegadas"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "NF00001",
    "type": "Monitor",
    "description": "ultrawide 34 polegadas",
    "created_at": "2026-01-14T12:00:00.000Z"
  },
  "message": "Article criado com sucesso"
}
```

**Nota:** ID é gerado automaticamente no formato `NFxxxxx`

### Criar Artigo com ID Customizado (via JSON)

```http
POST /api/articles
Content-Type: application/json

{
  "id": "NF99999",
  "type": "Monitor",
  "description": "ultrawide 34 polegadas"
}
```

### Criar Múltiplos Artigos (Bulk)

```http
POST /api/articles/bulk
Content-Type: application/json

{
  "artigos": [
    {
      "type": "Monitor",
      "description": "ultrawide 34 polegadas"
    },
    {
      "id": "NF00500",
      "type": "Rato",
      "description": "ergonómico vertical"
    }
  ]
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "success": [
      { "id": "NF00001", "type": "Monitor" },
      { "id": "NF00500", "type": "Rato" }
    ],
    "errors": [],
    "total": 2
  },
  "message": "2 de 2 artigos criados com sucesso"
}
```

### Deletar Artigo

```http
DELETE /api/articles/:id
```

**Exemplo:**
```http
DELETE /api/articles/NF00001
```

**Resposta:**
```json
{
  "success": true,
  "message": "Article eliminado com sucesso"
}
```

## Validações

### Article Domain

- **ID**: String no formato `NFxxxxx` (validado se fornecido)
- **Type**: String obrigatória, não vazia
- **Description**: String obrigatória, não vazia

**Conversões automáticas:**
- Se `type` ou `description` forem números, são convertidos para string

### Erros Comuns

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Tipo do artigo é obrigatório e deve ser uma string"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Article com ID NF00001 não encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

## Geração de IDs

IDs são gerados no formato `NFxxxxx`:
- Prefixo: `NF`
- Número sequencial com 5 dígitos (padding com zeros)
- Exemplos: `NF00001`, `NF00042`, `NF00500`

**Lógica:**
1. Busca último ID no formato `NF[0-9]+`
2. Extrai o número
3. Incrementa +1
4. Formata com `padStart(5, '0')`

## Base de Dados

### Tabela: articles

```sql
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Singleton Connection Pool

O backend usa uma conexão singleton ao PostgreSQL para otimizar performance:

```javascript
class Database {
  static instance = null;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
    }
    return this.instance;
  }
}
```

## Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

## Variáveis de Ambiente

Ficheiro `.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ledger_db
```

## Logs de Debug

O backend inclui logs detalhados para bulk operations:

```
[BULK] Iniciando criação de 500 artigos...
[BULK ERROR #31] ID: NF00031, Type: Impressora, Description: 1
[BULK ERROR #31] Erro: Descrição do artigo é obrigatória e deve ser uma string
[BULK] Concluído: 488 criados, 12 erros
```
