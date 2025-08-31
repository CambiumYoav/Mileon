export enum ExternalInterfacesFiltersEnum {
  All = 'הכל',
  MinistyOfTransport = 'משרד התחבורה',
  MinistryOfInterior = 'משרד הפנים',
}
const headersByExternalInterfacesTypes: { [key in ExternalInterfacesFiltersEnum]?: { header: string; id: number | null } } = {
  [ExternalInterfacesFiltersEnum.All]: { header: '  ', id: null },
  [ExternalInterfacesFiltersEnum.MinistyOfTransport]: {
    header: 'משרד התחבורה',
    id: 1,
  },
  [ExternalInterfacesFiltersEnum.MinistryOfInterior]: {
    header: 'משרד הפנים',
    id: 2,
  },
};
const externalInterfacesEnumObj: { [key: number]: string } = {
  1: ExternalInterfacesFiltersEnum.MinistyOfTransport,
  2: ExternalInterfacesFiltersEnum.MinistryOfInterior,
};

export const getTitleById = (id: number) => {
  return externalInterfacesEnumObj[id] || ExternalInterfacesFiltersEnum.All;
};

export const getHeaderByCurrentExternalInterfaces = (
  currentExternalInterfaces: ExternalInterfacesFiltersEnum
) => {
  return headersByExternalInterfacesTypes[currentExternalInterfaces]?.header || '';
};

export const getExternalInterfaceIdByHeader = (
  currentExternalInterfaces: ExternalInterfacesFiltersEnum
) => {
  return headersByExternalInterfacesTypes[currentExternalInterfaces]?.id;
};
