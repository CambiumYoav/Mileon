
export enum ModuleEnum {
  TicketsNewModule = 1,
  ParkingPermitsModule,
  LegalRequestsModule,
  MinistryOfInteriorModule,
  MinistryOfTransportModule,
  NoticesModule,
  InfrastructureModule,
  ProsecutorCaseSettingsModule,
  UsersPermissionsModule,
  InventoryManagementModule,
  // ManagementModule, // REMOVE
  AuthorityManagementModule,
  TerminalModule,
}

export enum ModuleNames {
  TicketsNewModule = 'עולם הדוחות',
  ParkingPermitsModule = 'עולם התווים',
  LegalRequestsModule = 'מחלקה משפטית',
  MinistryOfInteriorModule = 'משרד הפנים',
  MinistryOfTransportModule = 'משרד התחבורה',
  InterfacesModule = 'ממשקים',
  NoticesModule = 'הפקות',
  NoticesMain = 'ניהול',
  InfrastructureModule = 'טבלאות תשתית',
  InfrastructureLocalModule = 'טבלאות תשתית - ',
  InfrastructureAdminModule = 'טבלאות תשתית - ',
  InfrastructureLocal = 'מקומי',
  InfrastructureEearthly = 'ארצי',
  VehiclesInfrastructure = 'רכבים',
  SubStages = 'תתי-שלבים',
  ViolationTypes = 'סוגי עברות',
  TicketsSource = 'מקור דוח ושיטת מסירה',
  Streets = 'רחובות',
  Areas = 'אזורים',
  TicketsStagesStatuses = 'מיפוי שלבים וסטטוסים',
  Citizens = 'תושבים',
  Chips = 'שבבים',
  PlaintiffsCauses = 'עילות תובע',
  Signs = 'שלטים',
  Special = 'מאגר רכבים מיוחדים',
  Business = 'עסקים',
  Violations = 'סעיפי עבירה',
  Tolls = 'אגרות',
  ProsecutorCaseSettings = 'הגדרות תיק תובע',
  UsersPermissions = 'ניהול משתמשים והרשאות',
  Users = 'משתמשים',
  Permissions = 'הרשאות',
  InventoryManagement = 'ניהול מלאי',
  Management = 'ניהול תווים',
  NationalUsers = 'משתמשים ארצי',
  Enforcement = 'אכיפה',
  TimelineSettings = 'סרגל ניהול חיי דוח',
  Settings = 'מאפייני רשות',
  Dashboards = 'דשבורדים - ',
  DashboardsSub = 'ניתוח BI ושאילתות',
  Terminal = 'מסופון',
  RegisterAndPayments = 'קופה ותשלומים',
  Modules = 'מודולים',
  Local = 'מקומי',
  CountryWide = 'ארצי',
  Legend = 'מקרא',
  TicketsSummary = 'ריכוז דוחות',
  BackOfficeSummary = 'ריכוז בקשות משפטיות',
  TicketsGenerator = 'יצירת דוחות',
  AuthoritySettings = 'הגדרות רשות',
  AuthorityCreate = 'הקמת רשות',
  Msofon = 'עולם המסופון',
  NotebooksManagement = 'ניהול פנקסים',
  InspectorsManagement = 'ניהול פקחים',
  TerminalSettings = 'הגדרות מסופון',
  TerminalStatistics = 'חיתוכים וגרפים',
  TerminalInsperctorsMessagesComponent = 'משימות והודעות לפקח',
  DraftsAndLetters = 'ניהול גלופות ומכתבים',
  DraftsAndLettersNewLetter = 'מכתב חדש',
  ParkingPermitsTypes = 'ניהול הגדרות סוגי תווים',
  ParkingPemitsTypesCreate = 'יצירת סוג תו חדש',
  ParkingPermitsCreate = 'יצירת תו חניה',
  ParkingPermitsMain = 'ניהול חיפוש תווים',
}

export enum SubModuleNames {
  Type = 'סוג',
  Color = 'צבעים',
  Manufacture = 'תוצרת',
  RequestCancellation = 'הגדרות בקשות לביטול',
  RequestTrial = 'הגדרות בקשות להישפט',
  RequestConversion = 'הגדרות בקשות להסבה',
  DecisionCodeForLetters = 'מכתבים',
  PortalSettings = 'הגדרות פורטל',
  AuthoritySettings = 'פרטי רשות',
  LettersSettings = 'ניהול טקסטים למכתבים וגלופות',
  FormsSettings = 'מאפייני טפסים מקוונים',
  AdminRoutes = 'עץ אתר מנהל מערכת',
  UserRoutes = 'עץ אתר תפעולי',
  TicketTimeline = 'חיי דוחות',
  EnforcementTimeline = 'אכיפה',
  GeneralSettings = 'הגדרות כלליות',
  ExternalInterfaceSettings = 'הגדרות ממשקים חיצוניים',
  LegalityByTypeOfOffenseSettings = 'חוקיות לפי סוג עבירות',
  IconsToViolationSettings = 'שיוך איקונים לעבירות',
  StatisticsPieTitle = 'התפלגות דוחות',
  StatisticsLineTitle = 'השוואת דוחות שנה קודמת',
  StatisticsBarTitle = ' התפלגות עבירות',
  StatisticsTableTitle = 'גרף לפי פקח',
  TemplatesText = 'טקסטים',
  TemplatesLogo = 'לוגואים',
  TemplatesSignature = 'חתימות',
  ParkingPermitsTypesDocumnents = '  טפסים',
  ParkingPermitsTypesSettings = '  הגדרות',

}

export enum ActionModuleEnum {
  CALL_SUMMARY = 1, // סיכום שיחה
  LEGAL_REQUEST = 2, //בקשה משפטית
  PARKING_PERMIT = 4, //תווי דייר
}

export enum RoleEnum {
  DISPATCHER = 'dispatcher',
  BACK_OFFICE = 'back-office',
  ADMIN = 'admin',
}

export enum RoleNames {
  DISPATCHER = 'מוקדנית',
  BACK_OFFICE = 'באק אופיס',
}

export type RoleEnumKeys = keyof typeof RoleEnum;

export type ModuleEnumKeys = keyof typeof ModuleEnum;
