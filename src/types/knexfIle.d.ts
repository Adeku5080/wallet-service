import { Knex } from 'knex';

export interface KnexConfig {
  development: Knex.Config;
  production: Knex.Config;
}
