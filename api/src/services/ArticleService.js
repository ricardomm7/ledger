const ArticleFactory = require('../domain/ArticleFactory');

class ArticleService {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async createArticle(id, type, description) {
    const article = ArticleFactory.create(id, type, description);
    return await this.articleRepository.create(article);
  }

  async getArticleById(id) {
    if (!id) {
      throw new Error('ID do artigo é obrigatório');
    }

    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new Error(`Article com ID ${id} não encontrado`);
    }

    return article;
  }

  async getAllArticles() {
    return await this.articleRepository.findAll();
  }

  async deleteArticle(id) {
    const existingArticle = await this.articleRepository.findById(id);
    if (!existingArticle) {
      throw new Error(`Article com ID ${id} não encontrado`);
    }

    return await this.articleRepository.delete(id);
  }
}

module.exports = ArticleService;