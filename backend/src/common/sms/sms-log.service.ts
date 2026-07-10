import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appendFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export interface SmsLogEntry {
  to: string;
  provider: string;
  success: boolean;
  reason?: string;
  errorCode?: string;
  messageId?: string;
}

// Dedicated append-only log of every SMS send attempt (success or failure),
// separate from general app logs, so delivery problems for a specific
// destination/country can be audited without digging through console output.
@Injectable()
export class SmsLogService {
  private readonly logger = new Logger(SmsLogService.name);
  private readonly filePath: string;
  private readonly dirReady: Promise<void>;

  constructor(private readonly configService: ConfigService) {
    this.filePath = this.configService.get<string>('app.sms.logFile', './logs/sms.log');
    this.dirReady = mkdir(dirname(this.filePath), { recursive: true }).then(() => undefined);
  }

  async record(entry: SmsLogEntry): Promise<void> {
    const line = JSON.stringify({ timestamp: new Date().toISOString(), ...entry });

    if (entry.success) {
      this.logger.log(`to=${entry.to} provider=${entry.provider} status=success`);
    } else {
      this.logger.warn(
        `to=${entry.to} provider=${entry.provider} status=failed reason="${entry.reason}"`,
      );
    }

    try {
      await this.dirReady;
      await appendFile(this.filePath, line + '\n', 'utf8');
    } catch (error) {
      this.logger.error(
        `Failed to write to SMS log file ${this.filePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
