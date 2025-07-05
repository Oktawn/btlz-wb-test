/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("warehouse_box_tariffs", (table) => {
        table.string("id").primary();
        table.integer("warehouse_id").notNullable();
        table.integer("period_id").notNullable();
        table.decimal("delivery_and_storage_expr", 10, 2).notNullable();
        table.decimal("delivery_base", 10, 2).notNullable();
        table.decimal("delivery_liter", 10, 2).notNullable();
        table.decimal("storage_base", 10, 2).notNullable();
        table.decimal("storage_liter", 10, 2).notNullable();

        table.foreign("warehouse_id").references("id").inTable("warehouses").onDelete("CASCADE");
        table.foreign("period_id").references("id").inTable("periods").onDelete("CASCADE");

    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema;
}
