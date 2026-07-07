import { apiClient } from './client';
import type { components } from './schema';

export type LoginRequest = components['schemas']['LoginDto'];
export type AuthTokenResponse = components['schemas']['AuthTokenResponseDto'];
export type ForgotPasswordRequest = components['schemas']['ForgotPasswordDto'];
export type ResetPasswordRequest = components['schemas']['ResetPasswordDto'];
export type CurrentUser = components['schemas']['UserResponseDto'];

export async function login(credentials: LoginRequest): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>('/auth/login', credentials);
  return data;
}

export async function me(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>('/auth/me');
  return data;
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload);
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/reset-password', payload);
}
