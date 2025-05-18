import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        this.userSubject.next(user);
      }
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string, user: User }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.userSubject.next(response.user);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  getMe(): Observable<any> {
    return this.http.get<{ user: User }>(`${environment.apiUrl}/api/user/me`)
      .pipe(
        tap(response => {
          this.setUser(response.user);
          this.userSubject.next(response.user);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
  }

  updateProfile(name: string, avatar?: string): Observable<any> {
    return this.http.patch<{ user: User }>(`${environment.apiUrl}/api/user/profile`, { name, avatar })
      .pipe(
        tap(response => {
          this.setUser(response.user);
          this.userSubject.next(response.user);
        })
      );
  }

  verifyEmail(code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-email?code=${code}`);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  setUser(user: User): void {
    if (this.isBrowser) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;

    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
