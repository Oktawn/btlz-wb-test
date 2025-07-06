import knex from "#postgres/knex.js";
import { WBTariffsRequest } from "#interfaces/wb-tariffs.interface.js";
import { SpreadsheetDB, WarehouseTariffDB } from "#interfaces/db.interface.js";

export class DBService {
  async saveTariffs(data: WBTariffsRequest) {
    const record: WarehouseTariffDB[] = data.data.warehouseList.map((w) => ({
      tariff_date: data.date,
      warehouse_name: w.warehouseName,
      box_delivery_and_storage_expr: w.boxDeliveryAndStorageExpr,
      box_delivery_base: w.boxDeliveryBase,
      box_delivery_liter: w.boxDeliveryLiter,
      box_storage_base: w.boxStorageBase,
      box_storage_liter: w.boxStorageLiter
    }));
    try {
      const result = await knex.table("warehouse_tariffs")
        .insert(record)
        .onConflict(['tariff_date', 'warehouse_name'])
        .merge();
      return result.length;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };
  async getTariffsByDate(date: string): Promise<WarehouseTariffDB[]> {
    try {
      return await knex<WarehouseTariffDB>('warehouse_tariffs')
        .where('tariff_date', date)
        .orderBy("box_delivery_and_storage_expr", "asc");
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Spreadsheet 
  async createSpreadsheet(spreadsheet: SpreadsheetDB) {
    try {
      const result = await knex.table("spreadsheets")
        .insert(spreadsheet)
        .returning("*");
      return result[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getActiveSpreadsheet(): Promise<SpreadsheetDB | null> {
    try {
      return await knex('spreadsheets')
        .where('is_active', true)
        .select("*")
        .first();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async DeactiveSpreadsheet() {
    try {
      const result = await knex('spreadsheets')
        .where('is_active', true)
        .update({ is_active: false });
      return result;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

}