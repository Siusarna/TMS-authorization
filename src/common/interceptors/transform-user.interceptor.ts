import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../auth/entities/user.entity';

export type TransformedUser = Omit<User, 'password' | 'passwordVersion' | 'iv'>;

@Injectable()
export class TransformUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedUser> {
    return next.handle().pipe(
      map((data) => {
        const { password, passwordVersion, iv, ...rest } = data;
        return rest;
      }),
    );
  }
}
