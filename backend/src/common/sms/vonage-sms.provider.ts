import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vonage } from '@vonage/server-sdk';
import { ISmsProvider, SendSmsInput } from './sms-provider.port';

// Only reached when SMS_PROVIDER=vonage and real credentials are configured.
// Sends via Vonage's legacy SMS API (client.sms.send), which requires apiKey
// + apiSecret and expects "to" in E.164 without a leading '+'.
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
