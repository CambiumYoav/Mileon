import { Injectable } from '@angular/core';
import { RoleEnumKeys, ModuleEnumKeys } from './types/enum/moduleEnum';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public roleEnv: RoleEnumKeys | '' = '';
  public currentModuleName: ModuleEnumKeys | '' = '';
  public id: number = 0;

  constructor() {}
}
