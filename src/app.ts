import { migrate, seed } from "#postgres/knex.js";
import { ScheduleService } from "#services/schedule.service.js";

await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

async function main() {
  const scheduleService = new ScheduleService();
  try {
    scheduleService.startSchedules();
  } catch (error) {
    console.error("Error during initialization:", error);

  }
}

main();