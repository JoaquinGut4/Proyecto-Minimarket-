import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../servicios/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const user = auth.getCurrentUser();

  if (user?.token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${user.token}` }
    });
    return next(cloned);
  }

  return next(req);
};
