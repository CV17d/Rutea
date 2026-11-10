import { useMemo } from 'react';
import { Palette } from '../constants/palette';
import { useAppTheme } from './useAppTheme';

/** Crea (y memoriza) los estilos de un componente a partir de la paleta activa claro/oscuro. */
export function useThemedStyles<T>(factory: (palette: Palette) => T): T {
  const { palette } = useAppTheme();
  return useMemo(() => factory(palette), [factory, palette]);
}
