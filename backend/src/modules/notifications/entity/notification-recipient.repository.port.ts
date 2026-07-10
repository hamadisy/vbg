import { ICrudRepository } from '../../../common/base/base-repository.port';
import { NotificationRecipient } from './notification-recipient.entity';

export const NOTIFICATION_RECIPIENT_REPOSITORY = Symbol('NOTIFICATION_RECIPIENT_REPOSITORY');

export interface NotificationRecipientQueryOptions {
  regionId?: string;
  includeInactive?: boolean;
}

export interface UpdateNotificationRecipientInput {
  name?: string;
  phone?: string;
  regionId?: string | null;
  violenceCategoryId?: string | null;
  isActive?: boolean;
  language?: string;
}

export interface INotificationRecipientRepository extends ICrudRepository<NotificationRecipient> {
  findAllFiltered(options: NotificationRecipientQueryOptions): Promise<NotificationRecipient[]>;
  update(id: string, data: UpdateNotificationRecipientInput): Promise<NotificationRecipient>;
  // Active recipients whose regionId/violenceCategoryId either match the case's
  // or are null (null = "all regions"/"all categories").
  findMatching(regionId: string, violenceCategoryId: string): Promise<NotificationRecipient[]>;
  // Hard delete - unlike Region/ViolenceCategory/ReferralStructure, nothing
  // holds a FK to a NotificationRecipient, so there's no referential-integrity
  // reason to only soft-deactivate it.
  remove(id: string): Promise<void>;
}
