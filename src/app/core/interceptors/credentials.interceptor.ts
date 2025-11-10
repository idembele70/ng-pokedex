import { HttpInterceptorFn } from '@angular/common/http';
import { HttpUtilities } from '../utilities/http.utilities';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (HttpUtilities.isExcluded(req.url)) {
    return next(req);
  }
  const reqClone = req.clone({ withCredentials: true });
  return next(reqClone);
};
