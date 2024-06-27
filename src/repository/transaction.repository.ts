import { FindByParams, Repository } from '../interface/repository.interface';
import knex from 'knex';

import knexConfig from '../../knexfile';
import { Service } from 'typedi';
import { Account } from '../types/acount-type';
import { User } from '../types/user-type';

const db = knex(knexConfig.development);

@Service()
export class TransactionRepistory implements Repository {
  findBy(params: FindByParams): any {
    return db('transactions').where(params).first();
  }

  create(transaction: any) {
    return db('transactions').insert(transaction);
  }

  async update(id: number, changes: any) {
    await db('transactions').where('id', id).update(changes);
    return db('transactions').where({ id }).first();
  }

  delete() {}

  findAll(params: FindByParams): any {
    return db('transactions').where(params);
  }
}
