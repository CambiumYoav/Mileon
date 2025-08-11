import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  NgbModule,
  NgbNavModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    // UI Framework Providers
    // providePrimeNG(PRIMENG_THEME_CONFIG),

    // Internationalization (i18n) Providers
    // Core Angular providers
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
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
