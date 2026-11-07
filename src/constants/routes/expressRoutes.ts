import { TransitRoute } from '../../types/route.types';
import { PASTO_LOCATIONS as L } from './pastoWaypoints';

export const EXPRESS_ROUTES: TransitRoute[] = [
  {
    id: 'route-e1', code: 'E1', name: 'Ruta E1', color: '#4338ca', description: 'Dolores - Udenar',
    type: 'EXPRESS', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true, coordinates: [],
    stops: [
      { id: 's-e1-1', name: 'Vía La Laguna', orderIndex: 1, location: L.viaLaLaguna, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-e1-2', name: 'Dolores', orderIndex: 2, location: L.dolores, estimatedWaitMinutes: 5 },
      { id: 's-e1-3', name: 'Variante Daza', orderIndex: 3, location: L.varianteDaza, estimatedWaitMinutes: 8 }, { id: 's-e1-4', name: 'Pinal Del Rio', orderIndex: 4, location: L.pinalDelRio, estimatedWaitMinutes: 11 },
      { id: 's-e1-5', name: 'Santa Mónica', orderIndex: 5, location: L.santaMonica, estimatedWaitMinutes: 15 }, { id: 's-e1-6', name: 'Hospital Departamental', orderIndex: 6, location: L.hospitalDepartamental, estimatedWaitMinutes: 18 },
      { id: 's-e1-7', name: 'San Juan Bosco', orderIndex: 7, location: L.sanJuanBosco, estimatedWaitMinutes: 22 }, { id: 's-e1-8', name: 'Av. Los Estudiantes', orderIndex: 8, location: L.avLosEstudiantes, estimatedWaitMinutes: 25 },
      { id: 's-e1-9', name: 'Universidad Cooperativa', orderIndex: 9, location: L.universidadCooperativa, estimatedWaitMinutes: 29 }, { id: 's-e1-10', name: 'Udenar - Facultad de Veterinaria', orderIndex: 10, location: L.udenarVeterinaria, estimatedWaitMinutes: 33, isTerminal: true },
    ],
  },
  {
    id: 'route-e2',
    code: 'E2',
    name: 'Terminal - Centro - Torobajo Expreso',
    color: '#ef4444',
    description: 'Ruta Expresa E2 SETPasto',
    type: 'EXPRESS',
    direction: 'SUR_NORTE',
    estimatedFrequencyMinutes: 14,
    isActive: true,
    coordinates: [L.terminalTransportes, L.plazaCarnaval, L.plazaNarino, L.torobajoUdenar],
    stops: [
      { id: 's-e2-1', name: 'Terminal Transportes', orderIndex: 1, location: L.terminalTransportes, estimatedWaitMinutes: 3, isTerminal: true },
      { id: 's-e2-2', name: 'Plaza Nariño Expreso', orderIndex: 2, location: L.plazaNarino, estimatedWaitMinutes: 10 },
      { id: 's-e2-3', name: 'Torobajo Udenar', orderIndex: 3, location: L.torobajoUdenar, estimatedWaitMinutes: 17, isTerminal: true },
    ],
  },
  {
    id: 'route-e3',
    code: 'E3',
    name: 'Sur Oriente - Hospital Departamental',
    color: '#8b5cf6',
    description: 'Ruta Expresa E3 SETPasto',
    type: 'EXPRESS',
    direction: 'SUR_NORTE',
    estimatedFrequencyMinutes: 15,
    isActive: true,
    coordinates: [L.miraflores, L.parqueChapal, L.hospitalDepartamental],
    stops: [
      { id: 's-e3-1', name: 'Sur Oriente', orderIndex: 1, location: L.miraflores, estimatedWaitMinutes: 4, isTerminal: true },
      { id: 's-e3-2', name: 'Hospital Departamental', orderIndex: 2, location: L.hospitalDepartamental, estimatedWaitMinutes: 14, isTerminal: true },
    ],
  },
  {
    id: 'route-e4',
    code: 'E4',
    name: 'Lorenzo - Terminal - San Ezequiel',
    color: '#ec4899',
    description: 'Lorenzo - Terminal - San Ezequiel',
    type: 'EXPRESS',
    direction: 'CIRCULAR',
    estimatedFrequencyMinutes: 15,
    isActive: true,
    coordinates: [
      L.lorenzo,
      L.terminalTransportes,
      { latitude: 1.2150, longitude: -77.2710 },
      { latitude: 1.2289, longitude: -77.2840 },
    ],
    stops: [
      { id: 's-e4-1', name: 'Barrio Lorenzo', orderIndex: 1, location: L.lorenzo, estimatedWaitMinutes: 5, isTerminal: true },
      { id: 's-e4-2', name: 'Terminal de Transportes', orderIndex: 2, location: L.terminalTransportes, estimatedWaitMinutes: 11 },
      { id: 's-e4-3', name: 'Glorieta San Ezequiel', orderIndex: 3, location: { latitude: 1.2289, longitude: -77.2840 }, estimatedWaitMinutes: 17, isTerminal: true },
    ],
  },
];
