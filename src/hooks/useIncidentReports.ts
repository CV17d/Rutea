import { useEffect } from 'react';
import { reportService } from '../services/report.service';

/**
 * Hook para sincronizar en tiempo real los reportes de incidentes activos
 * de la ruta seleccionada con el mapa.
 */
export function useIncidentReports(routeId?: string) {
  useEffect(() => {
    reportService.fetchActiveIncidents(routeId);
    const unsubscribe = reportService.subscribeToIncidents(() => {}, routeId);
    return () => {
      unsubscribe();
    };
  }, [routeId]);
}
