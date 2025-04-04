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
  async create(user: RegisterBody) {
    // return db('users').insert(user)
    const [userId] =await db('users').insert(user).returning('id'); // Returns the new user's ID
    return db('users').where({ id: userId }).first();
  }
update() {
  }
  delete() {
  }

  findAll() {
    
  }


}
