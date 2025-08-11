export enum AuthorityCategory {
  Veterinary = 1,
  Parking = 2,
  GeneralSupervision = 3,
}
export const AuthorityCategoryLabels: Record<AuthorityCategory, string> = {
  [AuthorityCategory.Veterinary]: 'מחלקת וטרינריה מנהלי',
  [AuthorityCategory.Parking]: 'מחלקת חניה',
  [AuthorityCategory.GeneralSupervision]: 'מחלקת פיקוח כללי',
};

export enum AuthorityCategoryIcon {
  Veterinary = 1,
  Parking = 2,
  Supervision = 3,
}

export const AuthorityCategoryIcons: Record<AuthorityCategoryIcon, string> = {
  [AuthorityCategoryIcon.Veterinary]: 'vet.svg',
  [AuthorityCategoryIcon.Parking]: 'menu-car.svg',
  [AuthorityCategoryIcon.Supervision]: 'chart.svg.svg',
};
