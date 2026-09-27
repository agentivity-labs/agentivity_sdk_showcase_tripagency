/**
 * Free photo lookup shared by the app-registered widgets: Wikimedia Commons, no API key. The agent never
 * supplies image URLs or search words beyond a place name — the widget searches by text and ranks the
 * results here.
 */

interface Ranked {
  url: string;
  score: number;
}

const photoCache = new Map<string, Promise<Ranked[]>>();

// Commons search is by text only, so results are ranked on their file title: drop what never makes a
// pleasant hotel-page photo (transport, food, maps, posters, archives) and favour street/architecture.
const BAD_TITLE = /rame\b|rame[\s_.-]|wagon|locomotive|peinture|painting|tableau|beaux-arts|lithograph|gravure|engraving|drawing|dessin|metro|métro|gare|station|tram|train|rer\b|ligne|line \d|plan\b|map|carte|logo|poster|affiche|lunch|dinner|food|plat\b|menu|boulangerie|pâtisserie|restaurant|dessert|cuisine|plaque|panneau|sign|graffiti|tag\b|cimeti|covid|confin|manifest|grève|strike|protest|schema|diagram|carte postale|postcard|vers 19|18\d\d|19[0-4]\d/i;
// A recent year in the title is the best cheap signal that a photo is modern rather than an archive scan.
const RECENT_TITLE = /(?:^|\D)(?:20[01]\d|202\d)(?:\D|$)/;
// Wide establishing shots make the best cover: a title that says so outranks everything else.
const PANORAMA_TITLE = /skyline|panorama|panoramic|aerial|vue générale|vue aérienne|overview|cityscape|view of|vue sur/i;
// A search on a bare place name (the last-resort fallback below) pulls in Commons' huge, noisy "everything
// tagged with this place" pile — car shows, rallies, sports events, portraits — none of it a travel photo.
const OFF_TOPIC_TITLE = /rally|rallye|oldtimer|classic car|vintage car|car show|motorsport|racing|voiture ancienne|automobile ancienne|grand prix|football|soccer|match\b|stade\b|stadium|concert|festival|wedding|mariage|portrait|funeral|obsèques/i;
const score = (title: string) => Number(GOOD_TITLE.test(title)) + 2 * Number(RECENT_TITLE.test(title)) + 3 * Number(PANORAMA_TITLE.test(title));
const GOOD_TITLE = /rue|street|place|square|façade|facade|hôtel|hotel|vue|view|panorama|skyline|pont|bridge|église|church|building|immeuble|jardin|garden|quai|avenue|boulevard|cour|courtyard|musée|museum/i;
// A candidate this untargeted a search must clear to count as "representative": at least one travel-photo
// signal (a street/building/view word, a recent date, or an explicit wide shot) in its title.
const hasTravelSignal = (title: string) => GOOD_TITLE.test(title) || RECENT_TITLE.test(title) || PANORAMA_TITLE.test(title);

function ranked(query: string, { requireSignal = false }: { requireSignal?: boolean } = {}): Promise<Ranked[]> {
  const cacheKey = requireSignal ? `${query}\u0000strict` : query;
  const cached = photoCache.get(cacheKey);
  if (cached) return cached;
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '40',
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: '640',
    format: 'json',
    origin: '*',
  });
  const promise = fetch(`https://commons.wikimedia.org/w/api.php?${params}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((data) => {
      const pages = Object.values<any>(data?.query?.pages ?? {});
      return pages
        .filter((p) => {
          const i = p.imageinfo?.[0];
          return i && i.mime === 'image/jpeg' && i.width >= 1600 && i.width >= i.height * 1.2 && i.thumburl && !BAD_TITLE.test(p.title) && !OFF_TOPIC_TITLE.test(p.title) && (!requireSignal || hasTravelSignal(p.title));
        })
        .map((p) => ({ url: p.imageinfo[0].thumburl as string, score: score(p.title) }))
        .sort((a, b) => b.score - a.score);
    })
    .catch(() => [] as Ranked[]);
  photoCache.set(cacheKey, promise);
  return promise;
}

/** The best few photos for one search, most pleasant first. */
export async function fetchPhotos(query: string): Promise<string[]> {
  return (await ranked(query)).slice(0, 4).map((r) => r.url);
}

/**
 * The best photo from the first search that finds anything usable — queries are tried in order, most
 * specific first. Not merged across queries: a broad search ("Rome skyline") happily returns another
 * place with the same name, and a wide-shot bonus would let it beat the right, more specific result.
 */
export async function fetchBestPhoto(queries: string[]): Promise<string | undefined> {
  for (const [i, query] of queries.entries()) {
    if (!query.trim()) continue;
    // The last query is always the broadest (a bare place name, sometimes a whole country) — require a real
    // travel-photo signal there, or a search that only matched on the place name pulls in whatever Commons
    // happens to have filed under it, travel photo or not (a rally car, a football match, a portrait).
    const requireSignal = i === queries.length - 1 && queries.length > 1;
    const best = (await ranked(query, { requireSignal }))[0];
    if (best) return best.url;
  }
  return undefined;
}

export function gradientFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `linear-gradient(135deg, hsl(${30 + (h % 25)} 55% 68%), hsl(${20 + (h % 20)} 45% 48%))`;
}
