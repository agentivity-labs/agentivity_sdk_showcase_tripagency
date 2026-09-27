import { useEffect, useState } from 'react';
import { ArtifactCard } from '@agentivity-labs/sdk-react';
import { fetchPhotos, gradientFor } from './commonsPhotos';

interface Hotel {
  name: string;
  neighborhood?: string;
  reason?: string;
  pricePerNight?: number;
  total?: number;
  currency?: string;
  recommended?: boolean;
  city?: string;
}

/**
 * In-chat hotel picker — the app-registered counterpart to the "HotelChoice" custom widget declared
 * on the Hotel Specialist's `custom_widgets` config. Shows the specialist's top picks as cards, each
 * with a photo carousel, and reports the traveler's choice back to the agent via `__onSubmit`.
 *
 * Agent props: `{ hotels: [{ name, neighborhood, reason, pricePerNight, total, currency, recommended,
 * city }] }`. The agent never supplies image URLs or search words: the widget searches Wikimedia
 * Commons — free, no API key — for the neighborhood in its city (the city keeps "Quartier Latin" from
 * matching Quebec). The hotels
 * are simulated, so photos illustrate the area, not the property.
 */

function Carousel({ name, photoQuery }: { name: string; photoQuery: string }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    void fetchPhotos(photoQuery).then((urls) => {
      if (alive) setPhotos(urls);
    });
    return () => {
      alive = false;
    };
  }, [photoQuery]);

  const count = photos.length;
  const arrow = (label: string, side: 'left' | 'right', delta: number) => (
    <button
      type="button"
      aria-label={label}
      onClick={() => setIndex((index + delta + count) % count)}
      style={{
        position: 'absolute',
        top: '50%',
        [side]: 8,
        transform: 'translateY(-50%)',
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: 'none',
        background: 'rgba(255,255,255,0.85)',
        color: 'var(--ink, #171A1D)',
        cursor: 'pointer',
        fontSize: 14,
        lineHeight: '28px',
        padding: 0,
      }}
    >
      {side === 'left' ? '‹' : '›'}
    </button>
  );

  return (
    <div style={{ position: 'relative', height: 150, borderRadius: 12, overflow: 'hidden', background: gradientFor(name) }}>
      {count > 0 && <img src={photos[index]} alt={`${name} — photo ${index + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
      {count > 1 && (
        <>
          {arrow('Previous photo', 'left', -1)}
          {arrow('Next photo', 'right', 1)}
          <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {photos.map((_, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === index ? 'var(--paper, #fff)' : 'rgba(255,255,255,0.55)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function HotelChoice(props: Record<string, unknown>) {
  const hotels = Array.isArray(props['hotels']) ? (props['hotels'] as Hotel[]).filter((h) => h && typeof h.name === 'string') : [];
  const onSubmit = typeof props['__onSubmit'] === 'function' ? (props['__onSubmit'] as (response: string) => void) : undefined;
  const [chosen, setChosen] = useState<number>();

  function choose(i: number) {
    const h = hotels[i];
    if (!onSubmit || chosen !== undefined || !h) return;
    setChosen(i);
    const cur = h.currency ?? 'EUR';
    const price = h.pricePerNight != null ? ` (${h.pricePerNight} ${cur}/night${h.total != null ? `, ${h.total} ${cur} total` : ''})` : '';
    onSubmit(`I choose: ${h.name}${price}.`);
  }

  return (
    <ArtifactCard title="Hotels" type="Selection">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {hotels.map((h, i) => {
          const cur = h.currency ?? 'EUR';
          const isChosen = chosen === i;
          const locked = chosen !== undefined && !isChosen;
          const query = [h.neighborhood, h.city].filter(Boolean).join(' ').trim() || h.name;
          const mapUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${h.name} ${h.neighborhood ?? ''}`.trim())}`;
          return (
            <div key={i} style={{ opacity: locked ? 0.45 : 1, transition: 'opacity 0.2s', paddingTop: i > 0 ? 16 : 0, borderTop: i > 0 ? '1px solid var(--line, #EDEBE5)' : undefined }}>
              <Carousel name={h.name} photoQuery={query} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 400, lineHeight: 1.15, color: 'var(--ink, #171A1D)' }}>{h.name}</span>
                {h.recommended && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'var(--gold, #E3A94F)', color: 'var(--ink, #171A1D)', whiteSpace: 'nowrap' }}>
                    Recommended
                  </span>
                )}
              </div>
              {h.neighborhood && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-dim, #9CA0A6)', marginTop: 4 }}>{h.neighborhood}</div>}
              {h.reason && <div style={{ fontSize: 13, color: 'var(--ink-soft, #4E5359)', margin: '8px 0' }}>{h.reason}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '6px 0 10px' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-dim, #9CA0A6)', fontVariantNumeric: 'tabular-nums' }}>{h.pricePerNight != null ? `${h.pricePerNight} ${cur} / night` : ''}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontVariantNumeric: 'tabular-nums', color: 'var(--ink, #171A1D)' }}>{h.total != null ? `${h.total} ${cur}` : ''}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={chosen !== undefined}
                  onClick={() => choose(i)}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: 999,
                    border: 'none',
                    background: isChosen ? 'var(--ink, #171A1D)' : 'var(--gold, #E3A94F)',
                    color: isChosen ? 'var(--paper, #fff)' : 'var(--ink, #171A1D)',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: chosen === undefined ? 'pointer' : 'default',
                  }}
                >
                  {isChosen ? '✓ Chosen' : 'Choose this hotel'}
                </button>
                <a href={mapUrl} target="_blank" rel="noreferrer noopener" style={{ fontSize: 12, color: 'var(--ink-soft, #4E5359)', whiteSpace: 'nowrap' }}>
                  View on map
                </a>
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: 11, color: 'var(--ink-dim, #9CA0A6)' }}>Illustrative photos of the area — fictional hotels (demo).</div>
      </div>
    </ArtifactCard>
  );
}
