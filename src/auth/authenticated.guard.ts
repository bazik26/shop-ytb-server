import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    console.log('🔵 Проверка аутентификации');
    console.log('🔵 req.user:', request.user);
    console.log('🔵 req.session:', request.session);

    return request.isAuthenticated();
  }
}

