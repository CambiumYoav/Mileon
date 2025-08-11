import { DraftsAndLettersTypes } from "../enum/draftAndLetters.enum";

export interface Template {
  templateID: string;
  templateBody: string;
  templateTitle: string;
  isActive?: boolean;
  isRequired?: boolean;
  templateTypeId?: number;
  name?: string;
  isInUse?: boolean;
  draftLettersValues?: DraftLettersValues[];
}

export interface DraftLettersValues {
  id: string;
  value: string;
  draftsAndLettersTypeId: DraftsAndLettersTypes;
}
