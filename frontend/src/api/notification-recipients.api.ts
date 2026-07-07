import { apiClient } from './client';
import type { components } from './schema';

export type NotificationRecipient = components['schemas']['NotificationRecipientResponseDto'];
export type CreateNotificationRecipientRequest =
  components['schemas']['CreateNotificationRecipientDto'];
export type UpdateNotificationRecipientRequest =
  components['schemas']['UpdateNotificationRecipientDto'];

export async function listNotificationRecipients(
  includeInactive = false,
): Promise<NotificationRecipient[]> {
  const { data } = await apiClient.get<NotificationRecipient[]>('/notification-recipients', {
    params: { includeInactive },
  });
  return data;
}

export async function createNotificationRecipient(
  payload: CreateNotificationRecipientRequest,
): Promise<NotificationRecipient> {
  const { data } = await apiClient.post<NotificationRecipient>('/notification-recipients', payload);
  return data;
}

export async function updateNotificationRecipient(
  id: string,
  payload: UpdateNotificationRecipientRequest,
): Promise<NotificationRecipient> {
  const { data } = await apiClient.patch<NotificationRecipient>(
    `/notification-recipients/${id}`,
    payload,
  );
  return data;
}

export async function deleteNotificationRecipient(id: string): Promise<void> {
  await apiClient.delete(`/notification-recipients/${id}`);
}
