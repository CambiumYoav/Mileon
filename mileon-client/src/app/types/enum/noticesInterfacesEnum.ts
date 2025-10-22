export enum InterfaceTypes {
  Transportaion = 1,
  Inteiror = 2,
  PostIlPrinting = 3,
  Printing = 4, // בית דפוס
  Production = 5, // מקומי
}

export enum InterfaceTypesHebrew {
  Printing = ' בית דפוס',
  Production = 'מקומי',
}

export enum UploadActionTypes {
  PostApprove = '1',
  CopyTicket = '2',
}

export enum PostTypeEnum {
  RegularMail = 1, // דואר רגיל
  RegisteredMail = 2, // דואר רשום
}

export enum PostTypeHebrewEnum {
  RegularMail = 'RegularMail', // 'דואר רגיל'
  RegisteredMail = 'RegisteredMail', // דואר רשום
}
export enum ProductionStatusEnum {
  Sent = '25F040C9-4920-4CD5-9593-BAC309CFAFA5',
  Waiting = 'AFDB7E63-6E2D-412A-BF5E-F9508B188D38',
}
