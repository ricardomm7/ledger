const IArticleRepository = require('../abstractions/IArticleRepository');

class ArticleRepository extends IArticleRepository {
  constructor() {
    super();
    // Simulação de uma base de dados em memória
    this.ledgers = new Map();
    this.nextId = 1;
  }

  async create(ledger) {
    ledger.id = this.nextId++;
    this.ledgers.set(ledger.id, ledger);
    return ledger;
  }

  async findById(id) {
    return this.ledgers.get(Number(id)) || null;
  }

  async findAll() {
    return Array.from(this.ledgers.values());
  }

  async update(id, ledger) {
    const existingLedger = this.ledgers.get(Number(id));
    if (!existingLedger) return null;
    
    ledger.id = Number(id);
    this.ledgers.set(Number(id), ledger);
    return ledger;
  }

  async delete(id) {
    return this.ledgers.delete(Number(id));
  }
}

module.exports = ArticleRepository;
