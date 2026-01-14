import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function BulkPrintModal({ isOpen, onClose, articles }) {
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Reset quando o modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      setSelectedArticles([]);
      setSelectAll(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(a => a.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleArticle = (id) => {
    setSelectedArticles(prev => {
      if (prev.includes(id)) {
        return prev.filter(articleId => articleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handlePrint = () => {
    if (selectedArticles.length === 0) {
      alert('Por favor, selecione pelo menos um artigo para imprimir.');
      return;
    }
    window.print();
  };

  const articlesToPrint = articles.filter(a => selectedArticles.includes(a.id));

  return (
    <>
      {/* Modal overlay (não imprime) */}
      <div className="modal-overlay no-print" onClick={onClose}>
        <div className="modal-dialog modal-dialog-large bulk-print-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Impressão em Massa</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div className="select-all-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
                <span>Selecionar todos ({articles.length} artigos)</span>
              </label>
              <span className="selected-count">
                {selectedArticles.length} selecionado{selectedArticles.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="articles-selection-list">
              {articles.map(article => (
                <label key={article.id} className="article-checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.id)}
                    onChange={() => toggleArticle(article.id)}
                  />
                  <div className="article-checkbox-info">
                    <span className="article-checkbox-id">{article.id}</span>
                    <span className="article-checkbox-type">{article.type}</span>
                    <span className="article-checkbox-desc">{article.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn ghost" onClick={onClose}>
              Cancelar
            </button>
            <button 
              className="btn primary" 
              onClick={handlePrint}
              disabled={selectedArticles.length === 0}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
                <path d="M4 0h8v3H4V0zm10 4H2a2 2 0 00-2 2v5h3v5h10v-5h3V6a2 2 0 00-2-2zm-1 10H3V9h10v5zm1-6.5a.5.5 0 110-1 .5.5 0 010 1z"/>
              </svg>
              Imprimir ({selectedArticles.length})
            </button>
          </div>
        </div>
      </div>

      {/* Área de impressão (só aparece ao imprimir) */}
      <div className="print-only">
        <div className="print-grid">
          {articlesToPrint.map(article => (
            <div key={article.id} className="print-qr-card">
              <div className="print-qr-code">
                <QRCodeSVG 
                  value={article.id}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="print-qr-info">
                <div className="print-qr-id">{article.id}</div>
                <div className="print-qr-type">{article.type}</div>
                <div className="print-qr-description">{article.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
