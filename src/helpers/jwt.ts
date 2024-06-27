
// jwtHelper.js
import * as jwt from "jsonwebtoken"
import { Service } from "typedi";
@Service()
export class JWT {
  private secret: string;
  private expiresIn: string;
  constructor(secret: string, expiresIn: string) {
    this.secret = process.env.JWT_SECRET as string;
    this.expiresIn = process.env.JWT_LIFETIME as string;
  }

  generateToken(payload: any) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }
}
