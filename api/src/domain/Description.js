class Description {
  constructor(value) {
    this.validate(value);
    this._value = value;
  }

  validate(value) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error('Descrição do artigo é obrigatória e deve ser uma string');
    }

    if (value.length > 255) {
      throw new Error('Descrição do artigo não pode exceder 255 caracteres');
    }
  }

  getValue() {
    return this._value;
  }

  toString() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof Description)) {
      return false;
    }
    return this._value === other._value;
  }
}

module.exports = Description;
