import { TransitRoute } from '../types/route.types';

export const MOCK_PASTO_ROUTES: TransitRoute[] = [
  {
    id: 'route-c1',
    code: 'C1',
    name: 'Catambuco - Centro - Torobajo',
    color: '#10b981', // Emerald
    description: 'Corredor vial sur-norte conectando Catambuco con la U. de Nariño.',
    direction: 'SUR_NORTE',
    estimatedFrequencyMinutes: 7,
    isActive: true,
    coordinates: [
      { latitude: 1.1732, longitude: -77.2845 },
      { latitude: 1.1850, longitude: -77.2810 },
      { latitude: 1.1980, longitude: -77.2790 },
      { latitude: 1.2085, longitude: -77.2775 },
      { latitude: 1.2145, longitude: -77.2783 }, // Centro
      { latitude: 1.2210, longitude: -77.2830 },
      { latitude: 1.2280, longitude: -77.2890 },
      { latitude: 1.2312, longitude: -77.2918 }, // Torobajo
    ],
    stops: [
      { id: 's-c1-1', name: 'Portal Catambuco', orderIndex: 1, location: { latitude: 1.1732, longitude: -77.2845 }, estimatedWaitMinutes: 2, isTerminal: true },
      { id: 's-c1-2', name: 'Chapal Sur', orderIndex: 2, location: { latitude: 1.1980, longitude: -77.2790 }, estimatedWaitMinutes: 5 },
      { id: 's-c1-3', name: 'Plaza Nariño (Cra 25)', orderIndex: 3, location: { latitude: 1.2145, longitude: -77.2783 }, estimatedWaitMinutes: 9 },
      { id: 's-c1-4', name: 'Maridíaz Calle 18', orderIndex: 4, location: { latitude: 1.2210, longitude: -77.2830 }, estimatedWaitMinutes: 13 },
      { id: 's-c1-5', name: 'Universidad de Nariño Torobajo', orderIndex: 5, location: { latitude: 1.2312, longitude: -77.2918 }, estimatedWaitMinutes: 18, isTerminal: true },
    ]
  },
  {
    id: 'route-c16',
    code: 'C16',
    name: 'Chapal - Plaza Carnaval - Pandiaco',
    color: '#38bdf8', // Sky Blue
    description: 'Ruta transversal central hacia la zona norte residencial de Pandiaco.',
    direction: 'SUR_NORTE',
    estimatedFrequencyMinutes: 10,
    isActive: true,
    coordinates: [
      { latitude: 1.1920, longitude: -77.2760 },
      { latitude: 1.2010, longitude: -77.2750 },
      { latitude: 1.2115, longitude: -77.2778 }, // Plaza Carnaval
      { latitude: 1.2205, longitude: -77.2815 },
      { latitude: 1.2295, longitude: -77.2855 }, // Pandiaco
    ],
    stops: [
      { id: 's-c16-1', name: 'Parque Chapal', orderIndex: 1, location: { latitude: 1.1920, longitude: -77.2760 }, estimatedWaitMinutes: 3, isTerminal: true },
      { id: 's-c16-2', name: 'Plaza del Carnaval', orderIndex: 2, location: { latitude: 1.2115, longitude: -77.2778 }, estimatedWaitMinutes: 8 },
      { id: 's-c16-3', name: 'Avenida Colombia', orderIndex: 3, location: { latitude: 1.2205, longitude: -77.2815 }, estimatedWaitMinutes: 14 },
      { id: 's-c16-4', name: 'Pandiaco Norte', orderIndex: 4, location: { latitude: 1.2295, longitude: -77.2855 }, estimatedWaitMinutes: 20, isTerminal: true },
    ]
  },
  {
    id: 'route-e1',
    code: 'E1',
    name: 'Aranda - Maridíaz - Torobajo',
    color: '#f59e0b', // Amber
    description: 'Línea expresa oriental que conecta barrios altos con el corredor universitario.',
    direction: 'NORTE_SUR',
    estimatedFrequencyMinutes: 12,
    isActive: true,
    coordinates: [
      { latitude: 1.2240, longitude: -77.2650 },
      { latitude: 1.2190, longitude: -77.2720 },
      { latitude: 1.2145, longitude: -77.2783 },
      { latitude: 1.2230, longitude: -77.2860 },
      { latitude: 1.2312, longitude: -77.2918 },
    ],
    stops: [
      { id: 's-e1-1', name: 'Terminal Aranda', orderIndex: 1, location: { latitude: 1.2240, longitude: -77.2650 }, estimatedWaitMinutes: 4, isTerminal: true },
      { id: 's-e1-2', name: 'Hospital Infantil', orderIndex: 2, location: { latitude: 1.2190, longitude: -77.2720 }, estimatedWaitMinutes: 9 },
      { id: 's-e1-3', name: 'Centro Cultural Pandiaco', orderIndex: 3, location: { latitude: 1.2230, longitude: -77.2860 }, estimatedWaitMinutes: 15 },
    ]
  },
  {
    id: 'route-e4',
    code: 'E4',
    name: 'Lorenzo - Terminal - San Ezequiel',
    color: '#ec4899', // Pink
    description: 'Conexión directa entre Lorenzo de Aldana y Terminal de Transportes.',
    direction: 'CIRCULAR',
    estimatedFrequencyMinutes: 15,
    isActive: true,
    coordinates: [
      { latitude: 1.2050, longitude: -77.2880 },
      { latitude: 1.2018, longitude: -77.2662 },
      { latitude: 1.2150, longitude: -77.2710 },
      { latitude: 1.2289, longitude: -77.2840 },
    ],
    stops: [
      { id: 's-e4-1', name: 'Barrio Lorenzo', orderIndex: 1, location: { latitude: 1.2050, longitude: -77.2880 }, estimatedWaitMinutes: 5, isTerminal: true },
      { id: 's-e4-2', name: 'Terminal de Transportes', orderIndex: 2, location: { latitude: 1.2018, longitude: -77.2662 }, estimatedWaitMinutes: 11 },
      { id: 's-e4-3', name: 'Glorieta San Ezequiel', orderIndex: 3, location: { latitude: 1.2289, longitude: -77.2840 }, estimatedWaitMinutes: 17, isTerminal: true },
    ]
  }
];
