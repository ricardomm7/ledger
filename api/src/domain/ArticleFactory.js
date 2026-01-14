const Article = require('./Article');

class ArticleFactory {
  static create(id, type, description) {
    // Converter type e description para string se necessário
    const convertedType = type != null ? String(type) : type;
    const convertedDescription = description != null ? String(description) : description;
    
    return Article.create(id, convertedType, convertedDescription);
  }

  static createFromData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos para criar Article');
    }

    // Converter type e description para string se necessário
    const type = data.type != null ? String(data.type) : data.type;
    const description = data.description != null ? String(data.description) : data.description;

    return this.create(data.id, type, description);
  }
}

module.exports = ArticleFactory;
