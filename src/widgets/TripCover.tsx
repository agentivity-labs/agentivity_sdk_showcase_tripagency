import { useEffect, useState } from 'react';
import { fetchBestPhoto, gradientFor } from './commonsPhotos';

/**
 * In-chat trip cover — the app-registered counterpart to the "TripCover" custom widget declared on the
 * Trip Manager's `custom_widgets` config, shown once when the trip is created.
 *
 * Agent props: `{ destination, startDate, endDate, travelers, coverImageQuery }`. The photo is looked up
 * here (free Wikimedia Commons search, no API key) from the agent's own search phrase (the most specific, tried first), then broader fallbacks, keeping the best-ranked result — or a warm gradient if nothing usable comes back.
 */

function formatRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return '';
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' });
  const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const nights = Math.max(1, Math.round((e.getTime() - s.getTime()) / 86_400_000));
  const range = sameMonth ? `${day.format(s)}–${day.format(e)} ${monthYear.format(e)}` : `${day.format(s)} ${monthYear.format(s)} – ${day.format(e)} ${monthYear.format(e)}`;
  return `${range} · ${nights} ${nights > 1 ? 'nights' : 'night'}`;
}

// The agent's phrase minus its mood words ("Rome Colosseum sunset" -> "Rome Colosseum"): a named landmark is what keeps
// "Rome" from matching another Rome. Broader searches are only fallbacks.
const MOOD_WORDS = /(sunset|sunrise|dusk|dawn|night|golden hour|view|views|skyline|panorama|scenic|beautiful|aerial|at|in|the|of)/gi;

const findCover = (destination: string, hint: string) => {
  const core = hint.replace(MOOD_WORDS, '').replace(/s+/g, ' ').trim();
  return fetchBestPhoto([core, hint, `${destination} skyline`, destination]);
};

export function TripCover(props: Record<string, unknown>) {
  const destination = typeof props['destination'] === 'string' ? props['destination'] : '';
  const startDate = typeof props['startDate'] === 'string' ? props['startDate'] : '';
  const endDate = typeof props['endDate'] === 'string' ? props['endDate'] : '';
  const travelers = typeof props['travelers'] === 'number' ? props['travelers'] : undefined;
  const hint = typeof props['coverImageQuery'] === 'string' ? props['coverImageQuery'] : '';

  const [photo, setPhoto] = useState<string>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    void findCover(destination, hint).then((url) => {
      if (alive) setPhoto(url);
    });
    return () => {
      alive = false;
    };
  }, [destination, hint]);

  const dates = formatRange(startDate, endDate);
  const who = travelers != null ? `${travelers} ${travelers > 1 ? 'travelers' : 'traveler'}` : '';

  return (
    <div style={{ position: 'relative', width: '100%', minWidth: 250, height: 190, borderRadius: 16, overflow: 'hidden', border: '1.5px solid var(--line, #EDEBE5)', background: gradientFor(destination || 'trip') }}>
      {photo && (
        <img
          src={photo}
          alt={destination}
          onLoad={() => setLoaded(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,26,29,0.78) 0%, rgba(23,26,29,0.15) 55%, rgba(23,26,29,0) 100%)' }} />
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, color: '#fff' }}>
        {(dates || who) && (
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold, #E3A94F)', marginBottom: 4 }}>
            {[dates, who].filter(Boolean).join(' · ')}
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1.05, fontWeight: 400 }}>{destination}</div>
      </div>
    </div>
  );
}
