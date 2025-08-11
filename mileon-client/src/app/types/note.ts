export class Note{
    noteID:string;
    createdByUserID:string;
    ticketID:string;
    creationDate:Date;
    title:string;
    content?:string;
    sendToSupervisor:boolean;
    order:number;
    userNameCreatedBy?:string;
    supervisorComment?:string;
    commentDate?:Date;
    lastCommentedSupervisorName?:string;

    isMyNote:boolean

}