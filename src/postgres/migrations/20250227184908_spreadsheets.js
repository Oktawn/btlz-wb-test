/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("spreadsheets", (table) => {
        table.string("spreadsheet_id").primary();
        table.string("spreadsheet_name").nullable();
        table.string("sheet_name").nullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);

    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("spreadsheets");
}
