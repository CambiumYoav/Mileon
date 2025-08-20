import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LookupNewService } from '../../../../services/lookup-new.service';
import { SelectParams } from '../../../../types/advanced-search/select-option.model';
import { DataFunction } from '../../../../types/advanced-search/form-tab.model';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  listsObj: BehaviorSubject<any> = new BehaviorSubject<Object>({
    listsReachedEndOfData: [],
  });

  constructor(private lookupNewService: LookupNewService) {}

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

  async getDataList(
    listName: string,
    dataFunction: DataFunction,
    paramObj: SelectParams,
    instanceKey?: string // Optional instance key
  ): Promise<{ isEndOfData: boolean; isServerSide: boolean } | undefined> {
    try {
      let dataStatus: { isEndOfData: boolean; isServerSide: boolean } = {
        isEndOfData: false,
        isServerSide: true,
      };

      // Determine the target list object (instance-specific or global)
      const targetLists = instanceKey
        ? this.listsObj.value[instanceKey] || {}
        : this.listsObj.value;

      // Ensure the instance-specific object exists if an instanceKey is provided
      if (instanceKey && !this.listsObj.value[instanceKey]) {
        this.listsObj.next({
          ...this.listsObj.value,
          [instanceKey]: {},
        });
      }

      // Initialize or reset the list for the given listName
      if (!targetLists[listName]?.length || paramObj.currentPage === 1) {
        targetLists[listName] = [];
        if (instanceKey) {
          this.listsObj.next({
            ...this.listsObj.value,
            [instanceKey]: targetLists,
          });
        } else {
          this.listsObj.next({ ...this.listsObj.value, [listName]: [] });
        }
      }

      let res: any = [];
      if (dataFunction.objName) {
        // Use type assertion to handle dynamic property access
        const lookupMethod = (this.lookupNewService as any)[dataFunction.name];
        if (typeof lookupMethod === 'function') {
          res = (await lookupMethod(paramObj))[dataFunction.objName];
        }
      } else {
        if (dataFunction.function) {
          res = dataFunction.function();
        } else {
          // Use type assertion to handle dynamic property access
          const lookupMethod = (this.lookupNewService as any)[dataFunction.name];
          if (typeof lookupMethod === 'function') {
            res = await lookupMethod(paramObj);
          }
        }
      }

      if (!res.list) {
        dataStatus.isEndOfData = true;
        dataStatus.isServerSide = false;
      }

      let newData = res.list ? res.list : res;
      if (
        targetLists[listName]?.length == res.total ||
        newData[0]?.id == targetLists[listName]?.[0]?.id
      ) {
        dataStatus.isEndOfData = true;
        return dataStatus;
      }

      // Update the target list
      targetLists[listName] = [...targetLists[listName], ...newData];

      // Update the BehaviorSubject
      if (instanceKey) {
        this.listsObj.next({
          ...this.listsObj.value,
          [instanceKey]: targetLists,
        });
      } else {
        this.listsObj.next({
          ...this.listsObj.value,
          [listName]: targetLists[listName],
        });
      }

      return dataStatus;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}
