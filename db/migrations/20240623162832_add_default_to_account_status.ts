import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
      return knex.schema.alterTable('accounts', function (table) {
        table.boolean('accountStatus').notNullable().defaultTo(false).alter();
      });
}


export async function down(knex: Knex): Promise<void> {
      return knex.schema.alterTable('accounts', function (table) {
        table.boolean('accountStatus').notNullable().alter();
      });
}

