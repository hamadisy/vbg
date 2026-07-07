import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { PasswordResetToken } from './password-reset-token.entity';
import {
  CreatePasswordResetTokenInput,
  IPasswordResetTokenRepository,
} from './password-reset-token.repository.port';

// Only file in this module allowed to import from 'typeorm'.
@Injectable()
export class PasswordResetTokenTypeOrmRepository implements IPasswordResetTokenRepository {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly repo: Repository<PasswordResetToken>,
  ) {}

  create(data: CreatePasswordResetTokenInput): Promise<PasswordResetToken> {
    return this.repo.save(this.repo.create(data));
  }

  findValidByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.repo.findOne({
      where: { tokenHash, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
    });
  }

  async markUsed(id: string): Promise<void> {
    await this.repo.update(id, { usedAt: new Date() });
  }
}
