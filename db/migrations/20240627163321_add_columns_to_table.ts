import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('funding_sources', function (table) {
    table.string('token').notNullable();
    table.boolean('active').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('transactions', function (table) {
    table.dropColumn('token');
    table.dropColumn('active');
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
}
