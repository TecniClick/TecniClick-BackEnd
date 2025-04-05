import { UserRole } from 'src/enums/UserRole.enum';

export interface IJwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
