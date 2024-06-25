import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred',
      });
    }
    next();
  }
}
