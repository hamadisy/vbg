import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotificationRecipient } from './notification-recipient.entity';
import { TypeOrmBaseRepository } from '../../../common/base/base-typeorm.repository';
import {
  INotificationRecipientRepository,
  NotificationRecipientQueryOptions,
  UpdateNotificationRecipientInput,
} from './notification-recipient.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class NotificationRecipientTypeOrmRepository
  extends TypeOrmBaseRepository<NotificationRecipient>
  implements INotificationRecipientRepository
{
  constructor(@InjectRepository(NotificationRecipient) repo: Repository<NotificationRecipient>) {
    super(repo);
  }

  findAllFiltered(options: NotificationRecipientQueryOptions): Promise<NotificationRecipient[]> {
    const where: FindOptionsWhere<NotificationRecipient> = {};
    if (options.regionId) where.regionId = options.regionId;
    if (!options.includeInactive) where.isActive = true;

    return this.repo.find({ where });
  }

  async update(id: string, data: UpdateNotificationRecipientInput): Promise<NotificationRecipient> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException('Notification recipient not found');
    }
    return updated;
  }

  findMatching(regionId: string, violenceCategoryId: string): Promise<NotificationRecipient[]> {
    return this.repo
      .createQueryBuilder('recipient')
      .where('recipient.isActive = :isActive', { isActive: true })
      .andWhere('(recipient.regionId IS NULL OR recipient.regionId = :regionId)', { regionId })
      .andWhere(
        '(recipient.violenceCategoryId IS NULL OR recipient.violenceCategoryId = :violenceCategoryId)',
        { violenceCategoryId },
      )
      .getMany();
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
