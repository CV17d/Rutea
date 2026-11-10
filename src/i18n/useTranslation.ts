import { useSettingsStore, AppLanguage } from '../store/useSettingsStore';
import { translations, TranslationSchema } from './translations';

export function useTranslation() {
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations[language] || translations.es;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback || path;
      }
    }
    return typeof current === 'string' ? current : fallback || path;
  };

  return {
    t,
    language,
    setLanguage,
  };
}
