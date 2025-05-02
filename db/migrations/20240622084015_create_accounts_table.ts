import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', function (table) {
    table.increments('id').primary();
    table.string('accountName').notNullable();
    table.string('accountNumber').notNullable();
    table.enu('accountType', ['savings', 'current', 'wallet']).defaultTo('wallet');
    table.boolean('accountStatus').notNullable();
    table.string('currency').notNullable();
    table.bigInteger('balance').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('accounts');
}
