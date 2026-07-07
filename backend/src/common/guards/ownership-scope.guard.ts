import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { SCOPE_OWNER_KEY } from '../decorators/scope-by-owner.decorator';
import { ScopeMetadata } from '../interfaces/scope-metadata.interface';
import { Role } from '../enums/role.enum';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { HasOwner } from '../interfaces/has-owner.interface';
import { ICrudRepository } from '../base/base-repository.port';

/**
 * Only activates for Community Relay. Authorization/ownership only - the
 * "editable only while Acknowledged/InProcess" workflow rule belongs in
 * CasesService, not here.
 */
@Injectable()
export class OwnershipScopeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.getAllAndOverride<ScopeMetadata | undefined>(SCOPE_OWNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!meta) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.user?.role !== Role.CommunityRelay) {
      return true;
    }

    const repo = this.moduleRef.get<ICrudRepository<HasOwner>>(meta.token as never, {
      strict: false,
    });
    const resourceId = request.params[meta.paramName] as string;
    const resource = await repo.findById(resourceId);
    if (!resource) {
      throw new NotFoundException();
    }
    if (resource.createdById !== request.user.id) {
      throw new ForbiddenException('You can only access your own cases');
    }
    request.scopedResource = resource;
    return true;
  }
}
