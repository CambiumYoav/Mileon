import { ConstPath } from '../../constants/const_path';
import { Icon } from '../icon';

export class TicketIcons {
  static Icons = ConstPath;

  public static TicketStagesIcons: Icon[] = [
    {
      id: 1,
      src: this.Icons.STAGE1,
      displayName: 'התראה',
    },
    {
      id: 2,
      src: this.Icons.STAGE2,
      displayName: 'אירוע',
    },
    {
      id: 3,
      src: this.Icons.STAGE3,
      displayName: 'דו"ח חלון',
    },
    {
      id: 4,
      src: this.Icons.STAGE4,
      displayName: 'הלבשה משרד התחבורה',
    },
    {
      id: 5,
      src: this.Icons.STAGE5,
      displayName: 'הלבשה משרד הפנים',
    },
    {
      id: 6,
      src: this.Icons.STAGE6,
      displayName: 'הודעת תשלום',
    },
    {
      id: 7,
      src: this.Icons.STAGE7,
      displayName: 'אכיפה - טופס 1',
    },
    {
      id: 8,
      src: this.Icons.STAGE8,
      displayName: 'אכיפה - טופס 3',
    },
    {
      id: 9,
      src: this.Icons.STAGE9,
      displayName: 'עיקול בנק',
    },
    {
      id: 10,
      src: this.Icons.BANK,
      displayName: 'עיקול מטלטלין ברישום',
    },
    {
      id: 11,
      src: this.Icons.BANK,
      displayName: 'עיקול מטלטלין בפועל',
    },
  ];
}
