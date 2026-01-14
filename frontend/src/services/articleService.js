import { request } from '../api';
import { toArticle, toArticleList, buildCreateArticleRequest } from '../dtos/articleDtos';

export async function listArticles() {
  const data = await request('/api/articles');
  return toArticleList(data?.data || data);
}

export async function searchArticles(filters) {
  const params = new URLSearchParams();
  if (filters.id) params.append('id', filters.id);
  if (filters.type) params.append('type', filters.type);
  if (filters.description) params.append('description', filters.description);
  
  const data = await request(`/api/articles/search?${params.toString()}`);
  return toArticleList(data?.data || data);
}

export async function createArticle(payload) {
  const body = buildCreateArticleRequest(payload);
  const data = await request('/api/articles', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return toArticle(data?.data || data);
}

export async function deleteArticle(id) {
  await request(`/api/articles/${id}`, { method: 'DELETE' });
  return true;
}

export async function createBulkArticles(articles) {
  const data = await request('/api/articles/bulk', {
    method: 'POST',
    body: JSON.stringify({ artigos: articles }),
  });
  return data?.data || data;
}
