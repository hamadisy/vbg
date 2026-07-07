import { apiClient } from './client';
import type { components } from './schema';

export type DashboardStats = components['schemas']['DashboardStatsResponseDto'];

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>('/dashboard');
  return data;
}
