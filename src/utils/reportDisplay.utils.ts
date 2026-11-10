import { CommunityReport } from '../types/user.types';

type TranslateFn = (key: string, fallback?: string) => string;

/** Traduce el título del marcador de incidente según su categoría e idioma activo. */
export function getTranslatedReportTitle(report: CommunityReport, t: TranslateFn): string {
  if (report.id === 'rep-init-1') return t('incidents.mapInitTraffic', report.title);
  if (report.id === 'rep-init-2') return t('incidents.mapInitRoadBlock', report.title);
  if (report.id === 'rep-init-3') return t('incidents.mapInitBusFull', report.title);
  switch (report.category as string) {
    case 'BUS_FULL':
    case 'FULL_BUS':
      return t('incidents.busFullOnRoad', 'Bus lleno en vía');
    case 'TRAFFIC_JAM':
    case 'TRAFFIC':
      return t('incidents.trafficOnRoad', 'Tráfico pesado en vía');
    case 'ROAD_BLOCK':
      return t('incidents.roadBlockOnRoad', 'Vía cerrada por obras');
    case 'DETOUR':
      return t('incidents.detourOnRoad', 'Desvío en vía');
    case 'ACCIDENT':
      return t('incidents.accidentOnRoad', 'Accidente en vía');
    case 'POLICE_CHECK':
      return t('incidents.policeCheckOnRoad', 'Retén policial en vía');
    default:
      return report.title;
  }
}

export function getTranslatedReporterAlias(alias: string, t: TranslateFn): string {
  return alias === 'Comunidad Rutea' ? t('incidents.communityAlias', 'Comunidad Rutea') : alias;
}
