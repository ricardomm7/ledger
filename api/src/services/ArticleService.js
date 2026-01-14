const ArticleFactory = require('../domain/ArticleFactory');

class ArticleService {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async createArticle(id, type, description) {
    let finalId = id;

    if (!id || id === null || id === undefined) {
      // Criação manual - gera próximo ID disponível
      const nextNumber = await this.articleRepository.getNextId();
      finalId = 'NF' + String(nextNumber).padStart(5, '0');
    } else {
      const existingArticle = await this.articleRepository.findById(id);
      if (existingArticle) {
        throw new Error(`Artigo com ID ${id} já existe`);
      }
    }

    const article = ArticleFactory.create(finalId, type, description);
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

  async searchArticles(filters) {
    return await this.articleRepository.search(filters);
  }

  async deleteArticle(id) {
    const existingArticle = await this.articleRepository.findById(id);
    if (!existingArticle) {
      throw new Error(`Article com ID ${id} não encontrado`);
    }

    return await this.articleRepository.delete(id);
  }

  async createBulkArticles(articles) {
    const results = {
      success: [],
      errors: [],
      total: articles.length
    };

    //console.log(`[BULK] Iniciando criação de ${articles.length} artigos...`);

    for (let i = 0; i < articles.length; i++) {
      const articleData = articles[i];
      try {
        const { id, type, description } = articleData;
        const created = await this.createArticle(id, type, description);
        results.success.push({
          id: created.id,
          type: created.type
        });
      } catch (error) {
        //console.error(`[BULK ERROR #${i + 1}] ID: ${articleData.id}, Type: ${articleData.type}, Description: ${articleData.description}`);
        //console.error(`[BULK ERROR #${i + 1}] Erro: ${error.message}`);
        results.errors.push({
          data: articleData,
          error: error.message
        });
      }
    }

    //console.log(`[BULK] Concluído: ${results.success.length} criados, ${results.errors.length} erros`);
    return results;
  }
}

module.exports = ArticleService;