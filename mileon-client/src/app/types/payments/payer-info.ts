import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';
import { paymentOptionsEnum } from '../enum/paymentOptionsEnum';

export const PayerInfoFields: Field[] = [
  {
    name: 'firstName',
    displayName: 'שם פרטי',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Medium,
  },
  {
    name: 'lastName',
    displayName: 'שם משפחה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Medium,
  },
  {
    name: 'nid',
    displayName: 'תעודת זהות',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Medium,
  },
  {
    name: 'mainPhone',
    displayName: 'מספר טלפון',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Medium,
  },
  {
    name: 'email',
    displayName: 'כתובת מייל',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Medium,
  },
  {
    name: 'cityID',
    displayName: 'עיר/ישוב',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Medium,
    dataFunction: {
      name: 'getCities',
    },
  },
  {
    name: 'streetID',
    displayName: 'רחוב',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Medium,
    dataFunction: {
      name: 'getStreets',
      //NOTE: check this if something doesnt work
      // extraParams: [
      //     {
      //         connectedField: 'cityID',
      //         paramName: 'cityIDs',
      //     },
      // ]
    },
  },
  {
    name: 'mainAddress.entrance',
    displayName: 'כניסה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Short,
  },
  {
    name: 'mainAddress.houseNumber',
    displayName: 'מספר בית',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Short,
  },
  {
    name: 'mainAddress.apartment',
    displayName: 'דירה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Short,
  },
  {
    name: 'mainAddress.mailbox',
    displayName: 'ת.ד',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Short,
  },
];

export const fields: { [id: string]: Field } = {
  paymentOption: {
    name: 'paymentOptionId',
    displayName: 'אמצעי תשלום',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPaymentOptions',
      function: () => {
        return [
          {
            id: paymentOptionsEnum.Cash,
            value: 'מזומן',
          },
          {
            id: paymentOptionsEnum.Check,
            value: "צ'ק",
          },
          {
            id: paymentOptionsEnum.CreditCard,
            value: 'אשראי',
          },
          {
            id: paymentOptionsEnum.Other,
            value: 'אחר',
          },
        ];
      },
    },
  },
};
