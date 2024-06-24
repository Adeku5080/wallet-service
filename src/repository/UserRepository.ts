import { Service } from 'typedi';
import { LoginBody } from '../types/login-body';
import { RegisterBody } from '../types/register-body';
import knex from 'knex';
import knexConfig from '../knexfile';
import { User } from '../types/user-type';
import { RegisterDto } from '../dto/register-dto';
import { FindByParams, Repository } from '../interface/repository.interface';



const db = knex(knexConfig.development);
@Service()
export class UserRepository implements Repository{
  findBy(params:FindByParams):any {
  return db('users').where(params).first();
  }
  create(user: RegisterBody) {
    return db('users').insert(user)
  }
  update() {
  }
  delete() {
  }

  findAll() {
    
  }

  // public async login(body: LoginBody) {
  //   const user = await db('users').where({ email: body.email });

  //   if (!user) {
  //     console.log('the user with this credential does not exist');
  //   }
  // }

  // public async register(body: RegisterBody) {

  // }
}
