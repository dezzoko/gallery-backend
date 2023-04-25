import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import RequestWithUser from '../interfaces/request-with-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: RequestWithUser = context.switchToHttp().getRequest();
    const user = req.user;
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;
    if (
      !requiredRoles.reduce((prev, cur) => {
        return prev && user.roles.includes(cur);
      }, true)
    )
      throw new ForbiddenException({
        message: 'Permission denied',
        roles: requiredRoles.filter((role) => !user.roles.includes(role)),
      });

    return true;
  }
}
