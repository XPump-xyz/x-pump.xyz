import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        console.log(`Url: ${request.url}`);
        console.log(`Method: ${request.method}`);
        console.log(`Body: ${JSON.stringify(request.body)}`);
        console.log(`User: ${JSON.stringify(request.user)}`);
      }),
    );
  }
}
