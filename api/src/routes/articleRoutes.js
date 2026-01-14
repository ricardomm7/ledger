const express = require('express');

function createArticleRoutes(articleController) {
  const router = express.Router();

  router.post('/', (req, res, next) => articleController.create(req, res, next));
  router.post('/bulk', (req, res, next) => articleController.createBulk(req, res, next));
  router.get('/', (req, res, next) => articleController.getAll(req, res, next));
  router.get('/:id', (req, res, next) => articleController.getById(req, res, next));
  router.delete('/:id', (req, res, next) => articleController.delete(req, res, next));

  return router;
}

module.exports = createArticleRoutes;
