import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_PATHS_TOKEN } from '../config/api-paths.config';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenService } from '../services/refresh-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshTokenService = inject(RefreshTokenService);
  const token = inject(JwtService).getToken();
  const tokenReq = addTokenToHeader(req, token);
  const apiPaths = inject(API_PATHS_TOKEN);

  return next(tokenReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (
        err.url?.endsWith(apiPaths.AUTH.ME) &&
        err.status === 500
      ) {
        return refreshTokenService.refreshToken().pipe(
          switchMap(({ accessToken }) => {
            const retryReq = addTokenToHeader(tokenReq, accessToken);
            return next(retryReq);
          })
        )
      } else {
        return throwError(() => err);
      }
    }),
  );
};

const addTokenToHeader = (req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> => {
  return req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}
