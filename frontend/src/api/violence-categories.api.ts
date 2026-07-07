import { apiClient } from './client';
import type { components } from './schema';

export type ViolenceCategory = components['schemas']['ViolenceCategoryResponseDto'];
export type CreateViolenceCategoryRequest = components['schemas']['CreateViolenceCategoryDto'];
export type UpdateViolenceCategoryRequest = components['schemas']['UpdateViolenceCategoryDto'];
export type Translation = components['schemas']['TranslationDto'];

export async function listViolenceCategories(includeInactive = false): Promise<ViolenceCategory[]> {
  const { data } = await apiClient.get<ViolenceCategory[]>('/violence-categories', {
    params: { includeInactive },
  });
  return data;
}

export async function createViolenceCategory(
  payload: CreateViolenceCategoryRequest,
): Promise<ViolenceCategory> {
  const { data } = await apiClient.post<ViolenceCategory>('/violence-categories', payload);
  return data;
}

export async function updateViolenceCategory(
  id: string,
  payload: UpdateViolenceCategoryRequest,
): Promise<ViolenceCategory> {
  const { data } = await apiClient.patch<ViolenceCategory>(`/violence-categories/${id}`, payload);
  return data;
}

export async function deactivateViolenceCategory(id: string): Promise<void> {
  await apiClient.delete(`/violence-categories/${id}`);
}

// Picks the translation for the given locale, falling back to French (the
// spec's default language), then to the first available translation.
export function translateCategory(category: ViolenceCategory, locale: string): string {
  const match =
    category.translations.find((t) => t.locale === locale) ??
    category.translations.find((t) => t.locale === 'fr') ??
    category.translations[0];
  return match?.label ?? category.code;
}
