import { User } from "./user"

export interface TicketInternalMessage{
    messageID: string
    createdByUser: User
    createdDate: Date
    content: string
}