export interface ProsecutorCaseRequestsField {
  name: string;
  id: string;
  isDisabled: boolean;
  value: any;
  type: string; // "text" | "number" | "checkbox"
 
}

export interface ProsecutorCaseRequestsResponse {
  [key: number]: ProsecutorCaseRequestsField[];
}
