import { Service } from 'typedi';
import { LoginBody } from '../types/login-body';
import { RegisterBody } from '../types/register-body';

@Service()
export class UserRepository {
  public async login(body: LoginBody) {
    
  }

  public async register(body: RegisterBody) {}
}
