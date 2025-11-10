import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { i18nProviders } from './core/config/i18n.config';
import { toastrProviders } from './core/config/toastr.config';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(
        [
          apiInterceptor,
          credentialsInterceptor,
          authInterceptor,
        ]
      )
    ),
    ...i18nProviders,
    ...toastrProviders,
  ],
};
