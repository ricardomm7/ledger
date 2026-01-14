import { useEffect, useState } from 'react';
import { listArticles, searchArticles } from '../services/articleService';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carrega artigos na montagem do componente
  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const data = await listArticles();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Pesquisa por campo específico
  const performSearch = async (filters) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchArticles(filters);
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega todos os artigos
  const resetSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove um artigo da lista após deleção
  const handleDeleted = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    articles,
    loading,
    error,
    handleDeleted,
    performSearch,
    resetSearch,
  };
}
