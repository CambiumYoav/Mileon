import { Injectable } from '@angular/core';
import { ColorsHex } from '../types/enum/colors.enum';
import { StatusType } from '../types/status';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor() {}

  StatusesTypes: StatusType = {
    TicketsNewModule: {
      1: {
        // name: 'סגור שולם',
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
      2: {
        // name: 'בוטל',
        bgColor: ColorsHex.UnbleachedSilk,
        textColor: ColorsHex.Coral,
      },
      3: {
        // name: 'פתוח',
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
      4: {
        // name: 'מוקפא',
        bgColor: ColorsHex.Water,
        textColor: ColorsHex.CyanBlueAzure,
      },
      5: {
        // name: 'שולם חלקי',
        bgColor: ColorsHex.LemonChiffon,
        textColor: ColorsHex.SelectiveYellow,
      },
      6: {
        // name: 'תשלום עודף-בזיכוי',
        bgColor: ColorsHex.Lavender,
        textColor: ColorsHex.BlueViolet,
      },
      7: {
        // name: 'בהסדר',
        bgColor: ColorsHex.Water,
        textColor: ColorsHex.CyanBlueAzure,
      },
    },
    ParkingPermitsModule: {
      1: {
        // name: 'פעיל',
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
      2: {
        // name: 'לא פעיל',
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
      3: {
        // name: 'הוגשה בקשה',
        bgColor: ColorsHex.Water,
        textColor: ColorsHex.CyanBlueAzure,
      },
      4: {
        // name: 'אושר/פעיל',
        bgColor: ColorsHex.LemonChiffon,
        textColor: ColorsHex.SelectiveYellow,
      },
    },
    LegalRequestsModule: {
      1: {
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
      2: {
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
      3: {
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
      4: {
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
      5: {
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
      6: {
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
      7: {
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
      8: {
        bgColor: ColorsHex.LemonChiffon,
        textColor: ColorsHex.SelectiveYellow,
      },
      9: {
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
      10: {
        bgColor: ColorsHex.TeaGreen,
        textColor: ColorsHex.JungleGreen,
      },
    },
    MinistryOfInteriorModule: {
      3: {
        // name: 'פתוח',
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
    },

    MinistryOfTransportModule: {
      3: {
        // name: 'פתוח',
        bgColor: ColorsHex.Pink,
        textColor: ColorsHex.DarkRed,
      },
    },
  };
}
