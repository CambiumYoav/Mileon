import { PermitByEnum } from './enum/permitByEnum';
import { ListData } from './listData';

export interface Lookup {
  listName: string;
  list: Array<ListData<number>>;
}

export class GlobalOptions {
  public static yesNoOptions = [
    {
      id: true,
      value: 'כן',
    },
    {
      id: false,
      value: 'לא',
    },
  ];

  public static days = [
    {
      id: 1,
      value: 'ראשון',
    },
    {
      id: 2,
      value: 'שני',
    },
    {
      id: 3,
      value: 'שלישי',
    },
    {
      id: 4,
      value: 'רביעי',
    },
    {
      id: 5,
      value: 'חמישי',
    },
    {
      id: 6,
      value: 'שישי',
    },
    {
      id: 7,
      value: 'שבת',
    },
  ];

  public static population = [
    {
      id: 1,
      value: 'הכל',
    },
    {
      id: 2,
      value: 'נכים',
    },
    {
      id: 2,
      value: 'לא נכים',
    },
  ];
  
  public static permitBy = [
    {
      id: PermitByEnum.ALL_CITY,
      value: PermitByEnum.ALL_CITY,
    },
    {
      id: PermitByEnum.AREAS,
      value: PermitByEnum.AREAS,
    },
    {
      id: PermitByEnum.STREETS,
      value: PermitByEnum.STREETS,
    },
  ];
}
