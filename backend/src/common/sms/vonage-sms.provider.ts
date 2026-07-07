import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';
import { ISmsProvider, SendSmsInput } from './sms-provider.port';

// Only reached when SMS_PROVIDER=vonage and real credentials are configured -
// unverified against a live Vonage account (none exists yet); re-check the
// @vonage/server-sdk API surface once real testing is possible.
@Injectable()
export class VonageSmsProvider implements ISmsProvider {
  private readonly client: Vonage;
  private readonly senderId: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Vonage({
      apiKey: this.configService.get<string>('app.sms.vonage.apiKey'),
      apiSecret: this.configService.get<string>('app.sms.vonage.apiSecret'),
    });
    this.senderId = this.configService.get<string>('app.sms.vonage.senderId', 'VBG');
  }

  async send(input: SendSmsInput): Promise<void> {
    await this.client.sms.send({
      to: input.to,
      from: this.senderId,
      text: input.body,
    });
  }
}
