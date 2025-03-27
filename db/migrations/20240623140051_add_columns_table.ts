import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.string('country').notNullable();
    table.string('state').notNullable();
    table.string('street').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', function (table) {
    table.dropColumn('country');
    table.dropColumn('state');
    table.dropColumn('street');
  });
}
