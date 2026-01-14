import { useState } from 'react';
import { deleteArticle } from '../services/articleService';
import { useModal } from '../hooks/useModal';
import { ConfirmModal } from './ConfirmModal';

export function ArticleCard({ article, onDeleted, onClick }) {
  const [deleting, setDeleting] = useState(false);
  const { isOpen, open, confirm, cancel } = useModal();

  const handleDelete = (e) => {
    e.stopPropagation(); // Evitar que o clique abra a página de detalhes
    open(
      'Apagar artigo',
      `Tem a certeza que quer apagar "${article.type}"?`,
      performDelete,
      cancel
    );
  };

  const performDelete = async () => {
    setDeleting(true);
    try {
      await deleteArticle(article.id);
      onDeleted?.(article.id);
    } catch (err) {
      alert('Erro ao apagar: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCardClick = () => {
    onClick?.(article);
  };

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <div className="card-header">
          <div className="card-title">{article.type}</div>
          <button 
            className="delete-btn" 
            onClick={handleDelete} 
            disabled={deleting}
            title="Apagar"
          >
            🗑️
          </button>
        </div>
        <div className="card-desc">{article.description}</div>
        <div className="card-meta">ID {article.id} · {new Date(article.createdAt).toLocaleString()}</div>
      </div>

      <ConfirmModal 
        isOpen={isOpen} 
        title="Apagar artigo"
        message={`Tem a certeza que quer apagar "${article.type}"?`}
        onConfirm={performDelete}
        onCancel={cancel}
      />
    </>
  );
}
