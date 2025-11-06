import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { i18nProviders } from './config/i18n.config';
import { toastrProviders } from './config/toastr.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ...i18nProviders,
    ...toastrProviders,
  ],
};
