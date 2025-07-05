export interface WarehouseTariffDB {
  tariff_date: string;
  warehouse_name: string;
  box_delivery_and_storage_expr: string;
  box_delivery_base: string;
  box_delivery_liter: string;
  box_storage_base: string;
  box_storage_liter: string;
}

export interface SpreadsheetDB {
  spreadsheet_id: string;
  spreadsheet_name?: string | null;
  sheet_name?: string | null;
  is_active: boolean;
}