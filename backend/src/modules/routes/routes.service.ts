import { Injectable, NotFoundException } from '@nestjs/common';

export interface RouteEntity {
  id: string;
  code: string;
  name: string;
  color: string;
  direction: string;
  coordinates: { latitude: number; longitude: number }[];
  stops: { id: string; name: string; order: number; lat: number; lng: number }[];
}

@Injectable()
export class RoutesService {
  private readonly routes: RouteEntity[] = [
    {
      id: 'route-c1',
      code: 'C1',
      name: 'Catambuco - Centro - Torobajo',
      color: '#10b981',
      direction: 'SUR_NORTE',
      coordinates: [
        { latitude: 1.1732, longitude: -77.2845 },
        { latitude: 1.1980, longitude: -77.2790 },
        { latitude: 1.2145, longitude: -77.2783 },
        { latitude: 1.2312, longitude: -77.2918 },
      ],
      stops: [
        { id: 's-1', name: 'Portal Catambuco', order: 1, lat: 1.1732, lng: -77.2845 },
        { id: 's-2', name: 'Plaza Nariño', order: 2, lat: 1.2145, lng: -77.2783 },
        { id: 's-3', name: 'U. de Nariño Torobajo', order: 3, lat: 1.2312, lng: -77.2918 },
      ],
    },
    {
      id: 'route-c16',
      code: 'C16',
      name: 'Chapal - Plaza Carnaval - Pandiaco',
      color: '#38bdf8',
      direction: 'SUR_NORTE',
      coordinates: [
        { latitude: 1.1920, longitude: -77.2760 },
        { latitude: 1.2115, longitude: -77.2778 },
        { latitude: 1.2295, longitude: -77.2855 },
      ],
      stops: [
        { id: 's-4', name: 'Chapal', order: 1, lat: 1.1920, lng: -77.2760 },
        { id: 's-5', name: 'Plaza Carnaval', order: 2, lat: 1.2115, lng: -77.2778 },
        { id: 's-6', name: 'Pandiaco', order: 3, lat: 1.2295, lng: -77.2855 },
      ],
    },
  ];

  findAll(): RouteEntity[] {
    return this.routes;
  }

  findById(id: string): RouteEntity {
    const route = this.routes.find((r) => r.id === id);
    if (!route) {
      throw new NotFoundException(`Ruta ${id} no encontrada`);
    }
    return route;
  }

  getStops(routeId: string) {
    const route = this.findById(routeId);
    return route.stops;
  }
}
