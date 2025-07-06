import { DBService } from "./db.service.js";
import { WBService } from "./wb.service.js";
import { SheetsService } from "./sheets.service.js";
import { CronJob } from "cron";

export class ScheduleService {
  private db: DBService;
  private wbService: WBService;
  private sheetService: SheetsService;
  private taskQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.db = new DBService();
    this.wbService = new WBService();
    this.sheetService = new SheetsService();
  }

  async executeInQueue(taskName: string, task: any) {
    console.log(`${taskName} queued at: ${new Date().toUTCString()}`);
    const result = await (this.taskQueue = this.taskQueue.then(async () => {
      console.log(`${taskName} started at: ${new Date().toUTCString()}`);
      try {
        const result = await task();
        console.log(`${taskName} completed at: ${new Date().toUTCString()}`);
        console.log("--------------------------");
        return result;
      } catch (error) {
        console.error(`${taskName} failed:`, error);
        throw error;
      }
    }));

    return result;
  }

  async fetchData() {
    const timeout = setTimeout(() => {
      console.error('Fetch data operation timed out');
      throw new Error('Fetch data operation timed out');
    }, 30000); // Увеличен до 30 секунд

    try {
      const t = new Intl.DateTimeFormat('sv-SE').format(new Date());

      const tariffsData = await this.wbService.getTariffs();

      await this.db.saveTariffs(tariffsData);

      await this.sheetService.updateDateSpreadsheet(t);
    } catch (error) {
      console.error('Error during fetchData:', error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  startHourlySchedule() {
    const jobHours = new CronJob('*/3 * * * *', async () => {
      await this.executeInQueue("Hourly task", async () => {
        await this.fetchData();
      });
    },
      null,
      true,
      "Asia/Yekaterinburg"
    );
    jobHours.start();
    console.log(jobHours.isActive ? "Hourly schedule started." : "Hourly schedule failed to start.");
  }

  startDailySchedule() {
    const jobDaily = new CronJob('30 14 * * *', async () => {
      await this.executeInQueue('Daily task', async () => {
        await this.db.DeactiveSpreadsheet();
        await this.sheetService.createSpreadsheet();
        await this.fetchData();
      });
    },
      null,
      true,
      "Asia/Yekaterinburg"
    );
    jobDaily.start();
    console.log(jobDaily.isActive ? "Daily schedule started." : "Daily schedule failed to start.");
  }

  startSchedules() {
    console.log("Starting schedules...");
    this.startHourlySchedule();
    this.startDailySchedule();
  }
}