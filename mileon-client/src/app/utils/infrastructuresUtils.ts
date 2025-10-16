import { WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../constants/../types/enum/error-success-messages';
import { InfrastructureTableAction } from '../types/enum/infrastructureTablesEnum';
import { DynamicRow } from '../types/infrastructure/InfrastructureTypes';
import { Utils } from './utils';

export class InfrastructuresUtils {
  /**
   * Converts URL query parameters to an object
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

  /**
   * Ensures loader is displayed for a minimum amount of time for better UX
   * @param startTime - The timestamp when the operation started
   * @param minLoaderTime - Minimum time to display loader in milliseconds (default: 1500)
   */
  public static async ensureMinimumLoaderTime(
    startTime: number,
    minLoaderTime: number = 1500
  ): Promise<void> {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = minLoaderTime - elapsedTime;

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
  }

  /**
   * Common export data handler
   * @param filters - Filter options to apply during export
   * @param tableName - Name of the table to export
   * @param exportFunction - The export function to call
   * @param toaster - ToastrService instance for notifications
   */
  public static async handleExportData(
    filters: any,
    tableName: any,
    exportFunction: (filters: any, tableName: any) => Promise<any>,
    toaster: ToastrService
  ): Promise<void> {
    try {
      await Utils.exportData(filters, tableName, exportFunction);
      toaster.success(ErrorSuccessMessages.DOWNLOADED_SUCCESSFULY);
    } catch (e) {
      toaster.error(ErrorSuccessMessages.DEFAULT);
      console.error(e);
    }
  }

  /**
   * Common import data handler
   * @param importFunction - The import function to call
   * @param toaster - ToastrService instance for notifications
   * @param onSuccess - Callback function to execute on success
   */
  public static async handleImportData(
    importFunction: () => Promise<any>,
    toaster: ToastrService,
    onSuccess?: () => void
  ): Promise<void> {
    try {
      const res = await importFunction();
      if (res.errors) {
        toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      } else {
        toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(error);
    }
  }

  /**
   * Handle success notifications for insert/update operations
   * @param action - The action performed (Add or Update)
   * @param toaster - ToastrService instance for notifications
   * @param dialog - MatDialog instance to close dialogs
   */
  public static handleInsertUpdateSuccess(
    action: InfrastructureTableAction,
    toaster: ToastrService,
    dialog: MatDialog
  ): void {
    dialog.closeAll();
    if (action === InfrastructureTableAction.Add) {
      toaster.success(ErrorSuccessMessages.ADDED_SUCCESUFULY);
    } else if (action === InfrastructureTableAction.Update) {
      toaster.success(ErrorSuccessMessages.UPDATED_SUCCESUFULY);
    }
  }

  /**
   * Handle errors for insert/update operations
   * @param error - The error object
   * @param toaster - ToastrService instance for notifications
   */
  public static handleInsertUpdateError(
    error: any,
    toaster: ToastrService
  ): void {
    const errorMessage = error?.message || '';
    if (errorMessage.includes('413')) {
      toaster.error(ErrorSuccessMessages.FILE_SIZE_EXCEEDED);
    } else {
      toaster.error(ErrorSuccessMessages.DEFAULT);
    }
    console.error(error);
  }

  /**
   * Map row data to dialog form fields
   * @param dialogData - Current dialog data structure
   * @param rowData - Row data to populate into the form
   * @returns Updated dialog data with populated values
   */
  public static mapRowDataToDialogFields<T>(
    dialogData: DynamicRow[],
    rowData: T
  ): DynamicRow[] {
    return dialogData.map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => {
        if ((rowData as any)[field.name] !== undefined) {
          return { ...field, value: (rowData as any)[field.name] };
        }
        return field;
      }),
    }));
  }

  /**
   * Prepare filters for data loading
   * @param currentFilter - Current filter state
   * @param newFilter - New filter values
   * @param searchText - Search text value
   * @param additionalFilters - Any additional filters to merge
   * @returns Merged filter object
   */
  public static prepareLoadDataFilters(
    currentFilter: any,
    newFilter: any,
    searchText: string,
    additionalFilters?: any
  ): any {
    const mergedFilter = {
      ...currentFilter,
      ...newFilter,
      searchText,
      ...additionalFilters,
    };
    return mergedFilter;
  }

  /**
   * Handle checkbox change for includeInactive filter
   * @param includeInactive - New includeInactive value
   * @param filterSignal - Signal for filter state
   * @param loadDataFunction - Function to reload data
   */
  public static async handleIncludeInactiveChange(
    includeInactive: boolean,
    filterSignal: WritableSignal<any>,
    loadDataFunction: (filter: any) => Promise<void>
  ): Promise<void> {
    const newFilter = { currentPage: 1, includeInactive };
    filterSignal.set(newFilter);
    await loadDataFunction(newFilter);
  }

  /**
   * Initialize search and filter data with default values
   * @param searchText - Initial search text
   * @returns Object with searchData and filter defaults
   */
  public static initializeSearchAndFilters(searchText: string = '') {
    return {
      searchData: {
        searchText,
        order: 1,
        currentPage: 1,
      },
      filter: {
        searchText: '',
        currentPage: 1,
      },
    };
  }

  /**
   * Debounce function to prevent rapid successive calls
   * @param lastCallTime - Timestamp of the last call
   * @param debounceMs - Debounce time in milliseconds (default: 500)
   * @returns true if the call should be debounced, false otherwise
   */
  public static shouldDebounce(
    lastCallTime: number,
    debounceMs: number = 500
  ): boolean {
    const now = Date.now();
    return now - lastCallTime < debounceMs;
  }

  /**
   * Process data with formatted address
   * @param data - Array of data items
   * @param addressFormatter - Function to format address from item
   * @returns Processed data with formatted addresses
   */
  public static processDataWithFormattedAddress<T>(
    data: T[],
    addressFormatter: (item: T) => string
  ): (T & { fullAddress?: string })[] {
    return data.map((item) => ({
      ...item,
      fullAddress: addressFormatter(item),
    }));
  }

  /**
   * Extract export filters from form
   * @param searchText - Search text from form
   * @param additionalFilters - Additional filters to include
   * @returns Filters object ready for export
   */
  public static prepareExportFilters(
    searchText: string,
    additionalFilters?: any
  ): any {
    return {
      searchText,
      ...additionalFilters,
    };
  }

  /**
   * Update dialog data field value by name
   * @param dialogData - Current dialog data
   * @param fieldName - Name of the field to update
   * @param value - New value for the field
   * @returns Updated dialog data
   */
  public static updateDialogFieldValue(
    dialogData: DynamicRow[],
    fieldName: string,
    value: any
  ): DynamicRow[] {
    return dialogData.map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => {
        if (field.name === fieldName) {
          return { ...field, value };
        }
        return field;
      }),
    }));
  }

  /**
   * Generic error handler with console logging
   * @param error - The error object
   * @param context - Context string for debugging
   */
  public static handleError(error: any, context: string = ''): void {
    const errorMessage = context
      ? `Error in ${context}:`
      : 'An error occurred:';
    console.error(errorMessage, error);
  }

  /**
   * Transform nested address data to formatted string
   * @param address - Address object with potential nested structure
   * @returns Formatted address string
   */
  public static formatAddress(address: any): string {
    if (!address) return 'N/A';

    const city = address.city?.cityName || address.cityName || '';
    const street = address.street?.streetName || address.streetName || '';
    const houseNumber = address.houseNumber || '';
    const apartment = address.apartment
      ? `, דירה ${address.apartment}`
      : '';

    return `${city} ${street} ${houseNumber}${apartment}`.trim() || 'N/A';
  }

  /**
   * Extract main phone from citizen phones array
   * @param phones - Array of phone objects
   * @returns Main phone number or 'N/A'
   */
  public static extractMainPhone(phones: any[]): string {
    if (!phones || !Array.isArray(phones)) return 'N/A';
    const mainPhone = phones.find((phone: any) => phone.isMain);
    return mainPhone?.phone || phones[0]?.phone || 'N/A';
  }

  /**
   * Set authority ID in dialog data
   * @param dialogData - Current dialog data
   * @param authorityID - Authority ID to set
   * @returns Updated dialog data with authority ID
   */
  public static setAuthorityInDialogData(
    dialogData: DynamicRow[],
    authorityID: string | null
  ): DynamicRow[] {
    return this.updateDialogFieldValue(dialogData, 'authorityID', authorityID);
  }

  /**
   * Validate and prepare filter before API call
   * @param filter - Filter object (may have .value property)
   * @returns Clean filter object
   */
  public static normalizeFilter(filter: any): any {
    return filter?.value ? filter.value : filter;
  }

  /**
   * Check if data loading should be disabled based on conditions
   * @param dataLength - Current data length
   * @param searchText - Current search text
   * @returns true if import should be disabled
   */
  public static shouldDisableImport(
    dataLength: number,
    searchText: string
  ): boolean {
    return dataLength === 0 ? searchText.trim() !== '' : true;
  }
}