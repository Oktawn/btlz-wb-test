/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{
            spreadsheet_id: "1pLcYFFygM6uD4Dqi1lDAluGmJKC2oId0MxpqtlESlsA",
            sheet_name: "stocks_coefs",

        }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
