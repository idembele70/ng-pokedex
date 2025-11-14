import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { HttpUtilities } from '../utilities/http.utilities';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (HttpUtilities.isExcluded(req.url)) {
    return next(req);
  }
  const refreshTokenService = inject(RefreshTokenService);
  const jwtService = inject(JwtService);
  const tokenReq = addTokenToHeader(req, jwtService.getToken());

  return next(tokenReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
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
