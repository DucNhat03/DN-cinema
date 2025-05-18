import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 401) {
            console.error('Unauthorized access, redirecting to login');
            this.router.navigate(['/auth/login']);
          } else if (error.status === 403) {
            console.error('Forbidden access');
          } else if (error.status === 404) {
            console.error('Resource not found');
          } else if (error.status === 500) {
            console.error('Server error');
          }

          errorMessage = `Error Code: ${error.status},  Message: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
