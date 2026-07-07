import { Request } from 'express';
import { Role } from '../enums/role.enum';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: Role;
  regionId: string | null;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  scopedResource?: unknown;
}
