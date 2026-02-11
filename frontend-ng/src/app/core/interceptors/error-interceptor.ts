import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 400) {
          errorMessage = 'Bad request';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error';
        }
      }
      
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
