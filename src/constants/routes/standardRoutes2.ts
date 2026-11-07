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
    id: 'route-c10', code: 'C10', name: 'Ruta C10', color: '#db2777', description: 'Briceño - Jamondino',
    type: 'STANDARD', direction: 'NORTE_SUR', estimatedFrequencyMinutes: 12, isActive: true, coordinates: [],
    stops: [
      { id: 's-c10-1', name: 'Briceño', orderIndex: 1, location: L.briceno, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c10-2', name: 'Udenar Torobajo', orderIndex: 2, location: L.torobajoUdenar, estimatedWaitMinutes: 5 },
      { id: 's-c10-3', name: 'Universidad Mariana', orderIndex: 3, location: L.universidadMariana, estimatedWaitMinutes: 9 }, { id: 's-c10-4', name: 'Hospital Infantil', orderIndex: 4, location: L.hospitalInfantil, estimatedWaitMinutes: 12 },
      { id: 's-c10-5', name: 'Parque de los Periodistas', orderIndex: 5, location: L.parquePeriodistas, estimatedWaitMinutes: 16 }, { id: 's-c10-6', name: 'Plaza del Carnaval', orderIndex: 6, location: L.plazaCarnaval, estimatedWaitMinutes: 19 },
      { id: 's-c10-7', name: 'Atahualpa', orderIndex: 7, location: L.atahualpa, estimatedWaitMinutes: 23 }, { id: 's-c10-8', name: 'Estadio Libertad', orderIndex: 8, location: L.estadioLibertad, estimatedWaitMinutes: 26 },
      { id: 's-c10-9', name: 'Colegio Ciudad de Pasto', orderIndex: 9, location: L.colegioCiudadDePasto, estimatedWaitMinutes: 30 }, { id: 's-c10-10', name: 'Jamondino Alto', orderIndex: 10, location: L.jamondinoAlto, estimatedWaitMinutes: 35, isTerminal: true },
    ],
  },
  {
    id: 'route-c11', code: 'C11', name: 'Ruta C11', color: '#06b6d4', description: 'Mocondino - Villa Nueva',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true, coordinates: [],
    stops: [
      { id: 's-c11-1', name: 'Mocondino Alto', orderIndex: 1, location: L.mocondinoAlto, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c11-2', name: 'Mercado El Tejar', orderIndex: 2, location: L.mercadoElTejar, estimatedWaitMinutes: 5 },
      { id: 's-c11-3', name: 'Lorenzo', orderIndex: 3, location: L.lorenzo, estimatedWaitMinutes: 8 }, { id: 's-c11-4', name: 'Terminal de Transportes', orderIndex: 4, location: L.terminalTransportes, estimatedWaitMinutes: 12 },
      { id: 's-c11-5', name: 'San Juan Bosco', orderIndex: 5, location: L.sanJuanBosco, estimatedWaitMinutes: 15 }, { id: 's-c11-6', name: 'Alcaldía Centro', orderIndex: 6, location: L.alcaldiaCentro, estimatedWaitMinutes: 18 },
      { id: 's-c11-7', name: 'Bomberos', orderIndex: 7, location: L.bomberos, estimatedWaitMinutes: 21 }, { id: 's-c11-8', name: 'Cementerio', orderIndex: 8, location: L.cementerio, estimatedWaitMinutes: 25 },
      { id: 's-c11-9', name: 'Piscina Semiolímpica', orderIndex: 9, location: L.piscinaSemiolimpica, estimatedWaitMinutes: 28 }, { id: 's-c11-10', name: 'Villa Nueva', orderIndex: 10, location: L.villaNueva, estimatedWaitMinutes: 32, isTerminal: true },
    ],
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
