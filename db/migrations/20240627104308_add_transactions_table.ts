import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.string('transactionName').notNullable();
    table.bigint('amount').notNullable();
    table.integer('userId').unsigned().notNullable();
    table.integer('accountId').unsigned().notNullable();
    table
      .foreign('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .foreign('accountId')
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions');
}

//transactiontype instead of name
//currency
//createdAt and updatedAt