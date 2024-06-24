import { NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";


export class CheckIfUserIsBlacklisted implements ExpressMiddlewareInterface {
    use(req: Request, res: Response, next: NextFunction): void {
        if (req.body) {
            const { email } = req.body
            
        }
    }
}