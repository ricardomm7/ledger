import { useState } from 'react';
import { useArticles } from './hooks/useArticles';
import { ArticleList } from './components/ArticleList';
import { ArticleDetail } from './components/ArticleDetail';
import { CreateArticleModal } from './components/CreateArticleModal';

export default function App() {
  const { articles, loading, error, filter, setFilter, handleDeleted } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calcular paginação
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  // Reset para página 1 quando o filtro mudar
  const handleFilterChange = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };

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
              onChange={(e) => handleFilterChange(e.target.value)}
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
            <>
              <ArticleList 
                articles={paginatedArticles} 
                onDeleted={handleDeleted}
                onArticleClick={handleArticleClick}
              />
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="btn ghost pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    « Anterior
                  </button>
                  
                  <div className="pagination-info">
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                    <span className="pagination-total">({articles.length} artigos)</span>
                  </div>
                  
                  <button 
                    className="btn ghost pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima »
                  </button>
                </div>
              )}
            </>
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
