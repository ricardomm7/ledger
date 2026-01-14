// Data Transfer Objects and mappers for Articles

export function toArticle(dto) {
  if (!dto) return null;
  return {
    id: dto.id,
    type: dto.type,
    description: dto.description,
    createdAt: dto.createdAt || dto.created_at || null,
  };
}

export function toArticleList(dtos) {
  return Array.isArray(dtos) ? dtos.map(toArticle).filter(Boolean) : [];
}

export function buildCreateArticleRequest({ id, type, description }) {
  return {
    id,
    type,
    description,
  };
}
