import { useEffect } from 'react';
import { syncService } from '../services/sync.service';

/**
 * Hook que sincroniza silenciosamente el catálogo de rutas (C1-E4) y coordenadas PostGIS
 * en segundo plano al iniciar la app, guardándolos en caché local.
 */
export function useOfflineSync() {
  useEffect(() => {
    syncService.syncRoutesCatalog();
  }, []);
}
