import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { i18nProviders } from './config/i18n.config';
import { toastrProviders } from './config/toastr.config';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(
        [
          credentialsInterceptor,
          refreshTokenInterceptor,
          tokenInterceptor,
          apiInterceptor,
        ]
      )
    ),
    ...i18nProviders,
    ...toastrProviders,
  ],
};
