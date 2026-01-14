const ArticleType = require('./ArticleType');
const Description = require('./Description');

class Article {
  constructor(id, type, description, createdAt) {
    this.id = id;
    this.type = type;
    this.description = description;
    this.createdAt = createdAt;
  }

  static create(id, typeValue, descriptionValue) {
    this.validate(id);
    
    // Criar os value objects
    const type = new ArticleType(typeValue);
    const description = new Description(descriptionValue);
    
    const now = new Date();
    return new Article(id, type, description, now);
  }

  static validate(id) {
    if (id && typeof id !== 'string') {
      throw new Error('ID do artigo deve ser uma string');
    }
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type.getValue();
  }

  getDescription() {
    return this.description.getValue();
  }

  getCreatedAt() {
    return this.createdAt;
  }

  // Método para serialização JSON
  toJSON() {
    return {
      id: this.id,
      type: this.getType(),
      description: this.getDescription(),
      createdAt: this.createdAt
    };
  }
}

module.exports = Article;