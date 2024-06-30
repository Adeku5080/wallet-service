import {
  DeleteByParams,
  FindByParams,
  Repository,
} from '../interface/repository.interface';
import { Account } from '../types/acount-type';
import { User } from '../types/user-type';
import knex from 'knex';

import knexConfig from '../knexfile';
import { Service } from 'typedi';

const db = knex(knexConfig.development);

@Service()
export class FundingSourceRepository implements Repository {
  findBy(params: FindByParams) {
    return db('funding_sources').where(params).first();
  }

  create(fundingSource: any) {
    return db('funding_sources').insert(fundingSource);
  }

  async update() {}

  delete(params: DeleteByParams) {
    return db('funding_sources').where(params).delete();
  }

  findAll(params: FindByParams) {
    return db('funding_sources').where(params);
  }
}
