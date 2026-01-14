const IArticleRepository = require('../abstractions/IArticleRepository');
const Database = require('../config/Database');

class ArticleRepository extends IArticleRepository {
  constructor() {
    super();
    this.db = Database.getInstance();
  }

  async getNextId() {
    const query = `
      SELECT id FROM articles 
      WHERE id ~ '^NF[0-9]+$'
      ORDER BY CAST(SUBSTRING(id FROM 3) AS INTEGER) DESC 
      LIMIT 1
    `;
    const result = await this.db.query(query);
    
    if (result.rows.length === 0) {
      return 1;
    }
    
    const lastId = result.rows[0].id;
    const lastNumber = parseInt(lastId.substring(2));
    return lastNumber + 1;
  }

  async create(article) {
    let query;
    let params;

    if (article.id) {
      // Inserção com ID customizado (via JSON)
      query = `
        INSERT INTO articles (id, type, description)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      params = [article.id, article.type, article.description];
    } else {
      // Inserção manual (ID auto-gerado)
      query = `
        INSERT INTO articles (type, description)
        VALUES ($1, $2)
        RETURNING *
      `;
      params = [article.type, article.description];
    }
    
    const result = await this.db.query(query, params);
    const row = result.rows[0];
    
    article.id = row.id;
    article.createdAt = row.created_at;
    
    return article;
  }

  async findById(id) {
    const query = 'SELECT * FROM articles WHERE id = $1';
    const result = await this.db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return this.mapRowToArticle(row);
  }

  async findAll() {
    const query = 'SELECT * FROM articles ORDER BY created_at DESC';
    const result = await this.db.query(query);
    
    return result.rows.map(row => this.mapRowToArticle(row));
  }

  async update(id, article) {
    const query = `
      UPDATE articles
      SET type = $1, description = $2
      WHERE id = $3
      RETURNING *
    `;

    const result = await this.db.query(query, [article.type, article.description, id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    article.id = row.id;
    article.createdAt = row.created_at;
    
    return article;
  }

  async delete(id) {
    const query = 'DELETE FROM articles WHERE id = $1';
    const result = await this.db.query(query, [id]);
    
    return result.rowCount > 0;
  }

  mapRowToArticle(row) {
    const Article = require('../domain/Article');
    const article = new Article(row.id, row.type, row.description, row.created_at);
    return article;
  }
}

module.exports = ArticleRepository;
