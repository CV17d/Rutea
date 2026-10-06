const LOCAL_PREFIXES = [
  'Cuy', 'Galeras', 'Volcan', 'Nariño', 'Barniz',
  'Chagra', 'Guaneña', 'Pastuso', 'Coba', 'Quillasinga'
];

const LOCAL_SUFFIXES = [
  'Veloz', 'Runner', 'Transit', 'Vigia', 'Rider',
  'Master', 'Explorer', 'Tracker', 'Pilot', 'Hero'
];

const AVATAR_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', 
  '#f59e0b', '#06b6d4', '#14b8a6', '#f43f5e'
];

export function generateLocalAlias(seed?: string): string {
  const hash = seed 
    ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : Math.floor(Math.random() * 1000);

  const prefix = LOCAL_PREFIXES[hash % LOCAL_PREFIXES.length];
  const suffix = LOCAL_SUFFIXES[(hash * 3) % LOCAL_SUFFIXES.length];
  const number = (hash % 89) + 10;

  return `${prefix}${suffix}${number}`;
}

export function getAvatarColorFromSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getLevelTitleByPoints(points: number): string {
  if (points >= 300) return 'Embajador Supremo de Pasto';
  if (points >= 150) return 'Guía Mayor de Ruta';
  if (points >= 75) return 'Vigía del Galeras';
  if (points >= 30) return 'Pasajero Frecuente';
  return 'Caminante de Pasto';
}
