export class ParkingPermitAuthorityConfig {
    requiredEmailInRequest : boolean;
    displaySeniorCitizen : boolean;
    seniorCitizenAge : number;
    permitData : AuthorityPermitType[]
}

class AuthorityPermitType {
    permitTypeID : number;
    permitName : string;
    fromTime : string;
    toTime : string;
    weekendFromTime : string;
    weekendToTime : string;
}