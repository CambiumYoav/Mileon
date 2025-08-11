import {Citizen} from "../citizen";
import {Address} from "../address";
import {LegalRequestRemark} from "./legal-request-remark";
import {User} from "../user";
import {LegalRequestFileType} from "./legal-request-file.type";

export class LegalRequestDetails {
  legalRequestID: string;
  legalRequestNumber: string;
  requestTypeID: number;
  requestStatusID: number;
  requestSourceID: number;
  requestSource: string;
  ticketID: string;
  ticketNumber: string;
  vehicleNumber: string | null;
  requestedEntityID: string | null;
  requestCitizen: Citizen;
  destinationCitizen: Citizen | null;
  requestComment: string | null;
  legalRequestConsultationComments: LegalRequestRemark[];
  legalRequestConsultationNewComment: LegalRequestRemark;
  confirmByName: string | null;
  confirmDate: Date | null;
  consultRoleId: number | null;
  lastUpdateDate: Date | null;
  lastUpdatedByUser: User | null;
  legalRequestFiles: LegalRequestFileType[];

  constructor(formValuesData: any) {

    this.legalRequestID = formValuesData.legalRequestID;
    this.legalRequestNumber = formValuesData.legalRequestNumber;
    this.requestTypeID = formValuesData.requestTypeID;
    this.requestStatusID = formValuesData.requestStatusID;
    this.requestSourceID = formValuesData.requestSourceID;
    this.requestSource = formValuesData.requestSource;
    this.ticketID = formValuesData.ticketID;
    this.ticketNumber = formValuesData.ticketNumber;
    this.vehicleNumber = formValuesData.vehicleNumber;
    this.requestedEntityID = formValuesData.requestedEntityID;
    this.requestCitizen = new Citizen(formValuesData.requestCitizen);
    this.destinationCitizen = formValuesData.destinationCitizen ? new Citizen(formValuesData.destinationCitizen) : null;
    this.requestComment = formValuesData.requestComment;
    this.confirmByName = formValuesData.confirmByName;
    this.confirmDate = formValuesData.confirmDate ? new Date(formValuesData.confirmDate) : null;
    this.consultRoleId = formValuesData.consultRoleId;
    this.lastUpdateDate = formValuesData.lastUpdateDate ? new Date(formValuesData.lastUpdateDate) : null;
    this.lastUpdatedByUser = formValuesData.lastUpdatedByUser;
    // this.legalRequestFiles = formValuesData.legalRequestFiles;

  }
}



