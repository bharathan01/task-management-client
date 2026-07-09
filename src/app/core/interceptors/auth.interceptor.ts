import { HttpInterceptorFn } from '@angular/common/http';
import { getToken } from '../helpers/token.helper';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
