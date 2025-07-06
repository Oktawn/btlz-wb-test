import { google } from "googleapis";
import { apiGoogle } from "./api.js";
import { DBService } from "./db.service.js";

export class SheetsService {
  private db;
  private sheets;
  private drive;
  constructor() {
    this.db = new DBService();
    this.sheets = google.sheets({
      version: "v4",
      auth: apiGoogle
    });
    this.drive = google.drive({
      version: "v3",
      auth: apiGoogle
    });
  }
  async updateDateSpreadsheet(date: string) {
    let activeSpreadsheet = await this.db.getActiveSpreadsheet();
    if (activeSpreadsheet === null) {
      await this.createSpreadsheet();
      activeSpreadsheet = await this.db.getActiveSpreadsheet();
    }
    if (activeSpreadsheet) {
      const spreadsheetId = activeSpreadsheet.spreadsheet_id;
      const sheetName = activeSpreadsheet.sheet_name;
      try {
        const data = await this.db.getTariffsByDate(date);
        if (data.length === 0) {
          console.error("No tariffs found for the given date.");
          return;
        }
        const sortedData = data.sort((a, b) => {
          return parseFloat(a.box_delivery_and_storage_expr) - parseFloat(b.box_delivery_and_storage_expr);
        });
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: spreadsheetId,
          range: `${sheetName}!A2:G`,
          valueInputOption: "RAW",
          requestBody: {
            values: sortedData.map((item) => [
              item.tariff_date,
              item.box_delivery_and_storage_expr,
              item.box_delivery_base,
              item.box_delivery_liter,
              item.box_storage_base,
              item.box_storage_liter,
              item.warehouse_name
            ])
          }
        })
      } catch (error) {
        console.error("Error updating date in spreadsheet:", error);
      }
    } else {
      console.error("No active spreadsheet found.");
    }
  }

  async createSpreadsheet() {
    const t = new Intl.DateTimeFormat('sv-SE').format(new Date());
    try {
      const sheet = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Tariffs-${t}`

          },
        }

      });
      const spreadsheet_id = sheet.data.spreadsheetId as string;
      await this.renameSheet(spreadsheet_id, 0, "stocks_coefs");
      await this.createHeaders(spreadsheet_id);
      await this.makePublic(spreadsheet_id);
      this.db.createSpreadsheet({
        spreadsheet_id: spreadsheet_id,
        sheet_name: "stocks_coefs",
        spreadsheet_name: `Tariffs-${t}`,
        is_active: true,
      });
    } catch (error) {
      console.error("Error creating spreadsheet:", error);
    }
  }

  async renameSheet(spreadsheetId: string, sheetId: number, newName: string) {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              updateSheetProperties: {
                properties: {
                  sheetId: sheetId,
                  title: newName,
                },
                fields: "title"
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error("Error renaming spreadsheet:", error);
      return null;
    }
  }

  async createHeaders(spreadsheetId: string) {
    const headers = [
      "Tariff Date",
      "Box Delivery and Storage Expr",
      "Box Delivery Base",
      "Box Delivery Liter",
      "Box Storage Base",
      "Box Storage Liter",
      "Warehouse Name",
    ];
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "stocks_coefs!A1:G1",
        valueInputOption: "RAW",
        requestBody: {
          values: [headers]
        }
      });
    } catch (error) {
      console.error("Error creating headers in spreadsheet:", error);
    }
  }

  async makePublic(spreadsheetId: string) {
    try {
      await this.drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: "reader",
          type: "anyone"
        }
      });
      console.log(`Spreadsheet ${spreadsheetId} is now public.`);
    } catch (error) {
      console.error("Error making spreadsheet public:", error);
    }

  }
}