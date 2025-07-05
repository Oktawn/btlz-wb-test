import { WBTariffsRequest, WBTariffsResponse } from "#interfaces/wb-tariffs.interface.js";
import { apiWB } from "./api.js";


export class WBService {

  async getTariffs(): Promise<WBTariffsRequest> {
    const t = new Intl.DateTimeFormat('sv-SE').format(new Date());
    const res = await apiWB.get<WBTariffsResponse>(`?date=${t}`).then((data) => {
      return data.data;
    });
    return {
      date: t,
      data: res.response.data
    };
  }
}