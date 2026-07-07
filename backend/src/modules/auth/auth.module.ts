import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../../common/mail/mail.module';
import { PasswordResetToken } from './entity/password-reset-token.entity';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from './entity/password-reset-token.repository.port';
import { PasswordResetTokenTypeOrmRepository } from './entity/password-reset-token.repository.adapter';
import { AuthService } from './control/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './boundary/auth.controller';

@Module({
  imports: [
    UsersModule,
    MailModule,
    PassportModule,
    TypeOrmModule.forFeature([PasswordResetToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwt.accessExpiresIn', '8h') as never,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    { provide: PASSWORD_RESET_TOKEN_REPOSITORY, useClass: PasswordResetTokenTypeOrmRepository },
  ],
})
export class AuthModule {}
