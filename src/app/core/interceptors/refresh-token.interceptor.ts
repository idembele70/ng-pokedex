import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenService } from '../services/refresh-token.service';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshTokenService = inject(RefreshTokenService);
  const jwtService = inject(JwtService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return refreshTokenService.refreshToken().pipe(
          switchMap(() => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${jwtService.getToken()}` }
            });
            return next(retryReq);
          }))
      }
      return throwError(() => error);
    })
  );
};
