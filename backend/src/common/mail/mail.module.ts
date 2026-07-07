import { Module } from '@nestjs/common';
import { MAIL_PROVIDER } from './mail-provider.port';
import { StubMailProvider } from './stub-mail.provider';

@Module({
  providers: [{ provide: MAIL_PROVIDER, useClass: StubMailProvider }],
  exports: [MAIL_PROVIDER],
})
export class MailModule {}
