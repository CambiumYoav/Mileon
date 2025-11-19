export interface ParkingPermitAuthorityType {
    authorityPermitTypeID: string;
    permitTypeID: number;
    authorityID: string;
    cost: number;
    permitsCount: number;
    areaNames?: string[];
    permitName: string;
    isActive: true;
  }
  