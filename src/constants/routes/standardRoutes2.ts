import { TransitRoute } from '../../types/route.types';
import { PASTO_LOCATIONS as L } from './pastoWaypoints';

export const STANDARD_ROUTES_PART2: TransitRoute[] = [
  {
    id: 'route-c9', code: 'C9', name: 'Ruta C9', color: '#10b981', description: 'Udenar/Briceño - Villa Nueva',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true, coordinates: [],
    stops: [
      { id: 's-c9-1', name: 'Briceño', orderIndex: 1, location: L.briceno, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c9-2', name: 'Udenar Torobajo', orderIndex: 2, location: L.torobajoUdenar, estimatedWaitMinutes: 5 },
      { id: 's-c9-3', name: 'Universidad Mariana', orderIndex: 3, location: L.universidadMariana, estimatedWaitMinutes: 9 }, { id: 's-c9-4', name: 'Hospital Infantil', orderIndex: 4, location: L.hospitalInfantil, estimatedWaitMinutes: 12 },
      { id: 's-c9-5', name: 'Bomberos', orderIndex: 5, location: L.bomberos, estimatedWaitMinutes: 15 }, { id: 's-c9-6', name: 'Hospital Civil', orderIndex: 6, location: L.hospitalCivil, estimatedWaitMinutes: 18 },
      { id: 's-c9-7', name: 'Nueva Aranda', orderIndex: 7, location: L.nuevaAranda, estimatedWaitMinutes: 22 }, { id: 's-c9-8', name: 'Villa Nueva', orderIndex: 8, location: L.villaNueva, estimatedWaitMinutes: 26, isTerminal: true },
    ],
  },
  {
    id: 'route-c10', code: 'C10', name: 'Chamba - Centro - Chapal', color: '#a855f7', description: 'Chamba - Centro - Chapal',
    type: 'STANDARD', direction: 'CIRCULAR', estimatedFrequencyMinutes: 12, isActive: true, coordinates: [L.chamba, L.parqueChapal],
    stops: [{ id: 's-c10-1', name: 'Chamba', orderIndex: 1, location: L.chamba, estimatedWaitMinutes: 5, isTerminal: true }, { id: 's-c10-2', name: 'Chapal', orderIndex: 2, location: L.parqueChapal, estimatedWaitMinutes: 16, isTerminal: true }],
  },
  {
    id: 'route-c11', code: 'C11', name: 'San Albano - Torobajo', color: '#d946ef', description: 'San Albano - Torobajo',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true, coordinates: [L.sanAlbano, L.torobajoUdenar],
    stops: [{ id: 's-c11-1', name: 'San Albano', orderIndex: 1, location: L.sanAlbano, estimatedWaitMinutes: 4, isTerminal: true }, { id: 's-c11-2', name: 'Torobajo', orderIndex: 2, location: L.torobajoUdenar, estimatedWaitMinutes: 15, isTerminal: true }],
  },
  {
    id: 'route-c12', code: 'C12', name: 'Cabrera - Centro', color: '#0ea5e9', description: 'Cabrera - Centro',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 18, isActive: true, coordinates: [L.cabrera, L.plazaNarino],
    stops: [{ id: 's-c12-1', name: 'Cabrera', orderIndex: 1, location: L.cabrera, estimatedWaitMinutes: 8, isTerminal: true }, { id: 's-c12-2', name: 'Plaza Nariño', orderIndex: 2, location: L.plazaNarino, estimatedWaitMinutes: 22, isTerminal: true }],
  },
  {
    id: 'route-c13', code: 'C13', name: 'Buesaquillo - Pandiaco', color: '#10b981', description: 'Buesaquillo - Pandiaco',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 15, isActive: true, coordinates: [L.buesaquillo, L.pandiaco],
    stops: [{ id: 's-c13-1', name: 'Buesaquillo', orderIndex: 1, location: L.buesaquillo, estimatedWaitMinutes: 6, isTerminal: true }, { id: 's-c13-2', name: 'Pandiaco', orderIndex: 2, location: L.pandiaco, estimatedWaitMinutes: 20, isTerminal: true }],
  },
  {
    id: 'route-c14', code: 'C14', name: 'Catambuco - Terminal', color: '#f59e0b', description: 'Catambuco - Terminal',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 12, isActive: true, coordinates: [L.portalCatambuco, L.terminalTransportes],
    stops: [{ id: 's-c14-1', name: 'Catambuco', orderIndex: 1, location: L.portalCatambuco, estimatedWaitMinutes: 4, isTerminal: true }, { id: 's-c14-2', name: 'Terminal', orderIndex: 2, location: L.terminalTransportes, estimatedWaitMinutes: 16, isTerminal: true }],
  },
  {
    id: 'route-c15', code: 'C15', name: 'San Fernando - Maridíaz', color: '#ef4444', description: 'San Fernando - Maridíaz',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 9, isActive: true, coordinates: [L.sanFernando, L.maridiaz],
    stops: [{ id: 's-c15-1', name: 'San Fernando', orderIndex: 1, location: L.sanFernando, estimatedWaitMinutes: 3, isTerminal: true }, { id: 's-c15-2', name: 'Maridíaz', orderIndex: 2, location: L.maridiaz, estimatedWaitMinutes: 14, isTerminal: true }],
  },
  {
    id: 'route-c16', code: 'C16', name: 'Anganoy - Cabrera', color: '#38bdf8', description: 'Anganoy - Cabrera',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true,
    coordinates: [], // Geometría cargada dinámicamente desde PostGIS (Supabase)
    stops: [
      { id: 's-c16-1', name: 'Anganoy', orderIndex: 1, location: L.anganoy, estimatedWaitMinutes: 2, isTerminal: true },
      { id: 's-c16-2', name: 'Panorámico', orderIndex: 2, location: L.panoramico, estimatedWaitMinutes: 4 },
      { id: 's-c16-3', name: 'Liceo Udenar', orderIndex: 3, location: L.liceoUdenar, estimatedWaitMinutes: 7 },
      { id: 's-c16-4', name: 'Teatro Imperial', orderIndex: 4, location: L.teatroImperial, estimatedWaitMinutes: 11 },
      { id: 's-c16-5', name: 'San Andresito', orderIndex: 5, location: L.sanAndresito, estimatedWaitMinutes: 14 },
      { id: 's-c16-6', name: 'San Juan Bosco', orderIndex: 6, location: L.sanJuanBosco, estimatedWaitMinutes: 17 },
      { id: 's-c16-7', name: 'Las Lunas', orderIndex: 7, location: L.lasLunas, estimatedWaitMinutes: 20 },
      { id: 's-c16-8', name: 'San Fernando', orderIndex: 8, location: L.sanFernando, estimatedWaitMinutes: 23 },
      { id: 's-c16-9', name: 'Cabrera', orderIndex: 9, location: L.cabrera, estimatedWaitMinutes: 28, isTerminal: true },
    ],
  },
];
