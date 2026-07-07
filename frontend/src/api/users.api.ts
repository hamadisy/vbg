import { apiClient } from './client';
import type { components } from './schema';

export type User = components['schemas']['UserResponseDto'];
export type CreateUserRequest = components['schemas']['CreateUserDto'];
export type UpdateUserRequest = components['schemas']['UpdateUserDto'];
export type Role = User['role'];

export interface UserListFilters {
  role?: Role;
  regionId?: string;
}

export async function listUsers(filters: UserListFilters = {}): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/users', { params: filters });
  return data;
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
  const { data } = await apiClient.post<User>('/users', payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserRequest): Promise<User> {
  const { data } = await apiClient.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
