import { Routes } from '@angular/router';

export const ticketsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tickets-new.component').then((m) => m.TicketsNewComponent),
  },
];

// TODO: need to be like this
// // tickets-routes.ts
// import { Routes } from '@angular/router';
// import { RP } from './route-paths'; // your constants (must be relative, no leading slash)

// export const ticketsRoutes: Routes = [
//   // /tickets
//   {
//     path: '',
//     loadComponent: () =>
//       import('./tickets-new.component').then(m => m.TicketsNewComponent),
//   },

//   // /tickets/main
//   {
//     path: 'main',
//     loadComponent: () =>
//       import('./tickets-back-office-main.component')
//         .then(m => m.TicketsBackOfficeMainComponent),
//     // canActivate: [authGuard] // functional guard example below
//   },

//   // /tickets/<RP.TicketsNew.Tickets>
//   {
//     path: RP.TicketsNew.Tickets,
//     loadComponent: () =>
//       import('./tickets-new.component').then(m => m.TicketsNewComponent),
//   },

//   // /tickets/<RP.TicketsNew.Ticket>/:id  -> shell with children
//   {
//     path: `${RP.TicketsNew.Ticket}/:id`,
//     loadComponent: () =>
//       import('./ticket.component').then(m => m.TicketComponent), // shell
//     children: [
//       // /tickets/<ticket>/:id  -> redirect to 'details'
//       { path: '', pathMatch: 'full', redirectTo: RP.TicketsNew.Details },

//       {
//         path: RP.TicketsNew.Details,
//         loadComponent: () =>
//           import('./details/ticket-details.component')
//             .then(m => m.TicketDetailsComponent),
//       },
//       {
//         path: RP.TicketsNew.Violation,
//         loadComponent: () =>
//           import('./violation/ticket-violation-details.component')
//             .then(m => m.TicketViolationDetailsComponent),
//       },
//       {
//         path: RP.TicketsNew.Owner,
//         loadComponent: () =>
//           import('./owner/ticket-owner-details.component')
//             .then(m => m.TicketOwnerDetailsComponent),
//       },
//       {
//         path: RP.TicketsNew.PaymentHistory,
//         loadComponent: () =>
//           import('./payment/ticket-payment-details.component')
//             .then(m => m.TicketPaymentDetailsComponent),
//       },
//       {
//         path: RP.TicketsNew.ConnectedTickets,
//         loadComponent: () =>
//           import('./connected/ticket-connect-details.component')
//             .then(m => m.TicketConnectDetailsComponent),
//       },
//       {
//         path: RP.TicketsNew.History,
//         loadComponent: () =>
//           import('./history/ticket-history-action.component')
//             .then(m => m.TicketHistoryActionComponent),
//       },
//     ],
//   },
// ];
