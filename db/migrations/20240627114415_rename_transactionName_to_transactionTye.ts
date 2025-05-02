import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('transactions', function (table) {
    table.renameColumn('transactionName', 'transactionType');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('transactions', function (table) {
    table.renameColumn('transactionType', 'transactionName');
  });
}
