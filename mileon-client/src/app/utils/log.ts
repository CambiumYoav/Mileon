import { isDevMode } from '@angular/core';

export default function log(message: string, ...optionalParams: any[]) {
  if (isDevMode()) {
    console.log(message, ...optionalParams);
  }
}
