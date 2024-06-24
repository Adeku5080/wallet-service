import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt-payload'; // Adjust path as per your project structure
import { Service } from 'typedi';

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      console.log('No authorization header provided');
      throw Error('No authorization header');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      console.log('Authentication failed: No token provided');
      return;
    }

    try {
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        return;
      }

      const payload = jwt.verify(token, secretKey) as JwtPayload;
        req.headers['id'] = payload.id;
      next();
    } catch (err) {
      console.log('Invalid token:', err);
      {
        console.log(err);
      }
    }
    // next();
  }
}
