import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
      return knex.schema.table('accounts', function (table) {
       table.integer('userId').unsigned().notNullable();
       table
         .foreign('userId')
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');
      });
}


export async function down(knex: Knex): Promise<void> {
      return knex.schema.table('accounts', function (table) {
        table.dropForeign('userId');
        table.dropColumn('userId');
      });
}

