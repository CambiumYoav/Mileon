import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, ROUTER_CONFIGURATION } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  NgbModule,
  NgbNavModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './services/user.service';
import { routerConfig } from './config/routerConfig';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // UI Framework Providers
    // providePrimeNG(PRIMENG_THEME_CONFIG),

    // Internationalization (i18n) Providers
    // Core Angular providers
    DecimalPipe,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: ROUTER_CONFIGURATION, useValue: routerConfig },
    
    // { provide: 'Popper', useValue: Popper },
    JwtHelperService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // MatBottomSheet,
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection(),

    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        preventDuplicates: true,
      }),
      NgbModule,
      NgbNavModule,
      NgbPopoverModule
    ),
    // provideAuth(() => getAuth()),
  ],
};
