import { SetMetadata } from '@nestjs/common';
import { ScopeMetadata } from '../interfaces/scope-metadata.interface';

export const SCOPE_REGION_KEY = 'scopeByRegion';

/**
 * Restricts a route to same-region access for Regional Director.
 * No-op for Administrator/Institutional User; Community Relay uses @ScopeByOwner instead.
 */
export const ScopeByRegion = (token: unknown, paramName = 'id') =>
  SetMetadata<string, ScopeMetadata>(SCOPE_REGION_KEY, { token, paramName });
