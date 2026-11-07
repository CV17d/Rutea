import { TransitRoute } from '../types/route.types';
import { STANDARD_ROUTES_PART1 } from './routes/standardRoutes1';
import { STANDARD_ROUTES_PART2 } from './routes/standardRoutes2';
import { EXPRESS_ROUTES } from './routes/expressRoutes';

export const MOCK_PASTO_ROUTES: TransitRoute[] = [
  ...STANDARD_ROUTES_PART1,
  ...STANDARD_ROUTES_PART2,
  ...EXPRESS_ROUTES,
];
