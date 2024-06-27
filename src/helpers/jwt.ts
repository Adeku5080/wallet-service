
// jwtHelper.js
import * as jwt from "jsonwebtoken"
export class JWT {
  private secret: string;
  private expiresIn: string;
  constructor(secret: string, expiresIn: string) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateToken(payload: any) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }
}
