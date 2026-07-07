import { apiClient } from './client';
import type { components } from './schema';

export type CreateCaseRequest = components['schemas']['CreateCaseDto'];
export type CreateVictimRequest = components['schemas']['CreateVictimDto'];
export type UpdateCaseRequest = components['schemas']['UpdateCaseDto'];
export type UpdateCaseStatusRequest = components['schemas']['UpdateCaseStatusDto'];
export type CreateFollowUpEntryRequest = components['schemas']['CreateFollowUpEntryDto'];
export type CaseResponse = components['schemas']['CaseResponseDto'];
export type CaseStatus = CaseResponse['status'];

export interface CaseListFilters {
  status?: CaseStatus;
  violenceCategoryId?: string;
  regionId?: string;
  search?: string;
}

export async function createCase(payload: CreateCaseRequest): Promise<CaseResponse> {
  const { data } = await apiClient.post<CaseResponse>('/cases', payload);
  return data;
}

export async function listCases(filters: CaseListFilters = {}): Promise<CaseResponse[]> {
  const { data } = await apiClient.get<CaseResponse[]>('/cases', { params: filters });
  return data;
}

export async function getCase(id: string): Promise<CaseResponse> {
  const { data } = await apiClient.get<CaseResponse>(`/cases/${id}`);
  return data;
}

export async function updateCase(id: string, payload: UpdateCaseRequest): Promise<CaseResponse> {
  const { data } = await apiClient.patch<CaseResponse>(`/cases/${id}`, payload);
  return data;
}

export async function updateCaseStatus(
  id: string,
  payload: UpdateCaseStatusRequest,
): Promise<CaseResponse> {
  const { data } = await apiClient.patch<CaseResponse>(`/cases/${id}/status`, payload);
  return data;
}

export async function addFollowUp(
  id: string,
  payload: CreateFollowUpEntryRequest,
): Promise<CaseResponse> {
  const { data } = await apiClient.post<CaseResponse>(`/cases/${id}/follow-up`, payload);
  return data;
}
