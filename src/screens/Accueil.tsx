export function Accueil({ onStart }: { onStart: () => void }) {
  return (
    <div className="riviera-shell">
      <div className="riviera-card">
        <div className="riviera-card__scroll">
          <div className="appbar">
            <div className="greet">
              <p className="hi">Bon retour</p>
              <p className="name">Voyageur</p>
            </div>
            <span className="avatar">CM</span>
          </div>

          <p className="riviera-eyebrow">Que veux-tu organiser ?</p>

          <button className="cap-primary-lt" onClick={onStart}>
            <div className="sky" />
            <div className="sun" />
            <div className="body">
              <span className="tag-lt">Le plus demandé</span>
              <h3>Planifier un voyage</h3>
              <p>Décris ton envie — destination, budget, style — et repars avec un plan complet.</p>
            </div>
          </button>

          <button className="cap-cta" onClick={onStart}>
            Commencer
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ marginTop: 8 }}>
            <CapRow title="Gérer mes réservations" description="Vols, hôtels, activités au même endroit" />
            <CapRow title="Formalités & visas" description="Passeport, vaccins, douane" />
            <CapRow title="Assistant sur place" description="Imprévus, changements en direct" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CapRow({ title, description }: { title: string; description: string }) {
  return (
    <div className="cap-row-lt">
      <span className="ic">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#9CA0A6" strokeWidth="1.6" />
        </svg>
      </span>
      <div className="tx">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <span className="soon">Bientôt</span>
    </div>
  );
}
