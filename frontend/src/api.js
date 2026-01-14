import { API_URL } from './config';

export async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let message = 'Erro de rede';
    try {
      const data = await res.json();
      message = data?.error || data?.message || message;
    } catch (_) {
      /* ignore */
    }
    throw new Error(message);
  }

  return res.json();
}

export async function getHealth() {
  return request('/health');
}
