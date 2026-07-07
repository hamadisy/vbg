import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { SCOPE_REGION_KEY } from '../decorators/scope-by-region.decorator';
import { ScopeMetadata } from '../interfaces/scope-metadata.interface';
import { Role } from '../enums/role.enum';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { HasRegion } from '../interfaces/has-region.interface';
import { ICrudRepository } from '../base/base-repository.port';

/**
 * Only activates for Regional Director (Admin/Institutional User are never
 * region-restricted; Community Relay is scoped by OwnershipScopeGuard instead).
 * Resolves the target repository dynamically via ModuleRef so this guard never
 * imports a feature module directly (would create circular module deps).
 */
@Injectable()
export class RegionScopeGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.getAllAndOverride<ScopeMetadata | undefined>(SCOPE_REGION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!meta) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.user?.role !== Role.RegionalDirector) {
      return true;
    }

    const repo = this.moduleRef.get<ICrudRepository<HasRegion>>(meta.token as never, {
      strict: false,
    });
    const resourceId = request.params[meta.paramName] as string;
    const resource = await repo.findById(resourceId);
    if (!resource) {
      throw new NotFoundException();
    }
    if (resource.regionId !== request.user.regionId) {
      throw new ForbiddenException('Resource is outside your assigned region');
    }
    request.scopedResource = resource;
    return true;
  }
}
