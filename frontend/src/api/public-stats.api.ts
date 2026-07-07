import { apiClient } from './client';

export async function getOpenCasesCount(): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>('/public-stats/open-cases-count');
  return data.count;
}
