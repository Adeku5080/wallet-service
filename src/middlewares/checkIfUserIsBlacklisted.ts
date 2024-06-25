import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { CustomError } from '../errors/customError';
import { Service } from 'typedi';

@Service()
export class CheckIfUserIsBlacklisted implements ExpressMiddlewareInterface {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const result = await checkKarmaForCustomer(email);
      if (result.message !== 'Identity not found in Karma') {
        throw new CustomError('You cannot be onboarded on this platform', 400);
      }

      next();
    } catch (error) {
      console.error('Error checking karma for customer:', error);
      res.status(500).json({ error: 'Failed to check karma for customer' });
    }
  }
}

const checkKarmaForCustomer = async (email: string) => {
  const config = {
    headers: { Authorization: `Bearer ${process.env.KARMA_BLACKLIST_TOKEN}` },
  };
  const res = await axios.get(
    `https://adjutor.lendsqr.com/v2/verification/karma/${email}`,
    config,
  );
  return res.data;
};
