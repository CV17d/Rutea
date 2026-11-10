/**
 * Sistema visual "Galeras": superficies azul-pizarra de la noche andina,
 * verde páramo como marca y un único acento ámbar (barniz de Pasto)
 * reservado para la información en vivo (minutos, buses activos).
 */
export interface Palette {
  isDark: boolean;
  bg: string;
  surface: string;
  raised: string;
  line: string;
  text: string;
  text2: string;
  muted: string;
  brand: string;
  brandSoft: string;
  onBrand: string;
  live: string;
  liveSoft: string;
  danger: string;
  dangerSoft: string;
  scrim: string;
  shadow: string;
}

const DARK: Palette = {
  isDark: true,
  bg: '#0D1A20',
  surface: '#14242C',
  raised: '#1C3039',
  line: '#29424C',
  text: '#ECF2F0',
  text2: '#A6B7B9',
  muted: '#70868B',
  brand: '#2BC495',
  brandSoft: 'rgba(43, 196, 149, 0.16)',
  onBrand: '#062A1F',
  live: '#F2B04A',
  liveSoft: 'rgba(242, 176, 74, 0.14)',
  danger: '#F06B6B',
  dangerSoft: 'rgba(240, 107, 107, 0.14)',
  scrim: 'rgba(5, 12, 16, 0.62)',
  shadow: '#000000',
};

const LIGHT: Palette = {
  isDark: false,
  bg: '#EEF3F2',
  surface: '#FFFFFF',
  raised: '#F3F7F6',
  line: '#DCE5E3',
  text: '#0F1F27',
  text2: '#4A5E65',
  muted: '#7B8E93',
  brand: '#12A077',
  brandSoft: 'rgba(18, 160, 119, 0.12)',
  onBrand: '#FFFFFF',
  live: '#B86E00',
  liveSoft: 'rgba(233, 162, 59, 0.16)',
  danger: '#D14343',
  dangerSoft: 'rgba(209, 67, 67, 0.10)',
  scrim: 'rgba(15, 31, 39, 0.45)',
  shadow: '#0F1F27',
};

export const getPalette = (isDark: boolean): Palette => (isDark ? DARK : LIGHT);

/** Escala tipográfica (fuente del sistema). Los tiempos usan cifras tabulares. */
export const TYPE = {
  display: { fontSize: 30, fontWeight: '800' as const, letterSpacing: -0.8 },
  title: { fontSize: 20, fontWeight: '800' as const, letterSpacing: -0.4 },
  heading: { fontSize: 15, fontWeight: '700' as const, letterSpacing: -0.1 },
  body: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '600' as const },
  numeric: { fontVariant: ['tabular-nums' as const] },
};

export const RADIUS = { sheet: 28, card: 20, control: 14, tile: 12, pill: 999 };
