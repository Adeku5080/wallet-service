import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';
import { Service } from 'typedi';
import { ValidationError } from 'class-validator';


@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(err: any, req: Request, res: Response, next: NextFunction) {

    if (err instanceof CustomError) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } 
    console.log(typeof err);

    if (Array.isArray(err) && err.every((e) => e instanceof ValidationError)) {
      // Handle `class-validator` errors
      const formattedErrors = err.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));

      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

      if (err instanceof ValidationError) {
        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: [
            {
              property: err.property,
              constraints: err.constraints,
            },
          ],
        });
      }

       
    return res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
  }
}
