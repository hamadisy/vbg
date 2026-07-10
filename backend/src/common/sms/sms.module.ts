import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMS_PROVIDER } from './sms-provider.port';
import { SmsLogService } from './sms-log.service';
import { StubSmsProvider } from './stub-sms.provider';
import { VonageSmsProvider } from './vonage-sms.provider';

@Module({
  providers: [
    SmsLogService,
    StubSmsProvider,
    VonageSmsProvider,
    {
      provide: SMS_PROVIDER,
      inject: [ConfigService, VonageSmsProvider, StubSmsProvider],
      useFactory: (
        configService: ConfigService,
        vonage: VonageSmsProvider,
        stub: StubSmsProvider,
      ) => (configService.get<string>('app.sms.provider') === 'vonage' ? vonage : stub),
    },
  ],
  exports: [SMS_PROVIDER],
})
export class SmsModule {}
