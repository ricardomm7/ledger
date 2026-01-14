import { useEffect, useState, useMemo } from 'react';
import { listArticles } from '../services/articleService';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

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

  // Remove um artigo da lista após deleção
  const handleDeleted = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // Filtra artigos por ID, type ou descrição
  const filteredArticles = useMemo(() => {
    if (!filter.trim()) return articles;
    
    const searchTerm = filter.toLowerCase();
    return articles.filter((article) => {
      const matchesId = article.id?.toString().toLowerCase().includes(searchTerm);
      const matchesType = article.type?.toLowerCase().includes(searchTerm);
      const matchesDescription = article.description?.toLowerCase().includes(searchTerm);
      return matchesId || matchesType || matchesDescription;
    });
  }, [articles, filter]);

  return {
    articles: filteredArticles,
    loading,
    error,
    filter,
    setFilter,
    handleDeleted,
  };
}
