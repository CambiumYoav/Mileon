

export type InventoryDevice = {
  deviceId: number;
  sn: string;
  dateDelivery: string;
  divisionName: string;
  divisionId: number;
  description: string;
  authorityId: string;
  authorityName: string;
  inspectorId: string;
  inspectorName: string;
  inspectorPhone: string;
  statusId: 2;
  statusNameHE: string;
  typeId: number;
  typeNameHE: string;
  cellularOperatorId: number;
  cellularOperatorHE: string;
  roleId: number;
  roleHE: string;
};

export type DeviceLog = {
  id: number;
  updateBy: string;
  field: string;
  newValue: string;
  dateAction: string;
  actionType: number;
};
