import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('transactions', function (table) {
    table.dropForeign('userId');
    table.dropColumn('userId');
  });
}

export async function down(knex: Knex): Promise<void> {}
