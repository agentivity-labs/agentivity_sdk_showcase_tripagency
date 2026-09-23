import type { ArtifactsThemeData } from '@agentivity-labs/sdk-react';

/**
 * Riviera — this app's visual identity, not a generic SDK preset. Light,
 * editorial: near-black ink, warm off-white surfaces, a gold accent reserved
 * for the primary action/selection. Instrument Serif for display headings,
 * Karla for body/UI text. Lives here (not in `agentivity_sdk_react`) because
 * it's specific to this showcase, not something other apps built on the SDK
 * should inherit.
 */
export const riviera: ArtifactsThemeData = {
  cardRadius: 16,
  cardPadding: '12px',
  cardBorderWidth: 1.5,
  cardBackground: '#FFFFFF',
  cardBorderColor: '#EDEBE5',
  cardShadow: '0px 10px 24px -12px rgba(23,26,29,0.18)',
  badgeBackground: '#FDF7EC',
  badgeForeground: '#171A1D',
  labelFontSize: 10,
  headerFontSize: 12.5,
  valueFontSize: 28,
  codeFontSize: 12,
  fontScale: 1,
  spacingScale: 1,
  fontFamily: '"Karla", sans-serif',
  chartPalette: ['#E3A94F', '#F1633B', '#4E7D5E', '#3C6E82', '#C97F49', '#6B6270', '#A6572F', '#171A1D'],
  colors: {
    primary: '#171A1D',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FDF7EC',
    onPrimaryContainer: '#171A1D',
    tertiary: '#E3A94F',
    surface: '#FFFFFF',
    surfaceContainerLow: '#F5F3EE',
    surfaceContainerHigh: '#F0EDE5',
    surfaceContainerHighest: '#EDEBE5',
    outline: '#9CA0A6',
    outlineVariant: '#EDEBE5',
  },
};

/** Raw design tokens for app-level CSS (not routed through the SDK's theme). */
export const rivieraTokens = {
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
} as const;
