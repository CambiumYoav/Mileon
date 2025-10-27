import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const authorityManagementRoutes: Routes = [
  // Authority Management home - redirect to main
  {
    path: '',
    redirectTo: RP.Management.Main,
    pathMatch: 'full',
  },

  // Authority Management main component
  {
    path: RP.Management.Main,
    loadComponent: () =>
      import('./authority-management-main/authority-management-main.component')
        .then(m => m.AuthorityManagementMainComponent),
  },

  // Authority Management create flow
  {
    path: 'create',
    loadComponent: () =>
      import('./authority-management-main/authority-management-main.component')
        .then(m => m.AuthorityManagementMainComponent),
    children: [
      {
        path: '',
        redirectTo: RP.Management.Authority,
        pathMatch: 'full',
      },
      {
        path: RP.Management.Authority,
        loadComponent: () =>
          import('./authority-management-details/authority-management-details.component')
            .then(m => m.AuthorityManagementDetailsComponent),
      },
      {
        path: RP.Management.Portal,
        loadComponent: () =>
          import('./authority-management-portal/authority-management-portal.component')
            .then(m => m.AuthorityManagementPortalComponent),
      },
      {
        path: RP.Management.TextTemplates,
        loadComponent: () =>
          import('./authority-management-templates/authority-management-templates.component')
            .then(m => m.AuthorityManagementTemplatesComponent),
        children: [
          {
            path: '',
            redirectTo: 'text',
            pathMatch: 'full',
          },
          {
            path: 'text',
            loadComponent: () =>
              import('./authority-management-templates-text/authority-management-templates-text.component')
                .then(m => m.AuthorityManagementTemplatesTextComponent),
          },
          {
            path: 'logo',
            loadComponent: () =>
              import('./authority-management-templates-logo/authority-management-templates-logo.component')
                .then(m => m.AuthorityManagementTemplatesLogoComponent),
          },
          {
            path: 'signature',
            loadComponent: () =>
              import('./authority-management-templates-signature/authority-management-templates-signature.component')
                .then(m => m.AuthorityManagementTemplatesSignatureComponent),
          },
        ],
      },
      {
        path: RP.Management.FormsManagement,
        loadComponent: () =>
          import('./authority-management-forms/authority-management-forms.component')
            .then(m => m.AuthorityManagementFormsComponent),
      },
    ],
  },

  // Authority Management edit flow
  {
    path: 'edit',
    loadComponent: () =>
      import('./authority-management-main/authority-management-main.component')
        .then(m => m.AuthorityManagementMainComponent),
    children: [
      {
        path: '',
        redirectTo: RP.Management.Authority,
        pathMatch: 'full',
      },
      {
        path: RP.Management.Authority,
        loadComponent: () =>
          import('./authority-management-details/authority-management-details.component')
            .then(m => m.AuthorityManagementDetailsComponent),
      },
      {
        path: RP.Management.Portal,
        loadComponent: () =>
          import('./authority-management-portal/authority-management-portal.component')
            .then(m => m.AuthorityManagementPortalComponent),
      },
      {
        path: RP.Management.TextTemplates,
        loadComponent: () =>
          import('./authority-management-templates/authority-management-templates.component')
            .then(m => m.AuthorityManagementTemplatesComponent),
        children: [
          {
            path: '',
            redirectTo: 'text',
            pathMatch: 'full',
          },
          {
            path: 'text',
            loadComponent: () =>
              import('./authority-management-templates-text/authority-management-templates-text.component')
                .then(m => m.AuthorityManagementTemplatesTextComponent),
          },
          {
            path: 'logo',
            loadComponent: () =>
              import('./authority-management-templates-logo/authority-management-templates-logo.component')
                .then(m => m.AuthorityManagementTemplatesLogoComponent),
          },
          {
            path: 'signature',
            loadComponent: () =>
              import('./authority-management-templates-signature/authority-management-templates-signature.component')
                .then(m => m.AuthorityManagementTemplatesSignatureComponent),
          },
        ],
      },
      {
        path: RP.Management.ImagesTemplates,
        loadComponent: () =>
          import('./authority-management-image-templates/authority-management-image-templates.component')
            .then(m => m.AuthorityManagementImageTemplatesComponent),
      },
      {
        path: RP.Management.FormsManagement,
        loadComponent: () =>
          import('./authority-management-forms/authority-management-forms.component')
            .then(m => m.AuthorityManagementFormsComponent),
      },
    ],
  },

  // Drafts and Letters management
  {
    path: RP.Management.DraftsAndLetters,
    loadComponent: () =>
      import('./authority-management-drafts-and-letters/authority-management-drafts-and-letters.component')
        .then(m => m.AuthorityManagementDraftsAndLettersComponent),
  },

  // Create Letter
  {
    path: `${RP.Management.DraftsAndLetters}/${RP.Management.CreateLetter}`,
    loadComponent: () =>
      import('./authority-management-letter/authority-management-letter.component')
        .then(m => m.AuthorityManagementLetterComponent),
  },

  // Update Letter
  {
    path: `${RP.Management.DraftsAndLetters}/${RP.Management.UpdateLetter}/:id/:name`,
    loadComponent: () =>
      import('./authority-management-letter/authority-management-letter.component')
        .then(m => m.AuthorityManagementLetterComponent),
  },

  // Create Draft
  {
    path: `${RP.Management.DraftsAndLetters}/${RP.Management.CreateDraft}`,
    loadComponent: () =>
      import('./authority-management-draft/authority-management-draft.component')
        .then(m => m.AuthorityManagementDraftComponent),
  },

  // Update Draft
  {
    path: `${RP.Management.DraftsAndLetters}/${RP.Management.UpdateDraft}/:id/:name`,
    loadComponent: () =>
      import('./authority-management-draft/authority-management-draft.component')
        .then(m => m.AuthorityManagementDraftComponent),
  },

  // Timeline Settings
  {
    path: RP.Management.TimelineSettings,
    loadComponent: () =>
      import('./timeline/timeline.component')
        .then(m => m.TimelineComponent),
    children: [
      {
        path: '',
        redirectTo: RP.Management.Tickets,
        pathMatch: 'full',
      },
      {
        path: RP.Management.Tickets,
        loadComponent: () =>
          import('./timeline/ticket-timeline/ticket-timeline.component')
            .then(m => m.TicketTimelineComponent),
        children: [
          {
            path: '',
            redirectTo: RP.Management.TicketsWindow,
            pathMatch: 'full',
          },
          {
            path: RP.Management.TicketsWindow,
            loadComponent: () =>
              import('./timeline/ticket-timeline/ticket-window/ticket-window.component')
                .then(m => m.TicketWindowComponent),
          },
          {
            path: RP.Management.TransportOffice,
            loadComponent: () =>
              import('./timeline/ticket-timeline/transport-office/transport-office.component')
                .then(m => m.TransportOfficeComponent),
          },
          {
            path: RP.Management.InformationAuth,
            loadComponent: () =>
              import('./timeline/ticket-timeline/information-auth/information-auth.component')
                .then(m => m.InformationAuthComponent),
          },
          {
            path: RP.Management.EarlyNotice,
            loadComponent: () =>
              import('./timeline/ticket-timeline/early-notice/early-notice.component')
                .then(m => m.EarlyNoticeComponent),
          },
          {
            path: RP.Management.PaymentNotice,
            loadComponent: () =>
              import('./timeline/ticket-timeline/payment-notice/payment-notice.component')
                .then(m => m.PaymentNoticeComponent),
          },
          {
            path: RP.Management.AdminApprovedToEnforce,
            loadComponent: () =>
              import('./timeline/ticket-timeline/admin-approved-to-enforce/admin-approved-to-enforce.component')
                .then(m => m.AdminApprovedToEnforceComponent),
          },
        ],
      },
      {
        path: RP.Management.Enforcement,
        loadComponent: () =>
          import('./timeline/enforcement/enforcement.component')
            .then(m => m.EnforcementComponent),
        children: [
          {
            path: '',
            redirectTo: RP.Management.AdminApprovedToEnforce,
            pathMatch: 'full',
          },
          {
            path: RP.Management.AdminApprovedToEnforce,
            loadComponent: () =>
              import('./timeline/ticket-timeline/admin-approved-to-enforce/admin-approved-to-enforce.component')
                .then(m => m.AdminApprovedToEnforceComponent),
          },
          {
            path: RP.Management.DetailsConfirmation,
            loadComponent: () =>
              import('./timeline/enforcement/details-confirmation/details-confirmation.component')
                .then(m => m.DetailsConfirmationComponent),
          },
          {
            path: RP.Management.OrderMessage,
            loadComponent: () =>
              import('./timeline/enforcement/order-message/order-message.component')
                .then(m => m.OrderMessageComponent),
          },
          {
            path: RP.Management.FormThree,
            loadComponent: () =>
              import('./timeline/enforcement/form-three/form-three.component')
                .then(m => m.FormThreeComponent),
          },
          {
            path: RP.Management.DebtReminder,
            loadComponent: () =>
              import('./timeline/enforcement/debt-reminder/debt-reminder.component')
                .then(m => m.DebtReminderComponent),
          },
          {
            path: RP.Management.BankForeclosure,
            loadComponent: () =>
              import('./timeline/enforcement/bank-foreclosure/bank-foreclosure.component')
                .then(m => m.BankForeclosureComponent),
          },
          {
            path: RP.Management.TaltalinForeclosureSignUp,
            loadComponent: () =>
              import('./timeline/enforcement/taltalin-foreclosure-sign-up/taltalin-foreclosure-sign-up.component')
                .then(m => m.TaltalinForeclosureSignUpComponent),
          },
          {
            path: RP.Management.TaltalinForeclosureOnGoing,
            loadComponent: () =>
              import('./timeline/enforcement/taltalin-foreclosure-on-going/taltalin-foreclosure-on-going.component')
                .then(m => m.TaltalinForeclosureOnGoingComponent),
          },
          {
            path: RP.Management.VehicleForeclosureSignUp,
            loadComponent: () =>
              import('./timeline/enforcement/vehicle-foreclosure-sign-up/vehicle-foreclosure-sign-up.component')
                .then(m => m.VehicleForeclosureSignUpComponent),
          },
          {
            path: RP.Management.VehicleForeclosureOnGoing,
            loadComponent: () =>
              import('./timeline/enforcement/vehicle-foreclosure-on-going/vehicle-foreclosure-on-going.component')
                .then(m => m.VehicleForeclosureOnGoingComponent),
          },
          {
            path: RP.Management.ThirdSideForeclosure,
            loadComponent: () =>
              import('./timeline/enforcement/third-side-foreclosure/third-side-foreclosure.component')
                .then(m => m.ThirdSideForeclosureComponent),
          },
        ],
      },
    ],
  },
];