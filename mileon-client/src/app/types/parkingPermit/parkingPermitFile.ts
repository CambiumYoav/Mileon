export interface ParkingPermitFile {
  parkingPermitID?: string;
  parkingPermitFilesTypeID: number;
  file: File;
}

export interface PermitFile {
  path: string;
  fileTypeTitle: string;
  fileID: number;
  file: File;
  typeId: number;
}

export type PermitFiles = PermitFile[];
