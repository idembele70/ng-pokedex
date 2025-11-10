import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const EXCLUDED_PATHS = ['assets/']; 

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (EXCLUDED_PATHS.some(path => req.url.includes(path))) {
    return next(req);
  }

  const cleanPath = req.url.startsWith('/') ? req.url.slice(1) : req.url;
  const apiUrl = new URL(cleanPath, environment.API_URL).toString();

  const apiReq = req.clone({ url: apiUrl });
  return next(apiReq);
};
