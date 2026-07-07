import { SetMetadata } from '@nestjs/common';
import { ScopeMetadata } from '../interfaces/scope-metadata.interface';

export const SCOPE_OWNER_KEY = 'scopeByOwner';

/**
 * Restricts a route to the resource's creator for Community Relay.
 * No-op for other roles; Regional Director uses @ScopeByRegion instead.
 */
export const ScopeByOwner = (token: unknown, paramName = 'id') =>
  SetMetadata<string, ScopeMetadata>(SCOPE_OWNER_KEY, { token, paramName });
