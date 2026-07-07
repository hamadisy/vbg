import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../../../common/interfaces/authenticated-request.interface';

export interface JwtPayload {
  sub: string;
  username: string;
  role: AuthenticatedUser['role'];
  regionId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Presence enforced at startup by validation.schema.ts (JWT_ACCESS_SECRET required).
      secretOrKey: configService.get<string>('app.jwt.accessSecret')!,
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      regionId: payload.regionId,
    };
  }
}
