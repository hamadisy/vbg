import { PasswordResetToken } from './password-reset-token.entity';

export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol('PASSWORD_RESET_TOKEN_REPOSITORY');

export interface CreatePasswordResetTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IPasswordResetTokenRepository {
  create(data: CreatePasswordResetTokenInput): Promise<PasswordResetToken>;
  findValidByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;
  markUsed(id: string): Promise<void>;
}
