class ArticleController {
  constructor(articleService) {
    this.articleService = articleService;
  }

  async create(req, res, next) {
    try {
      const { id, type, description } = req.body;
      const article = await this.articleService.createArticle(id, type, description);
      
      return res.status(201).json({
        success: true,
        data: article,
        message: 'Article criado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const article = await this.articleService.getArticleById(id);
      
      return res.status(200).json({
        success: true,
        data: article
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const articles = await this.articleService.getAllArticles();
      
      return res.status(200).json({
        success: true,
        data: articles,
        count: articles.length
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.articleService.deleteArticle(id);
      
      return res.status(200).json({
        success: true,
        message: 'Article eliminado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ArticleController;
