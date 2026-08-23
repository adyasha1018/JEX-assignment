import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AppErrorService } from '../services/app-error.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const appError = inject(AppErrorService);

  return next(req).pipe(
    catchError((error) => {
      const message = appError.messageFromError(error, 'Something went wrong. Please try again.');

      console.error('[HTTP Error]', message, error);

      return throwError(() => error);
    }),
  );
};
