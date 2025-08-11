export enum DateModeEnum {
  Daily = 'יומי',
  DateRange = 'טווח תאריכים',
  Year = 'שנתי',
  Empty = '',
}
export const DateModeEnumMap: { [key in DateModeEnum]: number } = {
  [DateModeEnum.Daily]: 0,
  [DateModeEnum.DateRange]: 1,
  [DateModeEnum.Year]: 2,
  [DateModeEnum.Empty]: -1, // Optional fallback for empty
};
