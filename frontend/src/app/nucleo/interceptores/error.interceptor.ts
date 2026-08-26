import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../servicios/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      // 401: sesión expirada, redirige al login
      if (error.status === 401) {
        auth.logout();
        router.navigateByUrl('/admin/ingreso');
        return throwError(() => new Error('Sesión expirada. Inicia sesión nuevamente'));
      }

      // Traduce códigos HTTP a mensajes legibles
      let message = 'Error en la comunicación con el servidor';
      if (error.error?.error) {
        message = error.error.error;
      } else if (error.status === 0) {
        message = 'No se puede conectar con el servidor';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado';
      } else if (error.status === 409) {
        message = error.error?.error || 'Conflicto en la operación';
      }
      return throwError(() => new Error(message));
    })
  );
};
