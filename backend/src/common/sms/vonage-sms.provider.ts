import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';
import { SMSFailure } from '@vonage/sms';
import { ISmsProvider, SendSmsInput } from './sms-provider.port';
import { SmsLogService } from './sms-log.service';

// Only reached when SMS_PROVIDER=vonage and real credentials are configured.
// Sends via Vonage's legacy SMS API (client.sms.send), which requires apiKey
// + apiSecret and expects "to" in E.164 without a leading '+'.
@Injectable()
export class VonageSmsProvider implements ISmsProvider {
  private readonly client: Vonage;
  private readonly senderId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly smsLog: SmsLogService,
  ) {
    this.client = new Vonage({
      apiKey: this.configService.get<string>('app.sms.vonage.apiKey'),
      apiSecret: this.configService.get<string>('app.sms.vonage.apiSecret'),
    });
    this.senderId = this.configService.get<string>('app.sms.vonage.senderId', 'VBG');
  }

  async send(input: SendSmsInput): Promise<void> {
    try {
      const response = await this.client.sms.send({
        to: input.to,
        from: this.senderId,
        text: input.body,
      });
      await this.smsLog.record({
        to: input.to,
        provider: 'vonage',
        success: true,
        messageId: response.messages[0]?.['message-id'],
      });
    } catch (error) {
      // The SDK rejects with SMSFailure when Vonage itself refuses/undelivers
      // the message (e.g. unroutable destination, unauthorized sender ID,
      // non-whitelisted number on trial accounts) - the useful detail (status
      // code + reason) lives on the error, not on a resolved response.
      if (error instanceof SMSFailure) {
        const [failed] = error.getFailedMessages();
        await this.smsLog.record({
          to: input.to,
          provider: 'vonage',
          success: false,
          reason: failed?.errorText ?? error.message,
          errorCode: failed?.status,
        });
      } else {
        await this.smsLog.record({
          to: input.to,
          provider: 'vonage',
          success: false,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
      throw error;
    }
  }
}
