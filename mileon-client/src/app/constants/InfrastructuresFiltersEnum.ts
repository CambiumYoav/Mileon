export enum InfrastructuresFiltersEnum {
  All = 'הכל',
  Vehicles = 'רכבים',
  SubStages = 'תתי-שלבים',
  ViolationTypes = 'סוגי עברות',
  TicketsSource = 'מקור דוח ושיטת מסירה',
  Streets = 'רחובות',
  Areas = 'אזורים',
  Special = 'מאגר רכבים מיוחדים',
  Violations = 'סעיפי עבירה',
  Tolls = 'מסך אגרות',
}
const headersByInfrastructuresTypes = {
  [InfrastructuresFiltersEnum.All]: { header: '  ', id: null },
  [InfrastructuresFiltersEnum.Vehicles]: {
    header: 'משרד התחבורה',
    id: 1,
  },
};
const InfrastructuresEnumObj: { [key: number]: string } = {
  1: InfrastructuresFiltersEnum.Vehicles,
};

export const getTitleById = (id: number) => {
  return InfrastructuresEnumObj[id] || InfrastructuresFiltersEnum.All;
};

export const getHeaderByCurrentInfrastructures = (
  currentInfrastructures: string
) => {
  return headersByInfrastructuresTypes[currentInfrastructures].header;
};

export const getExternalInterfaceIdByHeader = (
  currentInfrastructures: string
) => {
  return headersByInfrastructuresTypes[currentInfrastructures].id;
};
