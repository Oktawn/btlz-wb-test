import env from "#config/env/env.js";
import { WBTariffsRequest, WBTariffsResponse } from "#interfaces/wb-tariffs.interface.js";
import { apiWB } from "./api.js";


export class WBService {

  async getTariffs(): Promise<WBTariffsRequest> {
    const t = new Intl.DateTimeFormat('sv-SE').format(new Date());
    try {
      const res = await apiWB.get<WBTariffsResponse>(`${env.WB_API_URL}?date=${t}`).then((data) => {
        return data.data;
      });
      return {
        date: t,
        data: res.response.data
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      throw new Error("Failed to format date for WB API request");

    }
  }
}