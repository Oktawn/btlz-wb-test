import { google } from "googleapis";
import { apiGoogle } from "./api.js";
import { DBService } from "./db.service.js";

export class SheetsService {
  private db;
  private sheets;
  constructor() {
    this.db = new DBService();
    this.sheets = google.sheets({
      version: "v4",
      auth: apiGoogle
    });
  }
  async foo() {
    const activeSpreadsheet = await this.db.getActiveSpreadsheet();
    if (activeSpreadsheet === null) {

    }
  }

  async createSpreadsheet() {
    const t = new Intl.DateTimeFormat('sv-SE').format(new Date());
    try {
      const sheet = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Tariffs ${t}`
          }
        }

      });
      const spreadsheet_id = sheet.data.spreadsheetId as string;
      await this.renameSheet(spreadsheet_id, 0, "stocks_coefs");
      this.db.createSpreadsheet({
        spreadsheet_id: spreadsheet_id,
        sheet_name: "stocks_coefs",
        spreadsheet_name: `Tariffs ${t}`,
        is_active: true,
      });
    } catch (error) {
      console.error("Error creating spreadsheet:", error);
      return null;
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
                  title: newName
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
}