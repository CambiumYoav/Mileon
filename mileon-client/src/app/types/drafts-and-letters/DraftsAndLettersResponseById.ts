export interface DraftsAndLettersResponse {
  gid: string;
  id: number;
  name: string;
  smsDisplayName: string;
  emailDisplayName: string;
  isActive: boolean;
  isIndictment: boolean;
  typeId: number;
  templates: Template[];
  ticketTypes: number[];
}

export interface Template {
  templateId: string | null;
  textAreaValue: string | null;
  order: number;
}
