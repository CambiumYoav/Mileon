export interface StaticsResponse {
  displayName: string;
  percentage: number;
}

export interface StaticsLineResponse {
  month: number;
  currentYearCount: number;
  lastYearCount: number;
}

export interface StaticsBarResponse {
  violationName: string;
  ticketsCount: number;
  ticketsSum: number;
}


export interface StaticsTableResponse {
  inpectorName: string;
  ticketsCount: number;
  ticketsSum: number;
}