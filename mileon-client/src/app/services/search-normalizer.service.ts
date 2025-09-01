import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class SearchNormalizerService {
  constructor(private baseService: BaseService) {}

  normalizeForSearch<T extends Record<string, any>>(value: T): T {
    if (!value || typeof value !== 'object') return value;
    const cloned: any = Array.isArray(value) ? [...(value as any)] : { ...value };

    const normalizeIdsRecursively = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        const current = obj[key];
        if (current && typeof current === 'object' && !Array.isArray(current)) {
          normalizeIdsRecursively(current);
          continue;
        }

        const lowerKey = key.toLowerCase();
        const isIdLike = lowerKey.endsWith('id') || lowerKey.endsWith('ids');
        if (isIdLike && current != null && !Array.isArray(current)) {
          obj[key] = [current];
        }
        if (isIdLike && Array.isArray(obj[key])) {
          obj[key] = obj[key].map((v: any) => {
            const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
            return typeof n === 'number' && !Number.isNaN(n) ? n : v;
          });
        }
      }
    };

    const normalizeDatesAndTimes = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      for (const key of Object.keys(obj)) {
        const current = obj[key];
        if (current && typeof current === 'object' && !Array.isArray(current)) {
          normalizeDatesAndTimes(current);
        }

        if (typeof current === 'string' && key.toLowerCase().includes('time')) {
          obj[key] = this.baseService.convertTimeToDateTime(current);
        }

        if (current instanceof Date && key.toLowerCase().includes('date')) {
          this.baseService.setTimeToMidday(current);
        }
      }
    };

    normalizeIdsRecursively(cloned);
    normalizeDatesAndTimes(cloned);
    return cloned as T;
  }
}


