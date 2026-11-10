import { TranslationSchema } from './translations.types';
import { es } from './locales/es';
import { en } from './locales/en';

export { TranslationSchema };

export const translations: Record<'es' | 'en', TranslationSchema> = {
  es,
  en,
};
