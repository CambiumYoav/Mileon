export interface TicketHistory {
    // status:{
    //   id: number,
    //   name: string
    // },
    // stage:{
    //   id: number,
    //   name: string
    // },
    // subStage:{
    //   id: number,
    //   name: string
    //   isMarked : boolean
    // },
    updateDate: Date
    ticketStatusID: number
    ticketStatusName: string
    ticketStageID: number
    ticketStageName: string
    description: string
    ticketSubStageID: number
    ticketSubStageName: string
    ticketOwnerName: string
    address : string
    nid: string
    authorityName: string
    streetName: string
    houseNumber?: number
    userName: string
}
