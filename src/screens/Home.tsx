import { ThemeSwitcher } from '../theme/ThemeSwitcher';

export function Home({ onStart, activeThemeId, onThemeChange }: { onStart: () => void; activeThemeId: string; onThemeChange: (id: string) => void }) {
  return (
    <div className="riviera-shell">
      <div className="riviera-card">
        <div className="riviera-card__scroll">
          <div className="appbar">
            <div className="greet">
              <p className="hi">Welcome back</p>
              <p className="name">Traveler</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ThemeSwitcher activeId={activeThemeId} onChange={onThemeChange} />
              <span className="avatar">CM</span>
            </div>
          </div>

          <p className="riviera-eyebrow">What would you like to plan?</p>

          <button className="cap-primary-lt" onClick={onStart}>
            <div className="sky" />
            <div className="sun" />
            <div className="body">
              <span className="tag-lt">Most popular</span>
              <h3>Plan a trip</h3>
              <p>Describe what you have in mind — destination, budget, style — and leave with a complete plan.</p>
            </div>
          </button>

          <button className="cap-cta" onClick={onStart}>
            Start
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ marginTop: 8 }}>
            <CapRow title="Manage my bookings" description="Flights, hotels, activities in one place" />
            <CapRow title="Visas & formalities" description="Passport, vaccines, customs" />
            <CapRow title="On-trip assistant" description="Surprises, changes on the fly" />
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
          <circle cx="12" cy="12" r="9" stroke="var(--ink-dim)" strokeWidth="1.6" />
        </svg>
      </span>
      <div className="tx">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <span className="soon">Soon</span>
    </div>
  );
}
