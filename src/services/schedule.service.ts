import nodeCron from "node-cron";
import { DBService } from "./db.service.js";
import { WBService } from "./wb.service.js";
import { SheetsService } from "./sheets.service.js";

export class ScheduleService {
  private db: DBService;
  private wbService: WBService;
  private sheetService: SheetsService;
  private isHourlyRunning = false;
  private isDailyRunning = false;

  constructor() {
    this.db = new DBService();
    this.wbService = new WBService();
    this.sheetService = new SheetsService();
  }

  async fetchData() {
    try {
      const t = new Intl.DateTimeFormat('sv-SE').format(new Date());

      const tariffsData = await this.wbService.getTariffs();

      await this.db.saveTariffs(tariffsData);

      await this.sheetService.updateDateSpreadsheet(t);
    } catch (error) {
      console.error('Error during fetchData:', error);
      throw error;
    }
  }
  startHourlySchedule() {
    if (this.isHourlyRunning) {
      console.warn('Hourly schedule is already running.');
      return;
    }
    this.isHourlyRunning = true;
    nodeCron.schedule('*/6 * * * *', async () => {
      try {
        await this.fetchData();
        console.log(`Data hourly fetched and saved for date: ${new Date().toISOString()}`);
      } catch (error) {
        console.error('Error during fetchData:', error);
      }
      finally {
        this.isHourlyRunning = false;
      }
    }, {
      timezone: 'Europe/Moscow'
    });
  }

  startDailySchedule() {
    nodeCron.schedule('0 */5 * * *', async () => {
      if (this.isDailyRunning) {
        console.warn('Daily schedule is already running.');
        return;
      }
      this.isDailyRunning = true;
      try {
        await this.db.DeactiveSpreadsheet();
        await this.sheetService.createSpreadsheet();
        await this.fetchData();
        console.log(`Data daily fetched and saved for date: ${new Date().toISOString()}`);
      } catch (error) {
        console.error('Error during daily schedule:', error);
      } finally {
        this.isDailyRunning = false;
      }
    }, {
      timezone: 'Europe/Moscow'
    });
  }

  startSchedules() {
    this.startHourlySchedule();
    this.startDailySchedule();
  }
}