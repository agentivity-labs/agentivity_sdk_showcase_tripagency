import { themes, type RivieraTheme } from './themes';

/** A row of small swatch buttons — one per entry in `themes.ts` — picking the active `RivieraTheme`. */
export function ThemeSwitcher({ activeId, onChange }: { activeId: string; onChange: (id: string) => void }) {
  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Visual theme">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={t.id === activeId}
          aria-label={`${t.name} — ${t.tagline}`}
          title={`${t.name} — ${t.tagline}`}
          className="theme-switcher__swatch"
          data-active={t.id === activeId || undefined}
          onClick={() => onChange(t.id)}
          style={{ background: swatchGradient(t) }}
        />
      ))}
    </div>
  );
}

function swatchGradient(t: RivieraTheme) {
  return `linear-gradient(135deg, ${t.tokens.gold} 0%, ${t.tokens.coral} 100%)`;
}
