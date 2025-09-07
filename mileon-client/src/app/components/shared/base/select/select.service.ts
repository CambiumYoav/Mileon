import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { LookupNewService } from '../../../../services/lookup-new.service';
import { SelectParams } from '../../../../types/advanced-search/select-option.model';
import { DataFunction } from '../../../../types/advanced-search/form-tab.model';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  private readonly lookupNewService = inject(LookupNewService);
  
  private readonly _listsObj = new BehaviorSubject<Record<string, any>>({
    listsReachedEndOfData: [],
  });

  /**
   * Observable for lists data - readonly access
   */
  readonly listsObj$ = this._listsObj.asObservable();

  /**
   * Getter for current lists data
   */
  get listsObj(): BehaviorSubject<Record<string, any>> {
    return this._listsObj;
  }

  // save just in case the dynamic causes issues after changes
  // async getDataList(
  //   listName: string,
  //   dataFunction: DataFunction,
  //   paramObj: SelectParams
  // ): Promise<{isEndOfData: boolean, isServerSide: boolean} | undefined> {

  //   try {
  //     let dataStatus : {isEndOfData: boolean, isServerSide: boolean}= {isEndOfData: false, isServerSide: true};
  //     if (
  //       !this.listsObj.value[listName]?.length ||
  //       paramObj.currentPage === 1
  //     ) {
  //       this.listsObj.next({ ...this.listsObj.value, [listName]: [] });
  //     }
  //     let res: any = [];
  //     if (dataFunction.objName) {
  //       res = (await this.lookupNewService[dataFunction.name](paramObj))[
  //         dataFunction.objName
  //       ];
  //     }
  //     else {
  //       if (dataFunction.function) {
  //         res = dataFunction.function();

  //       }
  //       else {
  //         res = await this.lookupNewService[dataFunction.name](paramObj);
  //       }
  //     }
  //     if (!res.list) {
  //       dataStatus.isEndOfData = true;
  //       dataStatus.isServerSide = false;
  //     }
  //     let newData = res.list ? res.list : res;
  //     if (this.listsObj.value[listName].length == res.total || (newData[0].id == this.listsObj.value[listName][0]?.id)) {
  //       dataStatus.isEndOfData = true;
  //       return dataStatus;
  //     }
  //     this.listsObj.next({
  //       ...this.listsObj.value,
  //       [listName]: [...this.listsObj.value[listName], ...newData],
  //     });

  //     return dataStatus;
  //   } catch (e) {
  //   }
  // }

  /**
   * Get data list with improved error handling and type safety
   */
  async getDataList(
    listName: string,
    dataFunction: DataFunction,
    paramObj: SelectParams,
    instanceKey?: string
  ): Promise<{ isEndOfData: boolean; isServerSide: boolean } | undefined> {
    try {
      const dataStatus: { isEndOfData: boolean; isServerSide: boolean } = {
        isEndOfData: false,
        isServerSide: true,
      };

      // Get current state
      const currentState = this._listsObj.value;
      
      // Determine the target list object (instance-specific or global)
      const targetLists = instanceKey
        ? currentState[instanceKey] || {}
        : currentState;

      // Ensure the instance-specific object exists if an instanceKey is provided
      if (instanceKey && !currentState[instanceKey]) {
        this._updateListsState({
          ...currentState,
          [instanceKey]: {},
        });
      }

      // Initialize or reset the list for the given listName
      if (!targetLists[listName]?.length || paramObj.currentPage === 1) {
        targetLists[listName] = [];
        this._updateListsState({
          ...currentState,
          [instanceKey || listName]: instanceKey ? targetLists : { [listName]: [] },
        });
      }

      // Fetch data using the appropriate method
      const res = await this._fetchData(dataFunction, paramObj);
      
      if (!res?.list && !Array.isArray(res)) {
        dataStatus.isEndOfData = true;
        dataStatus.isServerSide = false;
        return dataStatus;
      }

      const newData = res.list || res;
      
      // Check if we've reached the end of data
      if (
        targetLists[listName]?.length >= (res.total || newData.length) ||
        newData[0]?.id === targetLists[listName]?.[0]?.id
      ) {
        dataStatus.isEndOfData = true;
        return dataStatus;
      }

      // Update the target list
      targetLists[listName] = [...(targetLists[listName] || []), ...newData];

      // Update the state
      this._updateListsState({
        ...currentState,
        [instanceKey || listName]: instanceKey ? targetLists : { [listName]: targetLists[listName] },
      });

      return dataStatus;
    } catch (error) {
      console.error('Error in getDataList:', error);
      return { isEndOfData: true, isServerSide: false };
    }
  }


  private _updateListsState(newState: Record<string, any>): void {
    this._listsObj.next(newState);
  }

  /**
   * Private method to fetch data based on dataFunction configuration
   */
  private async _fetchData(dataFunction: DataFunction, paramObj: SelectParams): Promise<any> {
    if (dataFunction.objName) {
      const lookupMethod = (this.lookupNewService as any)[dataFunction.name];
      if (typeof lookupMethod !== 'function') {
        throw new Error(`Method ${dataFunction.name} not found in LookupNewService`);
      }
      const result = await lookupMethod.call(this.lookupNewService, paramObj);
      return result[dataFunction.objName];
    }

    if (dataFunction.function) {
      return dataFunction.function();
    }

    const lookupMethod = (this.lookupNewService as any)[dataFunction.name];
    if (typeof lookupMethod !== 'function') {
      throw new Error(`Method ${dataFunction.name} not found in LookupNewService`);
    }
    return await lookupMethod.call(this.lookupNewService, paramObj);
  }

  /**
   * Clear data for a specific list
   */
  clearListData(listName: string, instanceKey?: string): void {
    const currentState = this._listsObj.value;
    
    if (instanceKey) {
      const instanceData = currentState[instanceKey] || {};
      delete instanceData[listName];
      this._updateListsState({
        ...currentState,
        [instanceKey]: instanceData,
      });
    } else {
      delete currentState[listName];
      this._updateListsState(currentState);
    }
  }

  /**
   * Reset all data
   */
  resetAllData(): void {
    this._updateListsState({
      listsReachedEndOfData: [],
    });
  }
}
