// src/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[Request] ${req.method} - ${req.originalUrl}`);
    res.on('finish', () => {
      console.log(
        `[Response] ${req.method} - ${req.originalUrl} - ${res.statusCode}`,
      );
    });
    next();
  }
}
