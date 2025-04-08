import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/enums/UserRole.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException(
        'No se encontró un usuario autenticado con rol válido',
      );
    }

    const roleHierarchy: Record<UserRole, UserRole[]> = {
      [UserRole.SUPERADMIN]: [
        UserRole.SUPERADMIN,
        UserRole.ADMIN,
        UserRole.PROVIDER,
        UserRole.CUSTOMER,
      ],
      [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER],
      [UserRole.PROVIDER]: [UserRole.PROVIDER, UserRole.CUSTOMER],
      [UserRole.CUSTOMER]: [UserRole.CUSTOMER],
    };

    const userEffectiveRoles = roleHierarchy[user.role] || [];

    const hasPermission = requiredRoles.some((role) =>
      userEffectiveRoles.includes(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'No cuentas con los permisos necesarios para acceder a este contenido',
      );
    }

    return true;
  }
}
