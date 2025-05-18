import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const token = this.authService.getToken();

    // Don't add token for certain endpoints (like public endpoints or authentication endpoints)
    if (!token || request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
      return next.handle(request);
    }

    // Clone the request and add the authorization header
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Pass the cloned request with the token to the next handler
    return next.handle(authRequest);
  }
}
