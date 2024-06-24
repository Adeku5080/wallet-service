import { Service } from 'typedi';
import knex from 'knex';
import { Account } from '../types/acount-type';
import knexConfig from '../knexfile';
import { FindByParams, Repository } from '../interface/repository.interface';

const db = knex(knexConfig.development);

@Service()
export class AccountRepository implements Repository {
    findBy(params:FindByParams):any {
        return db('accounts').where(params).first();

  }
  create(account:any) {
    return db('accounts').insert(account);
  }

  update(id:any, changes:any) {
    return db('accounts').where('id',id).update(changes)
  }

  delete() {}

  findAll() {}
}

//account name,
//account number(account service),generate account number service
//user_id
//account type:enum[savings,wallet]
//account_status;[boolean]
