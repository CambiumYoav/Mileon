import { tick } from '@angular/core/testing';
import { Data } from '@angular/router';
// import { InfrastructureService } from '../components/infrastructures/infrastructure.service';
import { FileType, FileTypeExtension } from '../types/enum/fileType.enum';
import { InfrastructureTablesTypes } from '../types/enum/infrastructureTablesEnum';
import {
  ActionsFilter,
  InterfaceFilter,
  OtherFilter,
  OwnerDetailsFilter,
  SourceDetailsFilter,
  TicketBookFilter,
  TicketFilterOptions,
  ViolationDetailsFilter,
} from '../types/filters/ticket/ticketFilterOptions';
import { TicketDetails } from '../types/ticketDetails';
import {
  TicketStagesDisplayEnum,
  TicketTypeDisplayEnum,
} from '../types/enum/ticketEnums';
import { DeliveryMethodDispalyEnum } from '../types/enum/deliveryMethodType';
import { RelatedGroupEnum } from '../types/enum/relatedGroupEnum';
import { TicketBookAction } from '../types/enum/TicketBookActionEnum';
import { FormGroup, Validators } from '@angular/forms';
import { DateModeEnum } from '../types/enum/dateTypeEnum';

export class Utils {
  public static getID(ticket: TicketDetails): string {
    return `${
      ticket.citizen.nid
        ? 'ת.ז ' + ticket.citizen.nid
        : ticket.citizen.cn
        ? 'ח.פ ' + ticket.citizen.cn
        : ticket.citizen.passportID
        ? 'דרכון ' + ticket.citizen.passportID
        : ''
    }`;
  }

  public static toPromise(value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  public static getEnumKeyByValue(
    enumObject: Record<string, number>,
    value: number
  ): string {
    return (
      Object.keys(enumObject).find(
        (key) => enumObject[key as keyof typeof enumObject] === value
      ) || ''
    );
  }

  public static flattenObject(obj: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] && typeof obj[key] === 'object') {
        const nested = this.flattenObject(obj[key]);
        for (const nestedKey of Object.keys(nested)) {
          result[`${key}.${nestedKey}`] = nested[nestedKey];
        }
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * queryParamsToObject
   */
  public static queryParamsToObject() {
    let data = JSON.parse(
      '{"' +
        decodeURI(
          location.search.substring(1).replace(/&/g, '","').replace(/=/g, '":"')
        ) +
        '"}'
    );
    return data;
  }

  public static mapNoticeFormToTicketFilterOptions(
    formValues: any
  ): TicketFilterOptions {
    return new TicketFilterOptions({
      currentPage: 1,
      // pageSize: 200,
      pageSize: 50,
      searchText: formValues.ticketNumber || '',
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      violationDetailsFilter: new ViolationDetailsFilter({
        streetID: formValues.cityStreetID
          ? [formValues.cityStreetID]
          : undefined,
        violationIDs: formValues.violationIDs,
        ticketTypeID: formValues.ticketTypeID
          ? [formValues.ticketTypeID]
          : undefined,

        ticketNumber: formValues.ticketNumber,
      }),
      ownerDetailsFilter: new OwnerDetailsFilter({}),
      sourceDetailsFilter: new SourceDetailsFilter({
        ticketSourceID: formValues.ticketSourceID
          ? [formValues.ticketSourceID]
          : undefined,
      }),
      actionsFilter: new ActionsFilter({
        statusID: formValues.statusID ? [formValues.statusID] : undefined,
        stageID: formValues.ticketStageID,
        isTriedRequestChecked: formValues.legalRequests,
      }),
      otherFilter: new OtherFilter({
        fromPaymentBalance: formValues.fromPaymentBalance,
        toPaymentBalance: formValues.toPaymentBalance,
      }),
      interfaceFilter: new InterfaceFilter({
        inspectorName: formValues.inspectorName,
      }),
      ticketBookFilter: new TicketBookFilter({
        seriesNumber: formValues.seriesNumber,
      }),
    });
  }

  public static getTicketTypeDisplayName(ticketTypeID: number): string {
    return TicketTypeDisplayEnum[ticketTypeID];
  }

  public static getTicketTypeId(ticketTypeName: string): number {
    return TicketTypeDisplayEnum[
      ticketTypeName as keyof typeof TicketTypeDisplayEnum
    ];
  }

  public static getTicketStageId(ticketStageName: string) {
    const entry = Object.entries(TicketStagesDisplayEnum).find(
      ([key, value]) => key.replace(/_/g, ' ') === ticketStageName
    );

    return entry ? Number(entry[1]) : null; // Return ID or null if not found
  }

  public static getRelatedGroupName(relatedGroupId: string) {
    return RelatedGroupEnum[relatedGroupId as keyof typeof RelatedGroupEnum];
  }

  public static getDeliveryMethodId(deliveryMethodName: string) {
    const entry = Object.entries(DeliveryMethodDispalyEnum).find(
      ([key, value]) => key.replace(/_/g, ' ') === deliveryMethodName
    );

    return entry ? Number(entry[1]) : null; // Return ID or null if not found
  }

  public static translateBoolean(value: boolean | null | undefined): string {
    return value === true ? 'כן' : 'לא';
  }

  public static async exportData(
    filters: any,
    tableName: InfrastructureTablesTypes,
    exportService: (
      filters: any,
      tableName: InfrastructureTablesTypes
    ) => Promise<Blob>
  ): Promise<void> {
    try {
      const blob = await exportService(filters, tableName);

      // Determine the file type
      let fileType = '';
      switch (blob.type) {
        case FileType.ZIP:
          fileType = FileTypeExtension.ZIP;
          break;
        default:
          fileType = FileTypeExtension.XLSX;
          break;
      }

      // Convert Blob to File
      const file = new File([blob], `exportedData.${fileType}`, {
        type: blob.type,
      });

      // Save the file
      Utils.saveFile(file);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  //Download file
  public static saveFile(file: File) {
    const url = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    window.URL.revokeObjectURL(url); // Clean up URL object after download
  }

  //fetch options

  // public static async fetchOptionsAndUpdateDialogData(
  //   infrastructureServer: InfrastructureService,
  //   tableType: InfrastructureTablesTypes,
  //   dialogData: any[],
  //   fieldName: string,
  //   valueKey: string,
  //   displayKey: string
  // ): Promise<any[]> {
  //   try {
  //     const response = await infrastructureServer.getInfrastructureTable(
  //       { currentPage: 1 },
  //       tableType
  //     );

  //     if (response && Array.isArray(response.data)) {
  //       const options = response.data.map((item: any) => ({
  //         value: item[valueKey],
  //         display: item[displayKey],
  //       }));

  //       // Update `dialogData` with fetched options
  //       return dialogData.map((dynamicRow) => {
  //         dynamicRow.row = dynamicRow.row.map((field) => {
  //           if (field.name === fieldName) {
  //             return { ...field, options };
  //           }
  //           return field;
  //         });
  //         return dynamicRow;
  //       });
  //     }

  //     return dialogData;
  //   } catch (error) {
  //     console.error('Error fetching options:', error);
  //     throw error;
  //   }
  // }

  // public static async fetchOptionsAndData(
  //   infrastructureServer: InfrastructureService,
  //   tableType: InfrastructureTablesTypes,
  //   dialogData: any[],
  //   fieldName: string,
  //   valueKey: string,
  //   displayKey: string
  // ): Promise<{ dialogData: any[]; options: any[]; data: any[] }> {
  //   try {
  //     const response = await infrastructureServer.getInfrastructureTable(
  //       { currentPage: 1 },
  //       tableType
  //     );

  //     if (response && Array.isArray(response.data)) {
  //       const data = response.data;
  //       const options = response.data.map((item: any) => ({
  //         value: item[valueKey],
  //         display: item[displayKey],
  //       }));

  //       const updatedDialogData = dialogData.map((dynamicRow) => {
  //         dynamicRow.row = dynamicRow.row.map((field) => {
  //           if (field.name === fieldName) {
  //             return { ...field, options };
  //           }
  //           return field;
  //         });
  //         return dynamicRow;
  //       });

  //       return { dialogData: updatedDialogData, options, data: data };
  //     }

  //     return { dialogData, options: [], data: [] };
  //   } catch (error) {
  //     console.error('Error fetching options:', error);
  //     throw error;
  //   }
  // }

  // Titles for each ticket type
  public static columnTitles: { [key: string]: string } = Object.fromEntries(
    Object.entries(TicketTypeDisplayEnum)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => [value, key]) // Map numeric values to their Hebrew names
  );

  // Helper function to convert a file to Base64
  public static convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Converts file to Base64 string
    });
  }

  public static saveBase64File(base64Content: string, fileName: string) {
    // Decode the base64 string to binary data
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  }

  public static base64ToFileAuto(
    dataUrl: string,
    defaultFileName = 'template'
  ): File {
    const [header, base64] = dataUrl.split(',');
    const mimeMatch = header.match(/data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const extension = mime.split('/')[1] || 'bin';

    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    const fileName = `${defaultFileName}.${extension}`;
    return new File([array], fileName, { type: mime });
  }

  // Enum Mapping Function
  public static getRelatedGroupMapping(): { [key: number]: string } {
    return Object.fromEntries(
      Object.entries(RelatedGroupEnum)
        .filter(([key, value]) => !isNaN(Number(value))) // Keep numeric values only
        .map(([key, value]) => [value, key.replace(/_/g, ' ')]) // Replace underscores with spaces
    );
  }

  public static getDialogTitle(action: TicketBookAction): string {
    switch (action) {
      case TicketBookAction.ADD:
        return 'הוספת פנקס';
      case TicketBookAction.TRANSFER:
        return 'העברה לפקח אחר';

      default:
        return 'ניהול פנקסים';
    }
  }

  public static getYearsList(): number[] {
    const thisYear = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => thisYear - i);
  }

  public static updateValidatorsByMode(
    form: FormGroup,
    mode: DateModeEnum
  ): void {
    const dayControl = form.get('day');
    const fromDateControl = form.get('fromDate');
    const toDateControl = form.get('toDate');
    const yearControl = form.get('year');

    // Clear all validators first
    dayControl?.clearValidators();
    fromDateControl?.clearValidators();
    toDateControl?.clearValidators();
    yearControl?.clearValidators();

    // Set required fields depending on mode
    switch (mode) {
      case DateModeEnum.Daily:
        dayControl?.setValidators([Validators.required]);
        break;
      case DateModeEnum.DateRange:
        fromDateControl?.setValidators([Validators.required]);
        toDateControl?.setValidators([Validators.required]);
        break;
      case DateModeEnum.Year:
        yearControl?.setValidators([Validators.required]);
        break;
    }

    // Reset invalid fields instead of just updating validity
    if (dayControl?.invalid) dayControl.reset();
    if (fromDateControl?.invalid) fromDateControl.reset();
    if (toDateControl?.invalid) toDateControl.reset();
    if (yearControl?.invalid) yearControl.reset();

    // Trigger validation
    dayControl?.updateValueAndValidity({ emitEvent: false });
    fromDateControl?.updateValueAndValidity({ emitEvent: false });
    toDateControl?.updateValueAndValidity({ emitEvent: false });
    yearControl?.updateValueAndValidity({ emitEvent: false });

    // Update form validity without triggering valueChanges
    form.updateValueAndValidity({ emitEvent: false });
  }
}
