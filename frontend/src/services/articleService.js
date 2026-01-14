import { request } from '../api';
import { toArticle, toArticleList, buildCreateArticleRequest } from '../dtos/articleDtos';

export async function listArticles() {
  const data = await request('/api/articles');
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
