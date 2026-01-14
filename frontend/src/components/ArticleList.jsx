import { ArticleCard } from './ArticleCard';

export function ArticleList({ articles, onDeleted, onArticleClick }) {
  if (!articles?.length) {
    return <p className="muted">Nenhum artigo registado.</p>;
  }

  return (
    <div className="grid">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          onDeleted={onDeleted}
          onClick={onArticleClick}
        />
      ))}
    </div>
  );
}
