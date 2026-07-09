export interface Translatable {
  locale: string;
  label: string;
}

// Locale match -> French fallback -> first available -> caller-supplied
// fallback. Mirrors the frontend's translateCategory
// (frontend/src/api/violence-categories.api.ts) so server-rendered text
// (e.g. SMS bodies) resolves labels the same way the UI does.
export function resolveTranslation(
  translations: Translatable[] | undefined,
  locale: string,
  fallbackLabel: string,
): string {
  if (!translations || translations.length === 0) {
    return fallbackLabel;
  }
  const match =
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === 'fr') ??
    translations[0];
  return match?.label ?? fallbackLabel;
}
