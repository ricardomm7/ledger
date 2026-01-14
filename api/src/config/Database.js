const { Pool } = require('pg');

class Database {
  static instance = null;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    this.pool.on('error', (err) => {
      console.error('Erro não esperado no pool', err);
    });
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      //console.log('Query executada:', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = Database;
