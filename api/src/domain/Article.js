class Article {
  constructor(id, type, description, createdAt) {
    this.id = id;
    this.type = type;
    this.description = description;
    this.createdAt = createdAt;
  }

  static create(id, type, description) {
    this.validate(id, type, description);
    const now = new Date();
    return new Article(id, type, description, now);
  }

  static validate(id, type, description) {
    if (id && typeof id !== 'string') {
      throw new Error('ID do artigo deve ser uma string');
    }

    if (!type || typeof type !== 'string' || type.trim() === '') {
      throw new Error('Tipo do artigo é obrigatório e deve ser uma string');
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      throw new Error('Descrição do artigo é obrigatória e deve ser uma string');
    }
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getDescription() {
    return this.description;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}

module.exports = Article;