import { useState } from 'react';
import { createArticle, createBulkArticles } from '../services/articleService';

export function CreateArticleModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual', 'json', ou 'bulk'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formulário manual
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  // Upload JSON
  const [jsonContent, setJsonContent] = useState('');
  
  // Resultados do bulk upload
  const [bulkResults, setBulkResults] = useState(null);

  if (!isOpen) return null;

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Não enviar ID - backend gera automaticamente
      const article = await createArticle({ type, description });
      onCreated?.(article);
      resetForm();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = JSON.parse(jsonContent);
      
      // Validar estrutura básica
      if (!data.type || !data.description) {
        throw new Error('JSON deve conter "type" e "description"');
      }

      const payload = {
        type: data.type,
        description: data.description
      };

      // Só incluir ID se existir no JSON
      if (data.id) {
        payload.id = data.id;
      }

      const article = await createArticle(payload);
      
      onCreated?.(article);
      resetForm();
      onClose();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('JSON inválido: ' + err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonContent(event.target?.result || '');
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBulkResults(null);
    setLoading(true);
    try {
      const data = JSON.parse(jsonContent);
      
      // Validar estrutura básica
      if (!data.artigos || !Array.isArray(data.artigos)) {
        throw new Error('JSON deve conter um array "artigos"');
      }

      const results = await createBulkArticles(data.artigos);
      
      const successCount = results.success?.length || 0;
      const errorCount = results.errors?.length || 0;
      
      // Armazenar resultados para exibição
      setBulkResults(results);
      
      // Recarregar lista mesmo com erros parciais
      if (successCount > 0) {
        onCreated?.();
      }
      
      // Só fechar se não houver erros
      if (errorCount === 0) {
        resetForm();
        onClose();
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('JSON inválido: ' + err.message);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType('');
    setDescription('');
    setJsonContent('');
    setError('');
    setBulkResults(null);
    setActiveTab('manual');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog modal-dialog-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Novo Artigo</h3>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual
          </button>
          <button
            className={`modal-tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Único
          </button>
          <button
            className={`modal-tab ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            Upload em Massa
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'manual' ? (
            <form onSubmit={handleManualSubmit} className="create-form">
              <div className="form-field">
                <label htmlFor="type">Tipo</label>
                <input
                  id="type"
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Ex: Expense"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes do artigo..."
                  rows={4}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="modal-footer">
                <button type="button" className="btn ghost" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? 'A criar...' : 'Criar Artigo'}
                </button>
              </div>
            </form>
          ) : activeTab === 'json' ? (
            <form onSubmit={handleJsonSubmit} className="create-form">
              <div className="form-field">
                <label htmlFor="json-file">Carregar ficheiro JSON</label>
                <input
                  id="json-file"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="form-field">
                <label htmlFor="json-content">Ou cole o JSON aqui</label>
                <textarea
                  id="json-content"
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  placeholder='{"type": "Expense", "description": "Detalhes..."}'
                  rows={8}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="modal-footer">
                <button type="button" className="btn ghost" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? 'A criar...' : 'Criar Artigo'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="create-form">
              <div className="form-field">
                <label htmlFor="bulk-file">Carregar ficheiro JSON com múltiplos artigos</label>
                <input
                  id="bulk-file"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="form-field">
                <label htmlFor="bulk-content">Ou cole o JSON aqui</label>
                <textarea
                  id="bulk-content"
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  placeholder='{"artigos": [{"type": "Expense", "description": "..."}, ...]}'
                  rows={8}
                  required
                />
              </div>
              <p className="form-hint">O JSON deve conter um array "artigos" com os artigos a criar.</p>
              {error && <p className="error">{error}</p>}
              
              {bulkResults && (
                <div className="bulk-results">
                  <div className="bulk-summary">
                    <div className="summary-item success">
                      <span className="summary-icon">✓</span>
                      <span className="summary-text">
                        <strong>{bulkResults.success?.length || 0}</strong> criados
                      </span>
                    </div>
                    <div className="summary-item error">
                      <span className="summary-icon">✕</span>
                      <span className="summary-text">
                        <strong>{bulkResults.errors?.length || 0}</strong> erros
                      </span>
                    </div>
                  </div>
                  
                  {bulkResults.errors && bulkResults.errors.length > 0 && (
                    <div className="bulk-errors">
                      <div className="bulk-errors-header">
                        <span>Detalhes dos Erros</span>
                      </div>
                      <div className="bulk-errors-list">
                        {bulkResults.errors.map((err, idx) => (
                          <div key={idx} className="bulk-error-item">
                            <div className="error-badge">{idx + 1}</div>
                            <div className="error-content">
                              <div className="error-data">
                                {err.data?.type && <span className="error-field">Tipo: {err.data.type}</span>}
                                {err.data?.description && (
                                  <span className="error-field">
                                    Descrição: {err.data.description.substring(0, 50)}
                                    {err.data.description.length > 50 ? '...' : ''}
                                  </span>
                                )}
                              </div>
                              <div className="error-message">{err.error}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="modal-footer">
                <button type="button" className="btn ghost" onClick={handleClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn primary" disabled={loading}>
                  {loading ? 'A carregar...' : 'Criar em Massa'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
