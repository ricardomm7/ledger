import { useState } from 'react';
import { useArticles } from './hooks/useArticles';
import { ArticleList } from './components/ArticleList';
import { ArticleDetail } from './components/ArticleDetail';
import { CreateArticleModal } from './components/CreateArticleModal';

export default function App() {
  const { articles, loading, error, filter, setFilter, handleDeleted } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleOpenCreateModal = (event) => {
    event?.preventDefault();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleArticleCreated = (article) => {
    // Recarregar a lista ou adicionar o artigo manualmente
    window.location.reload(); // Solução simples, pode ser melhorada
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  // Se um artigo estiver selecionado, mostrar página de detalhes
  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={handleBack} />;
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-content">
          <div className="brand">LEDGER</div>
          <div className="topbar-actions">
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Filtrar por ID, type ou descrição..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button className="btn primary topbar-btn" onClick={handleOpenCreateModal}>
              Novo artigo
            </button>
          </div>
        </div>
      </div>

      <div className="page">
        <main className="content">
          {loading && <p className="muted">A carregar artigos...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <ArticleList 
              articles={articles} 
              onDeleted={handleDeleted}
              onArticleClick={handleArticleClick}
            />
          )}
        </main>
      </div>

      <CreateArticleModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreated={handleArticleCreated}
      />
    </>
  );
}
