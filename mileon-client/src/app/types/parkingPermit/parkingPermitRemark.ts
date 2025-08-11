import { User } from "../user"

export interface ParkingPermitRemark {
    ID?: string
    content: string
    creationDate: Date
    createdByUser?: User
    reservedRemarks: ReservedRemark[]
}

interface ReservedRemark {
    id: number,
    content?: string
}