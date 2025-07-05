export interface WBTariffsResponse {
  response: {
    data: {
      dtNextBox: string;
      dtTillMax: string;
      warehouseList: WarehouseTariff[];
    };
  };
}

export interface WBTariffsRequest {
  date: string;
  data: {
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: WarehouseTariff[];
  };
}


export interface WarehouseTariff {
  boxDeliveryAndStorageExpr: string;
  boxDeliveryBase: string;
  boxDeliveryLiter: string;
  boxStorageBase: string;
  boxStorageLiter: string;
  warehouseName: string;
}

