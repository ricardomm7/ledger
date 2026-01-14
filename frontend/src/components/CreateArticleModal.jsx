import { useState } from 'react';
import { createArticle } from '../services/articleService';

export function CreateArticleModal({ isOpen, onClose, onCreated }) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' ou 'json'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formulário manual
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  // Upload JSON
  const [jsonContent, setJsonContent] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const article = await createArticle({ id: Date.now(), type, description });
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

      const article = await createArticle({
        id: data.id || Date.now(),
        type: data.type,
        description: data.description
      });
      
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

  const resetForm = () => {
    setType('');
    setDescription('');
    setJsonContent('');
    setError('');
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
            Upload JSON
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
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
