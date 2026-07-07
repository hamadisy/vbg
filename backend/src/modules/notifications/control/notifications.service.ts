import { Inject, Injectable, Logger } from '@nestjs/common';
import { SMS_PROVIDER, ISmsProvider } from '../../../common/sms/sms-provider.port';
import {
  INotificationRecipientRepository,
  NOTIFICATION_RECIPIENT_REPOSITORY,
} from '../entity/notification-recipient.repository.port';
import { Case } from '../../cases/entity/case.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(NOTIFICATION_RECIPIENT_REPOSITORY)
    private readonly recipients: INotificationRecipientRepository,
    @Inject(SMS_PROVIDER) private readonly sms: ISmsProvider,
  ) {}

  // Never throws - a failed/misconfigured notification must not fail case
  // creation. Per spec "Automatic Notifications": triggered on case submission only.
  async notifyNewCase(caseEntity: Case): Promise<void> {
    const matches = await this.recipients.findMatching(
      caseEntity.regionId,
      caseEntity.violenceCategoryId,
    );
    if (matches.length === 0) {
      return;
    }

    const regionLabel = caseEntity.region?.name ?? caseEntity.regionId;
    const categoryLabel = caseEntity.violenceCategory?.code ?? caseEntity.violenceCategoryId;
    const body = `New VBG case reported in ${regionLabel} (${categoryLabel}). Case ID: ${caseEntity.id}`;

    await Promise.all(
      matches.map((recipient) =>
        this.sms.send({ to: recipient.phone, body }).catch((error: unknown) => {
          this.logger.error(
            `Failed to notify ${recipient.phone} for case ${caseEntity.id}`,
            error instanceof Error ? error.stack : String(error),
          );
        }),
      ),
    );
  }
}
