export class Note {
  noteID: string = '';
  createdByUserID: string = '';
  ticketID: string = '';
  creationDate: Date = new Date();
  title: string = '';
  content?: string = '';
  sendToSupervisor: boolean = false;
  order: number = 0;
  userNameCreatedBy?: string;
  supervisorComment?: string;
  commentDate?: Date;
  lastCommentedSupervisorName?: string;
  isMyNote: boolean = false;
}
