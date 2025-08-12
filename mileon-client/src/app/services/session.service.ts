import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  /**
   * Sets a value in session storage.
   * @param key The key to store the value under.
   * @param value The value to store.
   */
  set(key: string, value: any): void {
    if (typeof value === 'string') {
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Gets a value from session storage.
   * @param key The key of the value to retrieve.
   * @param defaultValue The default value to return if the key is not found.
   * @returns The value stored under the specified key, or the default value if not found.
   */
  get<T>(key: string, defaultValue?: T): T | null {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.error(`Error parsing value for key "${key}":`, error);
      }
    }
    return defaultValue || null;
  }

  getToken(key: string): string | null {
    const value = sessionStorage.getItem(key);
    if (value) {
      try {
        return value;
      } catch (error) {
        console.error(`Error parsing value for key "${key}":`, error);
      }
    }
    return null;
  }

  /**
   * Removes a value from session storage.
   * @param key The key of the value to remove.
   */
  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clears all values from session storage.
   */
  clear(): void {
    sessionStorage.clear();
  }
}
