import { useState, useEffect, useRef } from 'react';
import { useArticles } from './hooks/useArticles';
import { ArticleList } from './components/ArticleList';
import { ArticleDetail } from './components/ArticleDetail';
import { CreateArticleModal } from './components/CreateArticleModal';

export default function App() {
  const { articles, loading, error, handleDeleted, performSearch, resetSearch } = useArticles();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const filterDropdownRef = useRef(null);
  const itemsPerPage = 20;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFilterDropdown]);

  // Aplicar pesquisa específica
  const applySpecificFilter = async () => {
    if (filterType === 'all' || !filterValue.trim()) {
      await resetSearch();
      return;
    }

    const filters = {};
    filters[filterType] = filterValue;
    await performSearch(filters);
    setCurrentPage(1);
  };

  // Executar pesquisa quando filterValue mudar
  const handleSpecificFilterChange = (value) => {
    setFilterValue(value);
  };

  // Calcular paginação
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);

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
            <div className="filter-group" ref={filterDropdownRef}>
              <button 
                className="btn ghost filter-toggle-btn"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                {filterType !== 'all' && filterValue && (
                  <span className="filter-badge"></span>
                )}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 2h16v2H0V2zm3 5h10v2H3V7zm3 5h4v2H6v-2z"/>
                </svg>
                Filtrar
              </button>
              
              {showFilterDropdown && (
                <div className="filter-dropdown">
                  <div className="filter-options">
                    <button 
                      className={`filter-option ${filterType === 'all' ? 'active' : ''}`}
                      onClick={async () => { 
                        setFilterType('all'); 
                        setFilterValue('');
                        await resetSearch();
                      }}
                    >
                      Todos os campos
                    </button>
                    <button 
                      className={`filter-option ${filterType === 'id' ? 'active' : ''}`}
                      onClick={() => { setFilterType('id'); setFilterValue(''); }}
                    >
                      ID
                    </button>
                    <button 
                      className={`filter-option ${filterType === 'type' ? 'active' : ''}`}
                      onClick={() => { setFilterType('type'); setFilterValue(''); }}
                    >
                      Tipo
                    </button>
                    <button 
                      className={`filter-option ${filterType === 'description' ? 'active' : ''}`}
                      onClick={() => { setFilterType('description'); setFilterValue(''); }}
                    >
                      Descrição
                    </button>
                  </div>
                  
                  {filterType !== 'all' && (
                    <div className="filter-input-group">
                      <input 
                        type="text" 
                        className="filter-input-dropdown" 
                        placeholder={`Pesquisar por ${filterType === 'id' ? 'ID' : filterType === 'type' ? 'tipo' : 'descrição'}...`}
                        value={filterValue}
                        onChange={(e) => handleSpecificFilterChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applySpecificFilter()}
                        autoFocus
                      />
                      <button 
                        className="btn primary filter-search-btn"
                        onClick={applySpecificFilter}
                      >
                        Pesquisar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
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
