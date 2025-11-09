import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();

  const tokenReq = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return next(tokenReq);
};
