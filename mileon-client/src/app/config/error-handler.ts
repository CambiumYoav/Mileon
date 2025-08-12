import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    // Your error handling logic here
    console.error('An error occurred:', error);
    // Log the error to a server, display a user-friendly message, etc.
  }
}
