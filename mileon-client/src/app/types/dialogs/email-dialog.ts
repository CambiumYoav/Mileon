import { ModuleEnum } from "../enum/moduleEnum";

export interface EmailDialogType {
    recordId: string;
    moduleEnum: ModuleEnum;
    emailAddress: string;
    updateCitizenEmail: boolean;
    userComments: string;
}
