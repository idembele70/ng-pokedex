import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { API_PATHS } from '../constants/api-paths';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshTokenService = inject(RefreshTokenService);
  const jwtService = inject(JwtService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!error.url?.endsWith(API_PATHS.AUTH.REFRESH_TOKEN)) {
        return refreshTokenService.refreshToken().pipe(
          switchMap(() => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${jwtService.getToken()}` }
            });
            return next(retryReq);
          }));
      }
      return throwError(() => error);
    })
  );
};
