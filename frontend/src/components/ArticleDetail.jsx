import { QRCodeSVG } from 'qrcode.react';

export function ArticleDetail({ article, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  if (!article) {
    return (
      <>
        <div className="topbar">
          <div className="topbar-content">
            <div className="brand">LEDGER</div>
            <button className="btn ghost topbar-btn" onClick={onBack}>
              ← Voltar
            </button>
          </div>
        </div>
        
        <div className="page">
          <p className="muted">Artigo não encontrado</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-content">
          <div className="brand">LEDGER</div>
          <div className="topbar-actions">
            <button className="btn ghost topbar-btn" onClick={onBack}>
              ← Voltar
            </button>
            <button className="btn primary topbar-btn" onClick={handlePrint}>
              Imprimir Etiqueta
            </button>
          </div>
        </div>
      </div>

      <div className="page">
        <div className="detail-content">
          <div className="detail-info">
            <h1 className="detail-title">{article.type}</h1>
            <p className="detail-description">{article.description}</p>
            
            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">ID:</span>
                <span className="meta-value">{article.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Criado em:</span>
                <span className="meta-value">
                  {new Date(article.createdAt).toLocaleString('pt-PT', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-qr">
            <div className="qr-container">
              <QRCodeSVG 
                value={article.id.toString()} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="qr-label">QR Code: ID {article.id}</p>
          </div>
        </div>
      </div>

      {/* Área de impressão */}
      <div className="print-only">
        <div className="print-grid">
          <div className="print-qr-card">
            <div className="print-qr-code">
              <QRCodeSVG 
                value={article.id.toString()}
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
        </div>
      </div>
    </>
  );
}
