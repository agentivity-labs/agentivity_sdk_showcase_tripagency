import {
  dark as darkPreset,
  ledger as ledgerPreset,
  light as lightPreset,
  riviera as rivieraPreset,
  techno as technoPreset,
  type ArtifactsThemeData,
} from '@agentivity-labs/sdk-react';

/**
 * One selectable visual identity for this showcase: the `ArtifactsThemeData` handed to the SDK's
 * `ArtifactsThemeProvider` (drives every widget's own theming, including its own `cardRadius` —
 * shape, not just color, varies per theme there too) plus this app's own raw CSS custom properties
 * (`tokens`) applied by `useTheme`. Both halves of one theme are defined together here so they can
 * never drift out of sync with each other.
 *
 * `artifactsTheme` below is always one of the SDK's own presets (`light`/`dark`/`riviera`/
 * `techno`/`ledger`, from `theme-presets.ts` — the same five the Flutter SDK's `AgArtifactsThemes`
 * offers), not redefined here: that's the SDK-portable half of each theme (widget card
 * color/shape/font), shared across every app built on the SDK. `tokens` below is what's genuinely
 * specific to THIS app — its own chat bubbles, buttons, and "Plan a trip" hero card have no SDK
 * widget equivalent, so there is nothing to import for them.
 */
export interface RivieraTheme {
  id: string;
  /** Shown in the theme switcher. */
  name: string;
  /** One line shown as the switcher option's tooltip/description. */
  tagline: string;
  colorScheme: 'light' | 'dark';
  artifactsTheme: ArtifactsThemeData;
  tokens: {
    ink: string;
    inkSoft: string;
    inkDim: string;
    line: string;
    paper: string;
    paperSoft: string;
    /** Primary accent — eyebrow labels, badges, selected states, the warm end of the avatar/hero gradient. */
    gold: string;
    /** Secondary accent — also doubles as the semantic "attention" color (error text, an in-progress team member). */
    coral: string;
    fontDisplay: string;
    fontBody: string;
    fontMono: string;
    /** The Home screen's "Plan a trip" hero card: a sky gradient behind its glowing "sun". */
    heroSky: string;
    heroSun: string;
    /** Corner radius roles — this app's own shape language, independent of `artifactsTheme.cardRadius`
     *  (which only shapes SDK widget cards). Any valid CSS length; '999px' reads as a full stadium
     *  pill regardless of the element's height. */
    radiusCard: string;
    radiusPill: string;
    radiusBubble: string;
    radiusSmall: string;
  };
}

const riviera: RivieraTheme = {
  id: 'riviera',
  name: 'Riviera',
  tagline: 'Sun-warmed coastal travel agency, on paper',
  colorScheme: 'light',
  artifactsTheme: rivieraPreset,
  tokens: {
    ink: '#171A1D',
    inkSoft: '#4E5359',
    inkDim: '#9CA0A6',
    line: '#EDEBE5',
    paper: '#FFFFFF',
    paperSoft: '#F5F3EE',
    gold: '#E3A94F',
    coral: '#F1633B',
    fontDisplay: '"Instrument Serif", serif',
    fontBody: '"Karla", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    heroSky: 'linear-gradient(180deg, #14313b 0%, #3c6e63 40%, #c88148 78%, #efb871 100%)',
    heroSun: 'radial-gradient(circle, rgba(255, 235, 196, 0.92) 0%, rgba(255, 225, 170, 0.3) 52%, transparent 74%)',
    radiusCard: '28px',
    radiusPill: '999px',
    radiusBubble: '16px',
    radiusSmall: '10px',
  },
};

const light: RivieraTheme = {
  id: 'light',
  name: 'Light',
  tagline: 'Clean neutral default, indigo accent',
  colorScheme: 'light',
  artifactsTheme: lightPreset,
  tokens: {
    ink: '#14161A',
    inkSoft: '#52565E',
    inkDim: '#9498A0',
    line: '#E4E6EA',
    paper: '#FFFFFF',
    paperSoft: '#F6F7F9',
    gold: '#4F46E5',
    coral: '#E4483D',
    fontDisplay: '"Manrope", sans-serif',
    fontBody: '"Karla", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    heroSky: 'linear-gradient(180deg, #1E1B4B 0%, #4F46E5 55%, #A5B4FC 100%)',
    heroSun: 'radial-gradient(circle, rgba(165, 180, 252, 0.9) 0%, rgba(79, 70, 229, 0.35) 52%, transparent 74%)',
    radiusCard: '18px',
    radiusPill: '999px',
    radiusBubble: '14px',
    radiusSmall: '8px',
  },
};

const dark: RivieraTheme = {
  id: 'dark',
  name: 'Dark',
  tagline: 'Clean neutral default, dark surface',
  colorScheme: 'dark',
  artifactsTheme: darkPreset,
  tokens: {
    ink: '#F2F3F5',
    inkSoft: '#B7BAC2',
    inkDim: '#74777F',
    line: '#2A2D33',
    paper: '#1A1C20',
    paperSoft: '#121316',
    gold: '#818CF8',
    coral: '#F87171',
    fontDisplay: '"Manrope", sans-serif',
    fontBody: '"Karla", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    heroSky: 'linear-gradient(180deg, #121316 0%, #312E81 55%, #4F46E5 100%)',
    heroSun: 'radial-gradient(circle, rgba(129, 140, 248, 0.85) 0%, rgba(79, 70, 229, 0.35) 52%, transparent 74%)',
    radiusCard: '18px',
    radiusPill: '999px',
    radiusBubble: '14px',
    radiusSmall: '8px',
  },
};

const techno: RivieraTheme = {
  id: 'techno',
  name: 'Techno',
  tagline: 'Modern and vibrant, kept in check',
  colorScheme: 'dark',
  artifactsTheme: technoPreset,
  tokens: {
    ink: '#E8EAED',
    inkSoft: '#A7ACB5',
    inkDim: '#6B707A',
    line: '#262A31',
    paper: '#16181C',
    paperSoft: '#0D0E10',
    gold: '#7C7CFF',
    coral: '#34D5C4',
    fontDisplay: '"JetBrains Mono", monospace',
    fontBody: '"Karla", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    heroSky: 'linear-gradient(180deg, #0D0E10 0%, #201C3E 45%, #362F72 78%, #4B3FA8 100%)',
    heroSun: 'radial-gradient(circle, rgba(124, 124, 255, 0.85) 0%, rgba(52, 213, 196, 0.3) 52%, transparent 74%)',
    radiusCard: '6px',
    radiusPill: '6px',
    radiusBubble: '5px',
    radiusSmall: '3px',
  },
};

const ledger: RivieraTheme = {
  id: 'ledger',
  name: 'Ledger',
  tagline: 'Sharp-cornered, boarding-pass paper',
  colorScheme: 'light',
  artifactsTheme: ledgerPreset,
  tokens: {
    ink: '#1A1A18',
    inkSoft: '#5A5A52',
    inkDim: '#8C8C82',
    line: '#D8D6CC',
    paper: '#FAF9F5',
    paperSoft: '#F1EFE6',
    gold: '#B34700',
    coral: '#B3261E',
    fontDisplay: '"JetBrains Mono", monospace',
    fontBody: '"Karla", sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    heroSky: 'linear-gradient(180deg, #1A1A18 0%, #3A3A32 100%)',
    heroSun: 'radial-gradient(circle, rgba(179, 71, 0, 0.55) 0%, rgba(179, 71, 0, 0.15) 55%, transparent 74%)',
    radiusCard: '3px',
    radiusPill: '4px',
    radiusBubble: '3px',
    radiusSmall: '2px',
  },
};

export const themes: readonly RivieraTheme[] = [light, dark, riviera, techno, ledger];
export const defaultThemeId = riviera.id;
