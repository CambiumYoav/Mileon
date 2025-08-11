import {User} from "../user";

export interface LegalRequestRemark {
  legalRequestID?: string
  comment: string
  creationDate: Date
  userID?: string
  reservedRemarks: ReservedRemark[]
  createdByUser?: User
}

interface ReservedRemark {
  id: number,
  content?: string
}
