import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../services/http.service';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../types/enum/infrastructureTablesEnum';
import {
  InfrastructureFilterOptions,
  VehicleType,
} from '../../types/infrastructure/infrastructureFilterOptions';

@Injectable({
  providedIn: 'root',
})
export class InfrastructureService {
  apiController = 'InfrastructureTables';

  constructor(private httpService: HttpService) {}

  getExportTypes(requestBody: any) {
    const res = this.httpService.postRequestForBlob(
      `${this.apiController}/export?table=VehicleType`,
      requestBody
    );
    return lastValueFrom(res);
  }

  exportTableData(filters: any, tableName: InfrastructureTablesTypes) {
    const authorityParam = filters.authorityID
      ? `&authorityID=${filters.authorityID}`
      : '';

    const searchParam = filters.searchText
      ? `&search=${filters.searchText}`
      : '';

    const includeInactiveParam =
      filters.includeInactive !== undefined
        ? `&includeInactive=${filters.includeInactive}`
        : '';

    const res = this.httpService.postRequestForBlob(
      `${this.apiController}/${tableName}/export?${searchParam}${authorityParam}${includeInactiveParam}`,
      filters
    );
    return lastValueFrom(res);
  }

  //Dynamic by the table name
  getInfrastructureTable(
    filters: InfrastructureFilterOptions,
    tableName: InfrastructureTablesTypes,
    authorityID?: string | null,
    pageSize: number = 100
  ) {
    // Construct the query parameters
    const search = filters?.searchText ? `&search=${filters.searchText}` : '';
    const authorityParam = authorityID ? `&authorityID=${authorityID}` : ''; // Add authorityID only if it exists
    // const dateParam = filters.date ? `search=${filters.date}$` : '';
    // const includeInactiveParam =
    //   filters.includeInactive !== undefined || filters.includeInactive!==null
    //     ? `&includeInactive=${filters.includeInactive}`
    //     : '';
    const includeInactiveParam =
      filters.includeInactive === true || filters.includeInactive === false
        ? `&includeInactive=${filters.includeInactive}`
        : '';

    // Construct the full request URL
    const url = `${this.apiController}/${tableName}?size=${pageSize}&page=${filters.currentPage}${search}${authorityParam}${includeInactiveParam}`;

    const res = this.httpService.getRequest(url);
    return lastValueFrom(res);
  }
  getVehicleInfrastructureTable(
    filters: InfrastructureFilterOptions,
    tableName: InfrastructureTablesTypes,
    authorityID?: string | null,
    pageSize: number = 100
  ) {
    // Construct search parameters dynamically
    let searchQuery = '';

    if (filters.date) {
      searchQuery += `search=${encodeURIComponent(filters.date.toString())}`;
    }

    if (filters.searchText) {
      searchQuery += searchQuery
        ? `$${encodeURIComponent(filters.searchText)}`
        : `search=${encodeURIComponent(filters.searchText)}`;
    }

    // Construct other query parameters dynamically
    const queryParams = new URLSearchParams();

    if (authorityID) {
      queryParams.append('authorityID', authorityID);
    }

    if (filters.includeInactive === true || filters.includeInactive === false) {
      queryParams.append('includeInactive', String(filters.includeInactive));
    }

    queryParams.append('size', String(pageSize));
    queryParams.append('page', String(filters.currentPage));

    // Combine search query manually with other params
    const url = `${
      this.apiController
    }/${tableName}?${searchQuery}&${queryParams.toString()}`;

    const res = this.httpService.getRequest(url);
    return lastValueFrom(res);
  }

  insertToTypeTableDynamic(
    newType: any,
    table: string,
    action: InfrastructureTableAction
  ) {
    const res = this.httpService.postRequest(
      `${this.apiController}/${table}/${action}`,
      newType
    );
    return lastValueFrom(res);
  }

  importDataByTableType(
    tableName: InfrastructureTablesTypes,
    file: any,
    authorityID?: string
  ): Promise<any> {
    // Prepare the FormData object
    const formData = new FormData();
    formData.append('File', file, file.name); // Add the file to the form data
    const authorityParam = authorityID ? `?authorityID=${authorityID}` : ''; // Add authorityID only if it exists
    const res = this.httpService.postRequestWithMultipartHeaders(
      `${this.apiController}/${tableName}/import${authorityParam}`,
      formData
    );

    return lastValueFrom(res);
  }

  importDataVehicle(
    tableName: InfrastructureTablesTypes,
    file: any
  ): Promise<any> {
    const formData = new FormData();
    formData.append('File', file, file.name); // Add the file to the form data

    const res = this.httpService.postRequestWithMultipartHeaders(
      `${this.apiController}/vehicle/${tableName}/import`,
      formData
    );

    return lastValueFrom(res);
  }
}
