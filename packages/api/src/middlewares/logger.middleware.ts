import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, headers } = request;
    let userInfo: User | null = null;
    if (headers['authorization']) {
      const authorization = headers['authorization'];
      const jwt = authorization.replace('Bearer ', '');
      userInfo = this.jwtService.decode(jwt, { json: true });
    }
    response.on('close', () => {
      const { statusCode } = response;
      if (method !== 'OPTIONS') {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} with user id ${userInfo?.id}`,
        );
      }
    });

    next();
  }
}
