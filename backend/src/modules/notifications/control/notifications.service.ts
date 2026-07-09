import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMS_PROVIDER, ISmsProvider } from '../../../common/sms/sms-provider.port';
import { resolveTranslation } from '../../../common/utils/translation.util';
import {
  INotificationRecipientRepository,
  NOTIFICATION_RECIPIENT_REPOSITORY,
} from '../entity/notification-recipient.repository.port';
import { Case } from '../../cases/entity/case.entity';
import { renderNewCaseSms } from './new-case-sms.messages';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject(NOTIFICATION_RECIPIENT_REPOSITORY)
    private readonly recipients: INotificationRecipientRepository,
    @Inject(SMS_PROVIDER) private readonly sms: ISmsProvider,
    private readonly configService: ConfigService,
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

    const region = caseEntity.region?.name ?? caseEntity.regionId;
    const frontendUrl = this.configService.get<string>('app.frontendUrl');
    const caseLink = `${frontendUrl}/cases/${caseEntity.id}`;

    await Promise.all(
      matches.map((recipient) => {
        const violenceType = caseEntity.violenceCategory
          ? resolveTranslation(
              caseEntity.violenceCategory.translations,
              recipient.language,
              caseEntity.violenceCategory.code,
            )
          : (caseEntity.violenceCategoryId ?? '');
        const body = renderNewCaseSms(recipient.language, { violenceType, region, caseLink });

        return this.sms.send({ to: recipient.phone, body }).catch((error: unknown) => {
          this.logger.error(
            `Failed to notify ${recipient.phone} for case ${caseEntity.id}`,
            error instanceof Error ? error.stack : String(error),
          );
        });
      }),
    );
  }
}
