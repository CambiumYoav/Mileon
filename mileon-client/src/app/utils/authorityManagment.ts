export class AuthorityManagementUtils {
  static createCreateDTO(authorityData: any, customerData: any): any {
    return {
      authority: {
        authorityName: authorityData.authorityName,
        shaamNumber: authorityData.shaamNumber || null,
        phone: authorityData.phone || null,
        email: authorityData.email || null,
        faxNumber: authorityData.faxNumber || null,
      },
      customer: {
        contractStartDate: customerData.contractStartDate || null,
        contractEndDate: customerData.contractEndDate || null,
        extensionOptionYears: customerData.extensionOptionYears
          ? parseInt(customerData.extensionOptionYears)
          : null,
        customerManagerName: customerData.customerManagerName,
        customerManagerEmail: customerData.customerManagerEmail,
        guaranteeAmount: customerData.guaranteeAmount
          ? parseFloat(customerData.guaranteeAmount)
          : null,
        guaranteeValidityDate: customerData.guaranteeValidityDate || null,
      },
    };
  }

  static createUpdateDTO(
    authorityData: any,
    customerData: any,
    currentAuthority: string
  ): any {
    return {
      authority: {
        authorityID: currentAuthority,
        authorityName: authorityData.authorityName,
        shaamNumber: authorityData.shaamNumber || null,
        phone: authorityData.phone || null,
        email: authorityData.email || null,
        faxNumber: authorityData.faxNumber || null,
      },
      customer: {
        id: customerData.id || customerData.customerID, // Customer ID for updates
        authorityID: currentAuthority,
        contractStartDate: customerData.contractStartDate || null,
        contractEndDate: customerData.contractEndDate || null,
        extensionOptionYears: customerData.extensionOptionYears
          ? parseInt(customerData.extensionOptionYears)
          : null,
        customerManagerName: customerData.customerManagerName,
        customerManagerEmail: customerData.customerManagerEmail,
        guaranteeAmount: customerData.guaranteeAmount
          ? parseFloat(customerData.guaranteeAmount)
          : null,
        guaranteeValidityDate: customerData.guaranteeValidityDate || null,
      },
    };
  }
  static patchDynamicForm(formConfig: any[], data: any) {
    if (!data || !formConfig) return;

    formConfig.forEach((rowGroup: any) => {
      rowGroup.row.forEach((field: any) => {
        if (data.hasOwnProperty(field.name)) {
          if (field.type === 'date' && data[field.name]) {
            const date = new Date(data[field.name]);
            const localDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate() + 1
            );
            field.value = localDate.toISOString().split('T')[0]; // yyyy-MM-dd
          } else if (
            data[field.name] !== null &&
            data[field.name] !== undefined
          ) {
            field.value = data[field.name];
          } else {
            field.value = '';
          }
        }
      });
    });
  }
}
