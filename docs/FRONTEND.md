# Frontend - Documentação

## Stack Tecnológica

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.0.0
- **QR Code**: qrcode.react 4.2.0
- **Estilo**: CSS customizado (sem frameworks)

## Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/         # Componentes React
│   │   ├── ArticleCard.jsx
│   │   ├── ArticleDetail.jsx
│   │   ├── ArticleList.jsx
│   │   ├── BulkPrintModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── CreateArticleModal.jsx
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── useArticles.js
│   │   └── useModal.js
│   │
│   ├── services/           # API client
│   │   └── articleService.js
│   │
│   ├── dtos/               # Data Transfer Objects
│   │   └── articleDtos.js
│   │
│   ├── api.js              # Configuração Axios
│   ├── config.js           # Configurações gerais
│   ├── styles.css          # Estilos globais
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Entry point
│
├── Dockerfile              # Build multi-stage
├── nginx.conf              # Configuração Nginx
└── vite.config.js          # Configuração Vite
```

## Funcionalidades

### 1. Listagem de Artigos

- **Vista em Mosaicos**: Grid responsivo com tiles adaptativos
- Layout: `repeat(auto-fill, minmax(280px, 1fr))`
- Cards com altura mínima de 160px
- Efeito hover com elevação e sombra
- Descrição truncada a 2 linhas
- Paginação (20 artigos por página)
- Indicador visual de página atual
- Contador total de artigos

### 2. Pesquisa Avançada

**Dropdown de filtros:**
- Todos os campos (pesquisa geral)
- ID específico
- Tipo específico
- Descrição específica

**Features:**
- Badge vermelho quando filtro está ativo
- Dropdown fecha ao clicar fora
- Enter para pesquisar
- Botão "Pesquisar" para confirmar

### 3. Criação de Artigos

**Modal com 3 tabs:**

#### Manual
- Campos: Tipo e Descrição
- ID gerado automaticamente pelo backend

#### JSON Único
- Upload de ficheiro .json
- Ou cola JSON diretamente
- Suporta ID customizado (opcional)

#### Upload em Massa
- Upload de JSON com array de artigos
- Formato: `{"artigos": [{type, description}, ...]}`
- Resultados detalhados:
  - Sumário visual (✓ sucesso, ✕ erros)
  - Lista de erros com detalhes
  - Modal permanece aberto se houver erros

### 4. Detalhes do Artigo

- Visualização completa dos dados
- **QR Code** gerado com o ID do artigo
- Botão de impressão de etiqueta individual
- Navegação de volta para lista

### 5. Impressão em Massa

**Modal de seleção:**
- Checkbox "Selecionar todos" com contador
- Lista de artigos com checkboxes individuais
- Contador de artigos selecionados
- Botão "Imprimir" ativo apenas com seleção

**Layout de impressão:**
- 4 QR Codes por página (grid 2x2)
- Cada etiqueta inclui: QR Code, ID, Tipo e Descrição
- Formatação profissional para impressão A4
- Quebra de página automática

### 6. Eliminação

- Modal de confirmação customizado
- Atualização otimista da lista
- Feedback visual de sucesso/erro

## Componentes Principais

### App.jsx

Componente raiz que gere:
- Roteamento entre lista e detalhes
- Estado de filtros
- Paginação
- Modal de criação

### useArticles (Hook)

```javascript
const {
  articles,        // Array de artigos
  loading,         // Estado de carregamento
  error,           // Mensagem de erro
  handleDeleted,   // Callback após deletar
  performSearch,   // Pesquisa por filtros
  resetSearch      // Limpar filtros
} = useArticles();
```

### CreateArticleModal

Props:
```javascript
<CreateArticleModal 
  isOpen={boolean}
  onClose={() => void}
  onCreated={(article) => void}
/>
```

Estados internos:
- `activeTab`: 'manual' | 'json' | 'bulk'
- `bulkResults`: Resultados do upload em massa

### ArticleDetail

Props:
```javascript
<ArticleDetail 
  article={object}
  onBack={() => void}
/>
```

Features:
- QR Code com ID
- Impressão individual de etiqueta
- Layout responsivo

### BulkPrintModal

Props:
```javascript
<BulkPrintModal 
  isOpen={boolean}
  onClose={() => void}
  articles={array}
/>
```

Features:
- Seleção múltipla de artigos
- Contador de selecionados
- Impressão formatada (4 por página)
- Preview da área de impressão

## Estilos e Temas

### Variáveis CSS

```css
:root {
  --bg: #0b1021;           /* Fundo principal */
  --card: #111830;          /* Cards */
  --text: #e8edf5;          /* Texto */
  --muted: #98a3c7;         /* Texto secundário */
  --accent: #4fe1c1;        /* Cor primária */
  --accent-2: #7cc0ff;      /* Cor secundária */
  --border: #1e2a4a;        /* Bordas */
}
```

### Design System

- **Fonte**: Inter (Google Fonts)
- **Border radius**: 9px
- **Altura de botões**: 41px
- **Topbar**: 60px (min-height)
- **Animações**: Transições de 150-200ms

### Componentes Estilizados

- `.error-box`: Caixa de erro translúcida com ícone
- `.filter-badge`: Badge vermelho com animação pulse
- `.bulk-results`: Sumário de resultados com cores
- `.pagination`: Controles de paginação centralizados

## API Client

### articleService.js

```javascript
// Listar todos
await listArticles()

// Pesquisa avançada
await searchArticles({ id, type, description })

// Criar individual
await createArticle({ type, description })

// Criar em massa
await createBulkArticles(articles)

// Deletar
await deleteArticle(id)
```

### DTOs

Conversão entre formatos API ↔ Frontend:

```javascript
// API → Frontend
toArticle(data)
toArticleList(data)

// Frontend → API
buildCreateArticleRequest(payload)
```

## Desenvolvimento

### Instalar dependências

```bash
npm install
```

### Rodar em dev

```bash
npm run dev -- --host
```

Acede em: http://localhost:5173

### Build de produção

```bash
npm run build
```

Output: `dist/`

### Preview do build

```bash
npm run preview
```

## Variáveis de Ambiente

Ficheiro `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Acesso no código:
```javascript
import { API_URL } from './config';
```

## Docker

### Build

O Dockerfile usa **multi-stage build**:

1. **Stage 1** (build):
   - Node.js 18 Alpine
   - `npm ci` para dependências
   - `npm run build` para compilar

2. **Stage 2** (production):
   - Nginx Alpine
   - Serve ficheiros estáticos
   - Proxy reverso para `/api`

### Nginx Config

- **Proxy**: `/api` → `http://api:3000`
- **Cache**: Assets estáticos com `expires 1y`
- **Gzip**: Compressão ativada
- **SPA**: `try_files` para React Router

## Otimizações

- **Code splitting**: Vite automático
- **Lazy loading**: Componentes pesados
- **Memoização**: `useMemo` em filtros
- **Debounce**: Pesquisa (Enter ou botão)
- **Optimistic updates**: Deletar artigo
- **Cache de assets**: 1 ano no Nginx

## Responsividade

Breakpoints:
- Desktop: > 768px
- Mobile: ≤ 768px

Ajustes mobile:
- Topbar colapsável
- Cards full-width
- Botões adaptados
- Fontes reduzidas

## Acessibilidade

- Labels em todos os inputs
- Placeholders descritivos
- Focus states visíveis
- Botões disabled com opacity
- Cores com contraste adequado
