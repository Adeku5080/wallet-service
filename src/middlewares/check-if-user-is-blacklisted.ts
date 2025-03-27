import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import { Service } from 'typedi';
import { checkKarmaForCustomer } from '../helpers/check-if-user-is-blacklisted';

@Service()
export class CheckIfUserIsBlacklisted implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;
    const { blacklisted } = await checkKarmaForCustomer(email);

    if (blacklisted) {
      throw new CustomError('User with this email cannot be unboarded', 403);
    }

    next();
  }
}
