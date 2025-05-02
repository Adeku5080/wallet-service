import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
     return knex.schema.alterTable('funding_sources', function (table) {
       table.dropColumn('accountNumber');
     });
}


export async function down(knex: Knex): Promise<void> {
}

