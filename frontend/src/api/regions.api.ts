import { apiClient } from './client';
import type { components } from './schema';

export type Region = components['schemas']['RegionResponseDto'];
export type CreateRegionRequest = components['schemas']['CreateRegionDto'];
export type UpdateRegionRequest = components['schemas']['UpdateRegionDto'];

export async function listRegions(includeInactive = false): Promise<Region[]> {
  const { data } = await apiClient.get<Region[]>('/regions', { params: { includeInactive } });
  return data;
}

export async function createRegion(payload: CreateRegionRequest): Promise<Region> {
  const { data } = await apiClient.post<Region>('/regions', payload);
  return data;
}

export async function updateRegion(id: string, payload: UpdateRegionRequest): Promise<Region> {
  const { data } = await apiClient.patch<Region>(`/regions/${id}`, payload);
  return data;
}

export async function deactivateRegion(id: string): Promise<void> {
  await apiClient.delete(`/regions/${id}`);
}
