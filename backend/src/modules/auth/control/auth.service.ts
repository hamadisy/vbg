import { createHash, randomBytes } from 'crypto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '../../users/entity/user.repository.port';
import { User } from '../../users/entity/user.entity';
import {
  IPasswordResetTokenRepository,
  PASSWORD_RESET_TOKEN_REPOSITORY,
} from '../entity/password-reset-token.repository.port';
import { IMailProvider, MAIL_PROVIDER } from '../../../common/mail/mail-provider.port';
import { AuthTokenResponseDto } from '../boundary/dto/auth-token-response.dto';
import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: IUserRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly resetTokens: IPasswordResetTokenRepository,
    @Inject(MAIL_PROVIDER) private readonly mail: IMailProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.users.findByUsername(username);
    if (!user) {
      return null;
    }
    const matches = await bcrypt.compare(password, user.passwordHash);
    return matches ? user : null;
  }

  login(user: User): AuthTokenResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      regionId: user.regionId ?? null,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>('app.jwt.accessExpiresIn', '8h'),
    };
  }

  // Always resolves the same way regardless of whether the email matched,
  // to avoid leaking which emails are registered (user enumeration).
  async forgotPassword(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) {
      return;
    }
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const ttlMinutes = this.configService.get<number>('app.passwordResetTokenTtlMinutes', 30);
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000);
    await this.resetTokens.create({ userId: user.id, tokenHash, expiresAt });

    await this.mail.send({
      to: user.email ?? '',
      subject: 'VBG - Password reset request',
      text: `Use this token to reset your password (valid ${ttlMinutes} minutes): ${rawToken}`,
    });
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    const resetToken = await this.resetTokens.findValidByTokenHash(tokenHash);
    if (!resetToken) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
    const saltRounds = this.configService.get<number>('app.bcryptSaltRounds', 12);
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await this.users.update(resetToken.userId, { passwordHash });
    await this.resetTokens.markUsed(resetToken.id);
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
