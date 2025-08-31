export enum LegalRequestsFiltersEnum {
  All = 'הכל',
  ConversionRequests = 'בקשות הסבה',
  JudgedRequests = 'בקשות להישפט',
  AppealRequests = 'בקשות ערעור',
}

const headersByLegalRequestsTypes: { [key in LegalRequestsFiltersEnum]?: { header: string; id: number | null } } = {
  [LegalRequestsFiltersEnum.All]: { header: 'בקשות משפטיות לטיפול', id: null },
  [LegalRequestsFiltersEnum.ConversionRequests]: {
    header: 'בקשות הסבה לטיפול',
    id: 1,
  },
  [LegalRequestsFiltersEnum.JudgedRequests]: {
    header: 'בקשות להישפט לטיפול',
    id: 4,
  },
  [LegalRequestsFiltersEnum.AppealRequests]: {
    header: 'בקשות ערעור לטיפול',
    id: 2,
  },
};

const legalRequestsEnumObj: { [key: number]: string } = {
  1: LegalRequestsFiltersEnum.ConversionRequests,
  2: LegalRequestsFiltersEnum.AppealRequests,
  4: LegalRequestsFiltersEnum.JudgedRequests,
};

export const getTitleById = (id: number) => {
  return legalRequestsEnumObj[id] || LegalRequestsFiltersEnum.All;
};

export const getHeaderByCurrentLegalRequest = (currentLegalRequest: LegalRequestsFiltersEnum) => {
  return headersByLegalRequestsTypes[currentLegalRequest]?.header || '';
};

export const getLegalRequestIdByHeader = (currentLegalRequest: LegalRequestsFiltersEnum) => {
  return headersByLegalRequestsTypes[currentLegalRequest]?.id;
};
