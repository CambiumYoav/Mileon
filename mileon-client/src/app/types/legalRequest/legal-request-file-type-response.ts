export interface IdValuePair {
  id: number;
  value: string;
}

export interface EntityFileTypes {
  [id: string]: IdValuePair[];
}

export interface LegalRequestFileTypesResponse {
  fileTypes: IdValuePair[] | null;
  entitiesFileTypes: EntityFileTypes;
}
