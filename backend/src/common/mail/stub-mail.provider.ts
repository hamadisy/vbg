import { Injectable, Logger } from '@nestjs/common';
import { IMailProvider, SendMailInput } from './mail-provider.port';

// No-op provider for MVP: logs instead of sending. Swap via MAIL_PROVIDER token
// for a real SMTP implementation later without touching AuthService.
@Injectable()
export class StubMailProvider implements IMailProvider {
  private readonly logger = new Logger(StubMailProvider.name);

  send(input: SendMailInput): Promise<void> {
    this.logger.log(`[stub-mail] to=${input.to} subject="${input.subject}"`);
    return Promise.resolve();
  }
}
