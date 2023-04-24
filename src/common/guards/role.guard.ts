import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
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
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const req: RequestWithUser = context.switchToHttp().getRequest();
      const user = req.user;
      console.log(user);

      return user.roles.some((role) => requiredRoles.includes(role));
    } catch (e) {
      throw new HttpException('Forbidden by Role', HttpStatus.FORBIDDEN);
    }
  }
}
