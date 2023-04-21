import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import RequestWithUser from '../interfaces/request-with-user';
import { log } from 'console';

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
      console.log(requiredRoles);

      const req: RequestWithUser = context.switchToHttp().getRequest();
      const user = req.user;
      console.log(user);

      return user.roles.some((role) => requiredRoles.includes(role));
    } catch (e) {
      console.log(e);
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
