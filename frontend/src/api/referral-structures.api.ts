import { apiClient } from './client';
import type { components } from './schema';

export type ReferralStructure = components['schemas']['ReferralStructureResponseDto'];
export type CreateReferralStructureRequest = components['schemas']['CreateReferralStructureDto'];
export type UpdateReferralStructureRequest = components['schemas']['UpdateReferralStructureDto'];
export type ReferralStructureType = ReferralStructure['type'];

export async function listReferralStructures(
  regionId?: string,
  includeInactive = false,
): Promise<ReferralStructure[]> {
  const { data } = await apiClient.get<ReferralStructure[]>('/referral-structures', {
    params: { regionId, includeInactive },
  });
  return data;
}

export async function createReferralStructure(
  payload: CreateReferralStructureRequest,
): Promise<ReferralStructure> {
  const { data } = await apiClient.post<ReferralStructure>('/referral-structures', payload);
  return data;
}

export async function updateReferralStructure(
  id: string,
  payload: UpdateReferralStructureRequest,
): Promise<ReferralStructure> {
  const { data } = await apiClient.patch<ReferralStructure>(`/referral-structures/${id}`, payload);
  return data;
}

export async function deactivateReferralStructure(id: string): Promise<void> {
  await apiClient.delete(`/referral-structures/${id}`);
}
