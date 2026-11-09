import { BusStop, LatLng } from '../types/route.types';

export interface StopClusterItem {
  isCluster: true;
  id: string;
  count: number;
  location: LatLng;
  stops: BusStop[];
}

export interface StopSingleItem {
  isCluster: false;
  stop: BusStop;
}

export type ClusteredStop = StopClusterItem | StopSingleItem;

export const CLUSTER_ZOOM_THRESHOLD = 0.025;

/**
 * Agrupa paraderos en clústeres espaciales cuando la cámara está alejada (zoom lejano)
 * y los despliega individualmente al acercarse (zoom in).
 */
export function clusterBusStops(
  stops: BusStop[],
  latitudeDelta: number,
  threshold: number = CLUSTER_ZOOM_THRESHOLD
): ClusteredStop[] {
  if (!stops || stops.length === 0) return [];

  // Zoom in: Desplegar individualmente
  if (latitudeDelta <= threshold) {
    return stops.map((stop) => ({ isCluster: false, stop }));
  }

  // Zoom lejano: Cuadrícula espacial proporcional a la distancia de la cámara
  const cellSize = Math.max(0.006, latitudeDelta / 5);
  const grid = new Map<string, BusStop[]>();

  for (const stop of stops) {
    const cellX = Math.floor(stop.location.longitude / cellSize);
    const cellY = Math.floor(stop.location.latitude / cellSize);
    const key = `${cellX}:${cellY}`;

    const cellStops = grid.get(key);
    if (cellStops) {
      cellStops.push(stop);
    } else {
      grid.set(key, [stop]);
    }
  }

  const result: ClusteredStop[] = [];

  grid.forEach((cellStops, key) => {
    if (cellStops.length === 1) {
      result.push({ isCluster: false, stop: cellStops[0] });
    } else {
      let sumLat = 0;
      let sumLng = 0;
      for (const s of cellStops) {
        sumLat += s.location.latitude;
        sumLng += s.location.longitude;
      }
      result.push({
        isCluster: true,
        id: key,
        count: cellStops.length,
        location: {
          latitude: sumLat / cellStops.length,
          longitude: sumLng / cellStops.length,
        },
        stops: cellStops,
      });
    }
  });

  return result;
}
