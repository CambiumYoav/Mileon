
export namespace ROUTE_PATH {
  export enum Tickets {
    Details = 'details',
    Home = '',
  }

  export enum BackOffice {
    Home = 'back-office',
  }

  export enum TicketsNew {
    Home = 'tickets-new',
    Main = 'main',
    Tickets = 'tickets',
    Ticket = 'ticket',
    Details = 'details',
    Owner = 'owner',
    Violation = 'violation',
    PaymentHistory = 'payment-history',
    ConnectedTickets = 'connected-tickets',
    History = 'history',
    Payment = 'payment',
  }

  export enum ParkingPermits {
    Home = 'parking-permits',
    Blank = '',
    Main = 'main',
    Details = 'details',
    RequestDocuments = 'request-documents',
    Create = 'create',
    Types = 'types',
    TypesMain = 'types-main',
    TypesManagement = 'permits-types',
    CreateUpdateMain = 'create-update-main',  
    CreateType = 'create-type',
    EditType = 'edit-type',
    PermitsTypesSettings = 'types-settings',
    PermitsTypesDocumnents = 'types-documents',
    PersonalDetails = 'personal-details',
    VehicleDetails = 'vehicle-details',
    Scans= 'scans',
    CreateNew='create-new',
    Summary = 'summary',
  }

  export enum LegalRequests {
    Home = 'legal-requests',
    LegalRequest = 'legal-request',
    Blank = '',
    Main = 'main',
    Create = 'create',
    Details = 'details',
    RequestDocuments = 'request-documents',
    TicketDetails = 'ticket-details',
    History = 'history',
  }
  export enum MinistyOfTransport {
    Home = 'ministry-of-transport',
    Blank = '',
    Main = 'main',
  }

  export enum Payment {
    Main = 'payment',
    Success = 'payment-success',
    Error = 'payment-error',
  }

  export enum MinistryOfInterior {
    Home = 'ministry-of-interior',
    Blank = '',
    Main = 'main',
  }

  export enum Notices {
    Home = 'notices',
    Blank = '',
    Main = 'main',
    Manage = 'manage',
  }

  export enum Infrastructure {
    Home = 'infrastructure',
    Blank = '',
    Main = 'main',
    VehiclesType = 'vehicle-type',
    VehiclesColors = 'vehicle-colors',
    VehiclesManufacture = 'vehicle-manufacture',
    Violation = 'viloation-types',
    ViolationProcess = 'viloation-process-types',
    SubStages = 'sub-stages',
    TicketsSource = 'tickets-source',
    TicketsStagesStatuses = 'tickets-stages-statuses',
    Streets = 'streets',
    Citizens = 'citizens',
    Areas = 'areas',
    Chips = 'chips',
    PlaintiffsCauses = 'plaintiffs-causes',
    Signs = 'signs',
    Special = 'special',
    Business = 'business',
    Violations = 'violations',
    Tolls = 'tolls',
  }

  export enum ProsecutorCaseSettings {
    Home = 'prosecutor-case-settings',
    Blank = '',
    Main = 'main',
    RequestCancellation = 'request-cancellation',
    RequestTrial = 'request-trial',
    RequestConversion = 'request-conversion',
    DecisionCodeForLetters = 'decision-codes',
  }

  export enum UsersPermissions {
    Home = 'users-permissions',
    Blank = '',
    Main = 'main',
    Users = 'users',
    Permissions = 'permissions',
    Management = 'permissions/management',
    Table = 'permissions/groups',
    CreateUser = 'users/create-user',
    EditUser = 'users/edit-user',
    User = 'users/user',
    ParkingPermitsManagement = 'parking-permits-management',
    UserRoutes = 'user-permissions',
    AdminRoutes = 'admin-permissions',
    NationalUsers = 'national-users',
  }

  export enum InventoryManagement {
    Home = 'inventory-management',
    Blank = '',
    Main = 'main',
  }

  export enum Management {
    Home = 'management',
    Blank = '',
    Main = 'main',
    Portal = 'portal',
    Authority = 'authority',
    Templates = 'templates',
    TextTemplates = 'text-templates',
    ImagesTemplates = 'logo-templates',
    SignatureTemplates = 'signature-templates',
    TimelineSettings = 'timeline',
    Tickets = 'tickets',
    Enforcement = 'enforcement',
    TicketsWindow = 'ticket-window',
    TransportOffice = 'transport-office',
    InformationAuth = 'information-auth',
    EarlyNotice = 'early-notice',
    PaymentNotice = 'payment-notice',
    AdminApprovedToEnforce = 'admin-approve-enforce',
    DetailsConfirmation = 'details-confirmation',
    OrderMessage = 'order-message',
    FormThree = 'form-three',
    DebtReminder = 'debt-reminder',
    BankForeclosure = 'bank-foreclosure',
    TaltalinForeclosureSignUp = 'foreclosure-signUp',
    TaltalinForeclosureOnGoing = 'foreclosure-ongoing',
    VehicleForeclosureSignUp = 'vehicle-foreclosure-signup',
    VehicleForeclosureOnGoing = 'vehicle-foreclosure-ongoing',
    ThirdSideForeclosure = 'third-party-foreclosure',
    TicketsGenerator = 'tickets-generator',
    FormsManagement = 'authority-forms',
    DraftsAndLetters = 'drafts-and-letters',
    CreateLetter = 'create-letter',
    UpdateLetter = 'update-letter',
    CreateDraft = 'create-draft',
    UpdateDraft = 'update-draft',
  }

  export enum Terminal {
    Home = 'msofon',
    Blank = '',
    Main = 'main',
    Notebooks = 'ticket-books-management',
    Inspectors = 'inspectors',
    Settings = 'settings',
    GeneralSetings = 'general-settings',
    Messages = 'inspectors/messages',
    ExternalInterfaceSettings = 'external-interface-settings',
    LegalityByTypeOfOffenseSettings = 'legality-settings',
    IconsSettings = 'icons-settings',
    Statistics = 'statistics',
    StatisticsPie = 'pie', //change the names
    StatisticsLine = 'line',
    StatisticsBar = 'bar',
    StatisticsTable = 'table',
  }
  export enum Enforcement {
    Home = 'enforcement',
    Blank = '',
    Main = 'main',
  }

  export enum Dispatcher {
    Main = 'main',
    Dispatcher = 'dispatcher',
  }

  export enum AI {
    Main = 'ask-ai',
  }
}
