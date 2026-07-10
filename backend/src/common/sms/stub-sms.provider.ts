import { Injectable, Logger } from '@nestjs/common';
import { ISmsProvider, SendSmsInput } from './sms-provider.port';
import { SmsLogService } from './sms-log.service';

// No-op provider for MVP/dev: logs instead of sending. Swap via SMS_PROVIDER=vonage
// once real credentials exist, without touching NotificationsService.
@Injectable()
export class StubSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(StubSmsProvider.name);

  constructor(private readonly smsLog: SmsLogService) {}

  async send(input: SendSmsInput): Promise<void> {
    this.logger.log(`[stub-sms] to=${input.to} body="${input.body}"`);
    await this.smsLog.record({ to: input.to, provider: 'stub', success: true });
  }
}
