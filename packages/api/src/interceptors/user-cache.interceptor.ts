import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
@Injectable()
export class UserCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private jwtService: JwtService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (token) {
      const user = this.jwtService.decode(token.split(' ')[1]);
      const userId = user.id;
      const key = `${userId}:${request.url}`;
      const ttl = this.getTTL(context);
      if (ttl === 0) {
        return next.handle();
      }

      if (request.method === 'POST') {
        await this.cacheService.deleteCache(key);
        return next.handle();
      }
      const cachedData = await this.cacheService.getCache(key);
      if (cachedData) {
        return of(cachedData);
      }
      return next.handle().pipe(
        tap(async (data) => {
          await this.cacheService.setCache(key, data, ttl);
        }),
      );
    }
    return next.handle();
  }

  private getTTL(context: ExecutionContext): number {
    const reflector = new Reflector();
    const ttl = reflector.get<number>('cacheTTL', context.getHandler());
    const noCache = reflector.get<boolean>('noCache', context.getHandler());
    if (noCache) {
      return 0;
    }
    return ttl || 60 * 1000;
  }
}
