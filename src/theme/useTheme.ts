import { useCallback, useEffect, useState } from 'react';
import { defaultThemeId, themes, type RivieraTheme } from './themes';

const STORAGE_KEY = 'riviera-theme';

// One entry per RivieraTheme['tokens'] key → the CSS custom property it drives (declared with
// their Riviera defaults in index.css's bare :root, so a theme that never loads still renders).
// Applying a theme's tokens through these — rather than a `:root[data-theme="<id>"] { … }` block
// per theme in index.css — is what lets `themes.ts` offer every SDK preset (14 themes and
// counting) without a matching hand-written CSS block for each: one map, generic for any theme.
const TOKEN_CSS_VARS: Record<keyof RivieraTheme['tokens'], string> = {
  ink: '--ink',
  inkSoft: '--ink-soft',
  inkDim: '--ink-dim',
  line: '--line',
  paper: '--paper',
  paperSoft: '--paper-soft',
  gold: '--gold',
  coral: '--coral',
  fontDisplay: '--font-display',
  fontBody: '--font-body',
  fontMono: '--font-mono',
  heroSky: '--hero-sky',
  heroSun: '--hero-sun',
  radiusCard: '--radius-card',
  radiusPill: '--radius-pill',
  radiusBubble: '--radius-bubble',
  radiusSmall: '--radius-small',
};

function readStoredThemeId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && themes.some((t) => t.id === stored) ? stored : defaultThemeId;
  } catch {
    // Private browsing / blocked storage: fall back silently, nothing persists this session.
    return defaultThemeId;
  }
}

/**
 * The showcase's active visual identity (see `themes.ts`) — persisted per browser so a reload
 * keeps whatever the visitor last picked. Writes every token in `theme.tokens` as an inline CSS
 * custom property on <html>, which — because an inline style always wins over a stylesheet rule
 * of equal or lower specificity — overrides index.css's `:root` defaults regardless of which
 * theme is active; components never touch these properties directly.
 */
export function useTheme(): { theme: RivieraTheme; setThemeId: (id: string) => void } {
  const [themeId, setThemeIdState] = useState(readStoredThemeId);
  const theme = themes.find((t) => t.id === themeId) ?? themes[0];

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.style.colorScheme = theme.colorScheme;
    for (const [key, cssVar] of Object.entries(TOKEN_CSS_VARS) as [keyof RivieraTheme['tokens'], string][]) {
      root.style.setProperty(cssVar, theme.tokens[key]);
    }
  }, [theme]);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Nothing to persist across reloads in this browser — the in-memory choice still applies.
    }
  }, []);

  return { theme, setThemeId };
}
