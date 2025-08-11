export interface DraftsAndLetters {
  gid: string;
  id: number;
  name: string;
  smsDisplayName: string;
  emailDisplayName: string;
  isIndictment: boolean;
  isActive: boolean;
  typeDescription: string;
  ticketTypeName: string;
  typeId:number
}

export type DraftsAndLettersList = DraftsAndLetters[];
