import { TransitRoute } from '../../types/route.types';
import { PASTO_LOCATIONS as L } from './pastoWaypoints';

export const STANDARD_ROUTES_PART1: TransitRoute[] = [
  {
    id: 'route-c1', code: 'C1', name: 'Ruta C1', color: '#f97316', description: 'Altos de Chapalito - Obonuco',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 8, isActive: true, coordinates: [],
    stops: [
      { id: 's-c1-1', name: 'Altos de Chapalito', orderIndex: 1, location: L.altosChapalito, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c1-2', name: 'Chambú', orderIndex: 2, location: L.chambu, estimatedWaitMinutes: 4 },
      { id: 's-c1-3', name: 'Las Lunas', orderIndex: 3, location: L.lasLunas, estimatedWaitMinutes: 7 }, { id: 's-c1-4', name: 'San Juan Bosco', orderIndex: 4, location: L.sanJuanBosco, estimatedWaitMinutes: 10 },
      { id: 's-c1-5', name: 'Alcaldía Centro', orderIndex: 5, location: L.alcaldiaCentro, estimatedWaitMinutes: 13 }, { id: 's-c1-6', name: 'Amorel de la Avenida', orderIndex: 6, location: L.amorelAvenida, estimatedWaitMinutes: 16 },
      { id: 's-c1-7', name: 'INEM Mijitayo', orderIndex: 7, location: L.inemMijitayo, estimatedWaitMinutes: 19 }, { id: 's-c1-8', name: 'Tamasagra', orderIndex: 8, location: L.tamasagra, estimatedWaitMinutes: 22 },
      { id: 's-c1-9', name: 'Atención Integral Obonuco', orderIndex: 9, location: L.obonucoAtencionIntegral, estimatedWaitMinutes: 26, isTerminal: true },
    ],
  },
  {
    id: 'route-c2', code: 'C2', name: 'Ruta C2', color: '#ea580c', description: 'Altavista - La Paz',
    type: 'STANDARD', direction: 'NORTE_SUR', estimatedFrequencyMinutes: 9, isActive: true, coordinates: [],
    stops: [
      { id: 's-c2-1', name: 'Altavista', orderIndex: 1, location: L.altavista, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c2-2', name: 'Hospital San Rafael', orderIndex: 2, location: L.hospitalSanRafael, estimatedWaitMinutes: 5 },
      { id: 's-c2-3', name: 'Panamericana Calle 14', orderIndex: 3, location: L.panamericanaCalle14, estimatedWaitMinutes: 8 }, { id: 's-c2-4', name: 'La Panadería', orderIndex: 4, location: L.laPanaderia, estimatedWaitMinutes: 11 },
      { id: 's-c2-5', name: 'Plaza Del Carnaval', orderIndex: 5, location: L.plazaCarnaval, estimatedWaitMinutes: 14 }, { id: 's-c2-6', name: 'San Juan Bosco', orderIndex: 6, location: L.sanJuanBosco, estimatedWaitMinutes: 17 },
      { id: 's-c2-7', name: 'Terminal De Transportes', orderIndex: 7, location: L.terminalTransportes, estimatedWaitMinutes: 21 }, { id: 's-c2-8', name: 'Lorenzo', orderIndex: 8, location: L.lorenzo, estimatedWaitMinutes: 24 },
      { id: 's-c2-9', name: 'La Paz', orderIndex: 9, location: L.laPaz, estimatedWaitMinutes: 28, isTerminal: true },
    ],
  },
  {
    id: 'route-c3', code: 'C3', name: 'Ruta C3', color: '#b91c1c', description: 'Arnulfo Guerrero - Gilberto Pabón',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 9, isActive: true, coordinates: [],
    stops: [
      { id: 's-c3-1', name: 'Arnulfo Guerrero', orderIndex: 1, location: L.arnulfoGuerrero, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c3-2', name: 'Villa Flor II', orderIndex: 2, location: L.villaFlor2, estimatedWaitMinutes: 5 },
      { id: 's-c3-3', name: 'Hospital Departamental', orderIndex: 3, location: L.hospitalDepartamental, estimatedWaitMinutes: 8 }, { id: 's-c3-4', name: 'San Juan Bosco', orderIndex: 4, location: L.sanJuanBosco, estimatedWaitMinutes: 11 },
      { id: 's-c3-5', name: 'Alcaldía Centro', orderIndex: 5, location: L.alcaldiaCentro, estimatedWaitMinutes: 14 }, { id: 's-c3-6', name: 'Calle 16 Carrera 27', orderIndex: 6, location: L.calle16Cra27, estimatedWaitMinutes: 18 },
      { id: 's-c3-7', name: 'INEM Av Mijitayo', orderIndex: 7, location: L.inemMijitayo, estimatedWaitMinutes: 21 }, { id: 's-c3-8', name: 'Sumatambo', orderIndex: 8, location: L.sumatambo, estimatedWaitMinutes: 25 },
      { id: 's-c3-9', name: 'Gilberto Pabón', orderIndex: 9, location: L.gilbertoPabon, estimatedWaitMinutes: 29, isTerminal: true },
    ],
  },
  {
    id: 'route-c4', code: 'C4', name: 'Ruta C4', color: '#d97706', description: 'El Porvenir - Jongovito',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 9, isActive: true, coordinates: [],
    stops: [
      { id: 's-c4-1', name: 'Miraflores', orderIndex: 1, location: L.miraflores, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c4-2', name: 'San Martín', orderIndex: 2, location: L.sanMartin, estimatedWaitMinutes: 4 },
      { id: 's-c4-3', name: 'Avenida Chile', orderIndex: 3, location: L.avenidaChile, estimatedWaitMinutes: 7 }, { id: 's-c4-4', name: 'San Juan Bosco', orderIndex: 4, location: L.sanJuanBosco, estimatedWaitMinutes: 10 },
      { id: 's-c4-5', name: 'María Goretti', orderIndex: 5, location: L.mariaGoretti, estimatedWaitMinutes: 13 }, { id: 's-c4-6', name: 'Calle 16 Carrera 27', orderIndex: 6, location: L.calle16Cra27, estimatedWaitMinutes: 16 },
      { id: 's-c4-7', name: 'INEM', orderIndex: 7, location: L.inemMijitayo, estimatedWaitMinutes: 19 }, { id: 's-c4-8', name: 'Panamericana Sumatambo', orderIndex: 8, location: L.panamericanaSumatambo, estimatedWaitMinutes: 22 },
      { id: 's-c4-9', name: 'San Sebastián', orderIndex: 9, location: L.sanSebastian, estimatedWaitMinutes: 25 }, { id: 's-c4-10', name: 'Jongovito', orderIndex: 10, location: L.jongovito, estimatedWaitMinutes: 29, isTerminal: true },
    ],
  },
  {
    id: 'route-c5', code: 'C5', name: 'Ruta C5', color: '#be185d', description: 'Buesaquillo/Puente Tabla - Udenar',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 12, isActive: true, coordinates: [],
    stops: [
      { id: 's-c5-1', name: 'Puente Tabla', orderIndex: 1, location: L.puenteTabla, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c5-2', name: 'Buesaquillo', orderIndex: 2, location: L.buesaquillo, estimatedWaitMinutes: 5 },
      { id: 's-c5-3', name: 'Sena', orderIndex: 3, location: L.sena, estimatedWaitMinutes: 10 }, { id: 's-c5-4', name: 'Único', orderIndex: 4, location: L.unico, estimatedWaitMinutes: 14 },
      { id: 's-c5-5', name: 'Hospital Departamental', orderIndex: 5, location: L.hospitalDepartamental, estimatedWaitMinutes: 18 }, { id: 's-c5-6', name: 'San Juan Bosco', orderIndex: 6, location: L.sanJuanBosco, estimatedWaitMinutes: 20 },
      { id: 's-c5-7', name: 'San Andresito', orderIndex: 7, location: L.sanAndresito, estimatedWaitMinutes: 23 }, { id: 's-c5-8', name: 'Éxito', orderIndex: 8, location: L.exito, estimatedWaitMinutes: 26 },
      { id: 's-c5-9', name: 'Tamasagra', orderIndex: 9, location: L.tamasagra, estimatedWaitMinutes: 30 }, { id: 's-c5-10', name: 'Mijitayo', orderIndex: 10, location: L.mijitayo, estimatedWaitMinutes: 34 },
      { id: 's-c5-11', name: 'Unicentro', orderIndex: 11, location: L.unicentro, estimatedWaitMinutes: 38 }, { id: 's-c5-12', name: 'Udenar Torobajo', orderIndex: 12, location: L.torobajoUdenar, estimatedWaitMinutes: 42 },
      { id: 's-c5-13', name: 'Briceño', orderIndex: 13, location: L.briceno, estimatedWaitMinutes: 47, isTerminal: true },
    ],
  },
  {
    id: 'route-c6', code: 'C6', name: 'Ruta C6', color: '#0d9488', description: 'Cam Anganoy - Catambuco/Coba Negra',
    type: 'STANDARD', direction: 'NORTE_SUR', estimatedFrequencyMinutes: 12, isActive: true, coordinates: [],
    stops: [
      { id: 's-c6-1', name: 'Cam Anganoy', orderIndex: 1, location: L.camAnganoy, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c6-2', name: 'Panorámico', orderIndex: 2, location: L.panoramico, estimatedWaitMinutes: 5 },
      { id: 's-c6-3', name: 'Liceo Udenar', orderIndex: 3, location: L.liceoUdenar, estimatedWaitMinutes: 8 }, { id: 's-c6-4', name: 'Teatro Imperial', orderIndex: 4, location: L.teatroImperial, estimatedWaitMinutes: 12 },
      { id: 's-c6-5', name: 'San Andresito', orderIndex: 5, location: L.sanAndresito, estimatedWaitMinutes: 15 }, { id: 's-c6-6', name: 'Coliseo Antonio Ruano', orderIndex: 6, location: L.coliseoAntonioRuano, estimatedWaitMinutes: 18 },
      { id: 's-c6-7', name: 'Estadio Libertad', orderIndex: 7, location: L.estadioLibertad, estimatedWaitMinutes: 22 }, { id: 's-c6-8', name: 'Chapal', orderIndex: 8, location: L.chapal, estimatedWaitMinutes: 26 },
      { id: 's-c6-9', name: 'Catambuco', orderIndex: 9, location: L.catambuco, estimatedWaitMinutes: 31 }, { id: 's-c6-10', name: 'Coba Negra', orderIndex: 10, location: L.cobaNegra, estimatedWaitMinutes: 36, isTerminal: true },
    ],
  },
  {
    id: 'route-c7', code: 'C7', name: 'Ruta C7', color: '#7c3aed', description: 'Altos De Chapalito - San Juan De Anganoy',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true, coordinates: [],
    stops: [
      { id: 's-c7-1', name: 'Altos de Chapalito', orderIndex: 1, location: L.altosChapalito, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-c7-2', name: 'Chambú', orderIndex: 2, location: L.chambu, estimatedWaitMinutes: 4 },
      { id: 's-c7-3', name: 'La Rosa', orderIndex: 3, location: L.laRosa, estimatedWaitMinutes: 7 }, { id: 's-c7-4', name: 'Chapal', orderIndex: 4, location: L.chapal, estimatedWaitMinutes: 10 },
      { id: 's-c7-5', name: 'Estadio Libertad', orderIndex: 5, location: L.estadioLibertad, estimatedWaitMinutes: 13 }, { id: 's-c7-6', name: 'San Juan Bosco', orderIndex: 6, location: L.sanJuanBosco, estimatedWaitMinutes: 17 },
      { id: 's-c7-7', name: 'Alcaldía Centro', orderIndex: 7, location: L.alcaldiaCentro, estimatedWaitMinutes: 20 }, { id: 's-c7-8', name: 'Policía Calle 20', orderIndex: 8, location: L.policiaCalle20, estimatedWaitMinutes: 23 },
      { id: 's-c7-9', name: 'Unicentro', orderIndex: 9, location: L.unicentro, estimatedWaitMinutes: 27 }, { id: 's-c7-10', name: 'Liceo Udenar', orderIndex: 10, location: L.liceoUdenar, estimatedWaitMinutes: 31 },
      { id: 's-c7-11', name: 'Anganoy', orderIndex: 11, location: L.anganoy, estimatedWaitMinutes: 36, isTerminal: true },
    ],
  },
  {
    id: 'route-c8', code: 'C8', name: 'Anganoy - Centro', color: '#14b8a6', description: 'Anganoy - Centro',
    type: 'STANDARD', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 15, isActive: true, coordinates: [L.anganoy, L.plazaNarino],
    stops: [
      { id: 's-c8-1', name: 'Anganoy', orderIndex: 1, location: L.anganoy, estimatedWaitMinutes: 6, isTerminal: true },
      { id: 's-c8-2', name: 'Plaza Nariño', orderIndex: 2, location: L.plazaNarino, estimatedWaitMinutes: 15, isTerminal: true },
    ],
  },
];
