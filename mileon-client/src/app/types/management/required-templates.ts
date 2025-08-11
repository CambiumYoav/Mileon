import { TemplatesTypesEnum } from '../enum/templatesTypesEnum';
import { Template } from '../templates/template.type';

export const textRequiredTemplates: Template[] = [
  {
    templateID: '',
    templateTitle: ' נוסח הודעת סיום הגשת בקשה ',
    templateBody: '',
    isRequired: true,
    isActive: true,
    templateTypeId: TemplatesTypesEnum.TEXT,
    name: 'submissionEndNotice',
  },
  {
    templateID: '',
    templateTitle: 'נוסח הודעה בסיום תהליך',
    templateBody: '',
    isRequired: true,
    isActive: true,
    templateTypeId: TemplatesTypesEnum.TEXT,
    name: 'processCompletionNotice',
  },
  {
    templateID: '',
    templateTitle: 'כתובת רשות',
    templateBody: '',
    isRequired: true,
    isActive: true,
    templateTypeId: TemplatesTypesEnum.TEXT,
    name: 'authorityAddress',
  },
  {
    templateID: '',
    templateTitle: 'זמני קבלת קהל',
    templateBody: '',
    isRequired: true,
    isActive: true,
    templateTypeId: TemplatesTypesEnum.TEXT,
    name: 'receptionHours',
  },
];


export const logoRequiredTemplates: Template[] = [
  {
    templateID: '',
    templateTitle: 'לוגו הרשות',
    templateBody: '',
    isRequired: true,
    isActive: true,
    templateTypeId: TemplatesTypesEnum.LOGO,
    name: 'authorityLogo',
  },
 
];