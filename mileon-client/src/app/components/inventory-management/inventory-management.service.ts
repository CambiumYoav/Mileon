import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { InventoryFilterOptions } from '../../types/inventory-management/inventoryFilterOptions';
import { InventoryDevice } from '../../types/inventory-management/inventoryTypes';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementService {
  private readonly apiController = 'Inventory';

  constructor(private httpService: HttpService) {}

  private buildQueryParams(params: Record<string, any>): string {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');
  }

  async getDevices(filters: InventoryFilterOptions) {
    try {
      const query = this.buildQueryParams({
        size: 10,
        page: filters.currentPage,
        search: filters.searchText,
        authorityID: filters.authorityID,
      });

      return await lastValueFrom(
        this.httpService.getRequest(`${this.apiController}/GetDevices?${query}`)
      );
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }

  async exportDevices(searchText: string = '', authorityId: string='') {
    try {
      const query = this.buildQueryParams({
        authorityID: authorityId,
        search: searchText,
      });
      return await lastValueFrom(
        this.httpService.postRequestForBlob(
          `${this.apiController}/export?${query}`,
          {}
        )
      );
    } catch (error) {
      console.error('Error exporting devices:', error);
      throw error;
    }
  }

  async updateDeviceById(device: InventoryDevice) {
    try {
      return await lastValueFrom(
        this.httpService.postRequest(
          `${this.apiController}/UpdateDevice/${device.deviceId}`,
          device
        )
      );
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  async createDevice(device: InventoryDevice) {
    try {
      return await lastValueFrom(
        this.httpService.postRequest(`${this.apiController}/AddDevice`, device)
      );
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  }

  async getDeviceLogs(deviceId: string, quantity: number = 15) {
    try {
      return await lastValueFrom(
        this.httpService.getRequest(
          `${this.apiController}/GetDeviceLogs/${deviceId}?maxLogs=${quantity}`
        )
      );
    } catch (error) {
      console.error('Error fetching device logs:', error);
      throw error;
    }
  }
}
