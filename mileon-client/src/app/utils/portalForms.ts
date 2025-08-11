import { Menu, MenuItem } from '../types/base/menu.model';
import {
  AuthorityCategoryLabels,
  AuthorityCategoryIcons,
} from '../types/enum/authorityFormsCategory.enum';
import { FormsServerResponse } from '../types/management/authority-form.menu';

export class PortalFormsUtils {
  static patchServerKeys(rows: any[], data: any): any[] {
    return rows.map((row) => {
      const patched = { ...row };
      for (const [_, serverKey] of Object.entries(row.serverKeys || {})) {
        if ((serverKey as any) in data) {
          patched[serverKey as any] = data[serverKey as any];
        }
      }
      return patched;
    });
  }

  static buildSelectedValuesFromRows(data: any[]): { [key: string]: string } {
    const selectedValues: { [key: string]: string } = {};

    data.forEach((row, rowIndex) => {
      Object.entries(row.serverKeys || {}).forEach(([column, serverKey]) => {
        const key = `${column}_${rowIndex}`;
        if (typeof row[serverKey as any] === 'boolean') {
          selectedValues[key] = row[serverKey as any] ? 'yes' : 'no';
        }
      });
    });
    return selectedValues;
  }
  static extractServerPayload(
    tableData: any[],
    selectedValues: { [key: string]: string }
  ): Record<string, boolean> {
    const payload: Record<string, boolean> = {};

    tableData.forEach((row, rowIndex) => {
      Object.entries(row.serverKeys || {}).forEach(([column, serverKey]) => {
        const key = `${column}_${rowIndex}`;
        if (selectedValues.hasOwnProperty(key)) {
          payload[serverKey as any] = selectedValues[key] === 'yes';
        } else if (row.hasOwnProperty(serverKey)) {
          payload[serverKey as any] = row[serverKey as any];
        }
      });
    });
    return payload;
  }

  static mapWidgetsToSummary(
    data: Record<string, any>
  ): { name: string; value: string }[] {
    return Object.entries(data || {}).map(([key, value]) => ({
      name: key,
      value: value ? 'Yes' : 'No',
    }));
  }

  //authority-forms

  static mapCreatedFieldsToDefaults(
    createdFields: any[], //fields from the server
    defaultFields: any[]
  ): any[] {
    return defaultFields.map((defaultField) => {
      const match = createdFields.find(
        (f) =>
          f.name?.trim() === defaultField.name?.trim() ||
          f.displayName?.trim() === defaultField.displayName?.trim()
      );

      return {
        ...defaultField,
        ...(match
          ? { id: match.id, fieldNameValue: match.fieldNameValue ?? null }
          : {}),
      };
    });
  }

  static mergeFormsWithIDs(
    defaultForms: FormsServerResponse,
    serverForms: FormsServerResponse
  ): FormsServerResponse {
    const merged: FormsServerResponse = {};

    for (const [ticketTypeID, defaultFormList] of Object.entries(
      defaultForms
    )) {
      const serverFormList = serverForms[ticketTypeID] || [];

      const usedFormKeys = new Set(
        serverFormList.map((sf) => sf.formKey).filter((fk) => fk !== null)
      );

      merged[ticketTypeID] = defaultFormList.map((defaultForm) => {
        const matched = serverFormList.find((sf) =>
          defaultForm.formKey
            ? sf.formKey === defaultForm.formKey
            : sf.formKey === null && sf.formName === defaultForm.formName
        );

        if (matched && defaultForm.formKey) {
          usedFormKeys.delete(defaultForm.formKey);
        }

        return {
          ...defaultForm,
          ...(matched ? { formID: matched.formID } : {}),
        };
      });
    }

    return merged;
  }

  static buildMenuFromServer(data: FormsServerResponse): Menu {
    const menuItems: MenuItem[] = Object.entries(data).map(
      ([categoryId, forms]) => ({
        id: categoryId,
        displayName: AuthorityCategoryLabels[categoryId],
        path: '',
        route: '',
        icon: AuthorityCategoryIcons[categoryId],
        active: true,
        showItem: true,
        expanded: false,
        menuItems: forms.map((form) => ({
          id: form.formID!,
          displayName: form.formName,
          path: '',
          route: ``,
          active: true,
          showItem: true,
        })),
      })
    );
    return {
      name: 'FormsByCategory',
      menuItems,
    };
  }

  static mergeWithTitles(defaultFields: any[], serverFields: any[]): any[] {
    const result: any[] = [];
    const usedNames = new Set<string>();

    // צור Map מהשרת לפי name
    const serverMap = new Map(
      serverFields.filter((f) => f.name).map((f) => [f.name.trim(), f])
    );

    // עבור לפי הסדר של הדיפולט
    for (const defField of defaultFields) {
      if (defField.type === 'title') {
        result.push(defField); // הוסף כותרת כמו שהיא
      } else if (defField.name) {
        const trimmedName = defField.name.trim();
        if (serverMap.has(trimmedName)) {
          result.push(serverMap.get(trimmedName));
          usedNames.add(trimmedName);
        } else {
          result.push(defField);
          usedNames.add(trimmedName);
        }
      }
    }

    // הוסף שדות נוספים מהשרת שלא קיימים בדיפולט – בסוף
    for (const srvField of serverFields) {
      if (srvField.name && !usedNames.has(srvField.name.trim())) {
        result.push(srvField);
      }
    }

    return result;
  }
}
