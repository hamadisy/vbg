import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsModule } from '../../common/sms/sms.module';
import { NotificationRecipient } from './entity/notification-recipient.entity';
import { NOTIFICATION_RECIPIENT_REPOSITORY } from './entity/notification-recipient.repository.port';
import { NotificationRecipientTypeOrmRepository } from './entity/notification-recipient.repository.adapter';
import { NotificationRecipientsController } from './boundary/notification-recipients.controller';
import { NotificationRecipientsService } from './control/notification-recipients.service';
import { NotificationsService } from './control/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationRecipient]), SmsModule],
  controllers: [NotificationRecipientsController],
  providers: [
    NotificationsService,
    NotificationRecipientsService,
    {
      provide: NOTIFICATION_RECIPIENT_REPOSITORY,
      useClass: NotificationRecipientTypeOrmRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
