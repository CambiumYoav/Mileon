export interface EditOrDeleteEvent {
  action: 'edit' | 'delete'; // The type of action
  data: any; 
}
