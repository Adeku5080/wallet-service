import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table
      .uuid('id')
      .primary()
      .unique()
      .defaultTo(knex.raw('(UUID())'))
      .notNullable();
    table.string('name');
    table.string('email').unique();
    table.string('password');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
