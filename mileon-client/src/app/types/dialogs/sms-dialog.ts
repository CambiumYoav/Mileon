import { ModuleEnum } from "../enum/moduleEnum";

export interface SmsDialogType {
  recordId: string;
  moduleEnum: ModuleEnum;
  phoneNumber: string;
}
