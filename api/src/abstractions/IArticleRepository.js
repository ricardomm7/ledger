class IArticleRepository {
  async create(article) {
    throw new Error('create() deve ser implementado');
  }

  async findById(id) {
    throw new Error('findById() deve ser implementado');
  }

  async findAll() {
    throw new Error('findAll() deve ser implementado');
  }

  async delete(id) {
    throw new Error('delete() deve ser implementado');
  }
  
  async getNextId() {
    throw new Error('getNextId() deve ser implementado');
  }
}

module.exports = IArticleRepository;
