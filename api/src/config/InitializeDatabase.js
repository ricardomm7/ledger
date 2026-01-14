const Database = require('./Database');


async function initializeDatabase() {
  const db = Database.getInstance();

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Tabelas criadas com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;
