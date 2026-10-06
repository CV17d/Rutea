export function formatEtaMinutes(minutes: number): string {
  if (minutes <= 0) return '< 1 MIN';
  if (minutes === 1) return '1 MIN';
  return `${Math.round(minutes)} MIN`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

export function formatRelativeTime(timestamp: number): string {
  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSeconds < 30) return 'Ahora mismo';
  if (diffSeconds < 60) return `hace ${diffSeconds}s`;
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes === 1) return 'hace 1 min';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `hace ${hours}h`;
}

export function calculateEtaMinutes(
  distanceMeters: number,
  averageSpeedKmh: number = 22 // Average urban transit speed in Pasto
): number {
  if (distanceMeters <= 0) return 0;
  const speedMetersPerMinute = (averageSpeedKmh * 1000) / 60;
  const rawMinutes = distanceMeters / speedMetersPerMinute;
  return Math.max(1, Math.round(rawMinutes));
}
