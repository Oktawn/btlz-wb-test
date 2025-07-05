/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("warehouse_tariffs", (table) => {
        table.increments("id").primary();
        table.string("tariff_date").notNullable();
        table.string("warehouse_name");
        table.string("box_delivery_and_storage_expr");
        table.string("box_delivery_base");
        table.string("box_delivery_liter");
        table.string("box_storage_base");
        table.string("box_storage_liter");
        table.timestamps(true, true);

        table.unique(["tariff_date", "warehouse_name"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists("warehouse_tariffs");
}
