import {
  Field,
  FieldTypeEnum,
  FieldLengthEnum,
} from '../advanced-search/form-tab.model';
import { noticeMessageOptionsEnum } from '../enum/noticeNessageOptionsEnum';

export const noticeMessagesFields: { [id: string]: Field } = {
    noticeMessageOption: {
    //chnage this
    name: 'noticeMessageOptionId',
    displayName: 'סוג הודעה להפקה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingMessageType',
      function: () => {
        return [
          {
            id: noticeMessageOptionsEnum.PreNotice,
            value: 'הודעה מקדימה',
          },
          {
            id: noticeMessageOptionsEnum.PaymentNotice,
            value: 'הודעת תשלום',
          },
          {
            id: noticeMessageOptionsEnum.DemandNotice,
            value: 'הודעת דרישה',
          },
          {
            id: noticeMessageOptionsEnum.Form3,
            value: 'טופס 3',
          },
          {
            id: noticeMessageOptionsEnum.DebtReminder,
            value: 'תזכורת חוב',
          },
        ];
      },
    },
  },
};
