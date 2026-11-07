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
    id: 'route-e2', code: 'E2', name: 'Ruta E2', color: '#f43f5e', description: 'Altos De Chapalito - Udenar',
    type: 'EXPRESS', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 10, isActive: true, coordinates: [],
    stops: [
      { id: 's-e2-1', name: 'Altos De Chapalito', orderIndex: 1, location: L.altosChapalito, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-e2-2', name: 'Chambú', orderIndex: 2, location: L.chambu, estimatedWaitMinutes: 5 },
      { id: 's-e2-3', name: 'La Minga', orderIndex: 3, location: L.laMinga, estimatedWaitMinutes: 8 }, { id: 's-e2-4', name: 'Hospital Departamental', orderIndex: 4, location: L.hospitalDepartamental, estimatedWaitMinutes: 12 },
      { id: 's-e2-5', name: 'Parque Bolívar', orderIndex: 5, location: L.parqueBolivar, estimatedWaitMinutes: 15 }, { id: 's-e2-6', name: 'Alcaldía Centro', orderIndex: 6, location: L.alcaldiaCentro, estimatedWaitMinutes: 18 },
      { id: 's-e2-7', name: 'Cristo Rey', orderIndex: 7, location: L.cristoRey, estimatedWaitMinutes: 21 }, { id: 's-e2-8', name: 'Policía Calle 20', orderIndex: 8, location: L.policiaCalle20, estimatedWaitMinutes: 24 },
      { id: 's-e2-9', name: 'Clínica Palermo', orderIndex: 9, location: L.clinicaPalermo, estimatedWaitMinutes: 28 }, { id: 's-e2-10', name: 'Udenar - Facultad de Veterinaria', orderIndex: 10, location: L.udenarVeterinaria, estimatedWaitMinutes: 33, isTerminal: true },
    ],
  },
  {
    id: 'route-e3', code: 'E3', name: 'Ruta E3', color: '#65a30d', description: 'Altamira - San Ezequiel Moreno',
    type: 'EXPRESS', direction: 'SUR_NORTE', estimatedFrequencyMinutes: 12, isActive: true, coordinates: [],
    stops: [
      { id: 's-e3-1', name: 'Altamira', orderIndex: 1, location: L.altamira, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-e3-2', name: 'Tamasagra', orderIndex: 2, location: L.tamasagra, estimatedWaitMinutes: 5 },
      { id: 's-e3-3', name: 'Panamericana - Éxito', orderIndex: 3, location: L.exito, estimatedWaitMinutes: 8 }, { id: 's-e3-4', name: 'Teatro Imperial', orderIndex: 4, location: L.teatroImperial, estimatedWaitMinutes: 11 },
      { id: 's-e3-5', name: 'San Agustín', orderIndex: 5, location: L.sanAgustin, estimatedWaitMinutes: 14 }, { id: 's-e3-6', name: 'Calle 17 Amorel', orderIndex: 6, location: L.calle17Amorel, estimatedWaitMinutes: 17 },
      { id: 's-e3-7', name: 'San Juan Bosco', orderIndex: 7, location: L.sanJuanBosco, estimatedWaitMinutes: 20 }, { id: 's-e3-8', name: 'Hospital Departamental', orderIndex: 8, location: L.hospitalDepartamental, estimatedWaitMinutes: 24 },
      { id: 's-e3-9', name: 'Gualcalá', orderIndex: 9, location: L.gualcala, estimatedWaitMinutes: 28 }, { id: 's-e3-10', name: 'Carlos Pizarro', orderIndex: 10, location: L.carlosPizarro, estimatedWaitMinutes: 32 },
      { id: 's-e3-11', name: 'San Ezequiel', orderIndex: 11, location: L.sanEzequiel, estimatedWaitMinutes: 36, isTerminal: true },
    ],
  },
  {
    id: 'route-e4', code: 'E4', name: 'Ruta E4', color: '#475569', description: 'Genoy - Jamondino',
    type: 'EXPRESS', direction: 'NORTE_SUR', estimatedFrequencyMinutes: 15, isActive: true, coordinates: [],
    stops: [
      { id: 's-e4-1', name: 'Genoy', orderIndex: 1, location: L.genoy, estimatedWaitMinutes: 2, isTerminal: true }, { id: 's-e4-2', name: 'Udenar Torobajo', orderIndex: 2, location: L.torobajoUdenar, estimatedWaitMinutes: 8 },
      { id: 's-e4-3', name: 'Hospital San Rafael', orderIndex: 3, location: L.hospitalSanRafael, estimatedWaitMinutes: 12 }, { id: 's-e4-4', name: 'Panamericana Calle 14', orderIndex: 4, location: L.panamericanaCalle14, estimatedWaitMinutes: 16 },
      { id: 's-e4-5', name: 'San Andresito', orderIndex: 5, location: L.sanAndresito, estimatedWaitMinutes: 20 }, { id: 's-e4-6', name: 'San Juan Bosco', orderIndex: 6, location: L.sanJuanBosco, estimatedWaitMinutes: 24 },
      { id: 's-e4-7', name: 'Las Lunas Carrera 9', orderIndex: 7, location: L.lasLunasCra9, estimatedWaitMinutes: 28 }, { id: 's-e4-8', name: 'Colegio Ciudad de Pasto', orderIndex: 8, location: L.colegioCiudadDePasto, estimatedWaitMinutes: 32 },
      { id: 's-e4-9', name: 'Miraflores', orderIndex: 9, location: L.mirafloresSur, estimatedWaitMinutes: 36 }, { id: 's-e4-10', name: 'Jamondino', orderIndex: 10, location: L.jamondino, estimatedWaitMinutes: 42, isTerminal: true },
    ],
  },
];
