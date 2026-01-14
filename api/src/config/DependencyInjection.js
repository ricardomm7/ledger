const ArticleRepository = require('../repositories/ArticleRepository');
const ArticleService = require('../services/ArticleService');
const ArticleController = require('../controllers/ArticleController');

class DependencyInjection {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.registerDefaults();
  }

  /**
   * Registra os serviços padrão
   */
  registerDefaults() {
    this.registerSingleton('articleRepository', () => new ArticleRepository());

    this.registerSingleton('articleService', (container) => {
      const articleRepository = container.get('articleRepository');
      return new ArticleService(articleRepository);
    });

    this.register('articleController', (container) => {
      const articleService = container.get('articleService');
      return new ArticleController(articleService);
    });
  }

  /**
   * Registra um serviço transiente (nova instância cada vez)
   */
  register(name, factory) {
    this.services.set(name, { factory, singleton: false });
  }

  /**
   * Registra um serviço singleton (mesma instância sempre)
   */
  registerSingleton(name, factory) {
    this.services.set(name, { factory, singleton: true });
  }

  /**
   * Obtém um serviço do container
   */
  get(name) {
    const service = this.services.get(name);
    
    if (!service) {
      throw new Error(`Serviço '${name}' não encontrado no container`);
    }

    // Se é singleton, verifica se já existe
    if (service.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Cria a instância
    const instance = service.factory(this);

    // Se é singleton, armazena
    if (service.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }
}

module.exports = DependencyInjection;
