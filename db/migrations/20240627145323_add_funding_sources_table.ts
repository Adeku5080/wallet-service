import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('funding_sources', function (table) {
    table.increments('id').primary();
    table.enu('fundingType', ['card', 'transfer']).defaultTo('card');
    table.string('accountNumber').notNullable();
    table
      .enu('accountType', ['savings', 'current', 'wallet'])
      .defaultTo('wallet');
    table.integer('userId').unsigned().notNullable();
    table
      .foreign('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('funding_sources');
}
