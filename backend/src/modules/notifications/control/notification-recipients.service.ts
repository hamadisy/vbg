import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  INotificationRecipientRepository,
  NOTIFICATION_RECIPIENT_REPOSITORY,
} from '../entity/notification-recipient.repository.port';
import { NotificationRecipient } from '../entity/notification-recipient.entity';
import { CreateNotificationRecipientDto } from '../boundary/dto/create-notification-recipient.dto';
import { UpdateNotificationRecipientDto } from '../boundary/dto/update-notification-recipient.dto';
import { QueryNotificationRecipientsDto } from '../boundary/dto/query-notification-recipients.dto';

@Injectable()
export class NotificationRecipientsService {
  constructor(
    @Inject(NOTIFICATION_RECIPIENT_REPOSITORY)
    private readonly recipients: INotificationRecipientRepository,
  ) {}

  create(dto: CreateNotificationRecipientDto): Promise<NotificationRecipient> {
    return this.recipients.create(dto);
  }

  findAll(query: QueryNotificationRecipientsDto): Promise<NotificationRecipient[]> {
    return this.recipients.findAllFiltered({
      regionId: query.regionId,
      includeInactive: query.includeInactive ?? false,
    });
  }

  async findById(id: string): Promise<NotificationRecipient> {
    const recipient = await this.recipients.findById(id);
    if (!recipient) {
      throw new NotFoundException('Notification recipient not found');
    }
    return recipient;
  }

  async update(id: string, dto: UpdateNotificationRecipientDto): Promise<NotificationRecipient> {
    await this.findById(id);
    return this.recipients.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.recipients.remove(id);
  }
}
