import { ReservedSummary } from "./reservedSummary"

export interface CallSummary {
    callSummaryID?: string
    createdByUserID?: string
    createdDate?: Date
    phoneNumber?: string
    content?: string
    reservedes?: ReservedSummary[]
    ticketIDs?: string[]
}