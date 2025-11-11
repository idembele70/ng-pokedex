import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HttpUtilities } from '../utilities/http.utilities';


export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (HttpUtilities.isExcluded(req.url)) {
    return next(req);
  }

  const cleanPath = req.url.startsWith('/') ? req.url.slice(1) : req.url;
  const apiUrl = new URL(cleanPath, environment.API_URL).toString();

  const apiReq = req.clone({ url: apiUrl });
  return next(apiReq);
};
