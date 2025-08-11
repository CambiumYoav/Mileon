export interface InspectorTask {
  inspectorID: string;
  taskDescription: string;
  authorityID: string;
  taskTitle?: string;
}

export interface InspectorTaskResponse {
  inspectorId: string;
  inspectorName: string;
  taskDescription: string;
  taskTitle?: string;
  taskCreationDate: string;
}
