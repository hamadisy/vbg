import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AuthenticatedRequest,
  AuthenticatedUser,
} from '../interfaces/authenticated-request.interface';

export const CurrentUser = createParamDecorator(
  (field: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return field ? request.user?.[field] : request.user;
  },
);
