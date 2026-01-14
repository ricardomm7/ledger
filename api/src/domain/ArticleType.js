class ArticleType {
  constructor(value) {
    this.validate(value);
    this._value = value;
  }

  validate(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Tipo do artigo é obrigatório e deve ser uma string');
    }

    if (value.length > 50) {
      throw new Error('Tipo do artigo não pode exceder 50 caracteres');
    }
  }

  getValue() {
    return this._value;
  }

  toString() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof ArticleType)) {
      return false;
    }
    return this._value === other._value;
  }
}

module.exports = ArticleType;
