import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.header('Authorization').replace('Bearer ', '');
    console.log(token)
    try {
      request.user = await this.authService.verifyToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }
}
