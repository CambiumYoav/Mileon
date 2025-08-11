export const GENERAL_PORTAL_FIELDS: any = [
  {
    id: 1,
    displayName: 'צפיה בדוח',
    serverKeys: {
      parking: 'allowParkingTicketsWatch',
      general: 'allowGeneralTicketsWatch',
      administrative: 'allowAdministrativeTicketsWatch',
    },
  },
  {
    id: 2,
    displayName: 'תשלום דוח',
    serverKeys: {
      parking: 'allowParkingTicketsPay',
      general: 'allowGeneralTicketsPay',
      administrative: 'allowAdministrativeTicketsPay',
    },
  },
  {
    id: 3,
    displayName: 'הגשת בקשה לערעור',
    serverKeys: {
      parking: 'allowParkingTicketsAppealRequest',
      general: 'allowGeneralTicketsAppealRequest',
      administrative: 'allowAdministrativeTicketsAppealRequest',
    },
  },
  {
    id: 4,
    displayName: 'הגשת בקשה להסבה',
    serverKeys: {
      parking: 'allowParkingTicketsIdentificationRequest',
      general: 'allowGeneralTicketsIdentificationRequest',
      administrative: 'allowAdministrativeTicketsIdentificationRequest',
    },
  },
  {
    id: 5,
    displayName: 'הגשת בקשה להשפט',
    serverKeys: {
      parking: 'allowParkingTicketsRequestToBeTried',
      general: 'allowGeneralTicketsRequestToBeTried',
      administrative: 'allowAdministrativeTicketsRequestToBeTried',
    },
  },
  {
    id: 6,
    displayName: 'הגשת בקשה לתו חניה',
    activeColumns: ['parking'],
    serverKeys: {
      parking: 'allowParkingPermit',
    },
  },
  {
    id: 7,
    displayName: 'הגשת בקשה לחידוש תו חניה',
    activeColumns: ['parking'],
    serverKeys: {
      parking: 'allowParkingPermitInnovation',
    },
  },
];

export const EXTRA_PORTAL_FIELDS: any = [
  {
    id: 1,
    displayName: 'ועדת תמרורים',
    serverKeys: {
      parking: 'allowTrafficSignCommittee',
    },
  },
  {
    id: 2,
    displayName: 'סטטוס ועדת תמרורים',
    serverKeys: {
      parking: 'allowTrafficSignCommitteeStatus',
    },
  },
  {
    id: 3,
    displayName: 'מודול גריטת מכוניות',
    serverKeys: {
      parking: 'allowCarJunk',
    },
  },
];
