import { AccessType, HttpMethod } from './permissions.enum';

export const ApiPaths = {
  Tickets: {
    GETALL: {
      name: 'GetTickets',
      path: 'GetTickets',
      method: HttpMethod.GET,
      type: AccessType.READ,
    },
    DETAIL: {
      path: (id: string) => `employees/${id}`,
      method: HttpMethod.GET,
      type: AccessType.READ,
    },
    CREATE: {
      path: 'employees',
      method: HttpMethod.POST,
      type: AccessType.WRITE,
    },
    UPDATE: {
      path: (id: string) => `employees/${id}`,
      method: HttpMethod.PUT,
      type: AccessType.WRITE,
    },
    DELETE: {
      path: (id: string) => `employees/${id}`,
      method: HttpMethod.DELETE,
      type: AccessType.WRITE,
    },
  },
  Task: {
    CREATE: {
      path: 'tasks',
      method: HttpMethod.POST,
      type: AccessType.WRITE,
    },
    GETALL: {
      path: 'tasks',
      method: HttpMethod.GET,
      type: AccessType.READ,
    },
    DETAIL: {
      path: (id: string) => `tasks/${id}`,
      method: HttpMethod.GET,
      type: AccessType.READ,
    },
  },
  Report: {
    CREATE: {
      path: 'reports',
      method: HttpMethod.POST,
      type: AccessType.WRITE,
    },
    GETALL: {
      path: 'reports',
      method: HttpMethod.GET,
      type: AccessType.READ,
    },
  },
} as const;
