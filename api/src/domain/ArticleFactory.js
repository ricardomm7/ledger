const Article = require('./Article');

class ArticleFactory {
  static create(id, type, description) {
    return Article.create(id, type, description);
  }

  static createFromData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos para criar Article');
    }

    return this.create(data.id, data.type, data.description);
  }
}

module.exports = ArticleFactory;
