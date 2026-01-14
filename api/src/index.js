const express = require('express');
const cors = require('cors');
require('dotenv').config();

const DependencyInjection = require('./config/DependencyInjection');
const createArticleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Dependency Injection
const container = new DependencyInjection();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API Ledger' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Article Routes
const articleController = container.get('articleController');
app.use('/api/articles', createArticleRoutes(articleController));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Algo correu mal!';
  
  res.status(statusCode).json({ 
    success: false,
    error: message,
    statusCode 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
