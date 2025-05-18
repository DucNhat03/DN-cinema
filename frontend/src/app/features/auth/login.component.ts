import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { zorroModules } from '../../core/zorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ...zorroModules
  ],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo">
              <i nz-icon nzType="play-circle" nzTheme="fill" class="logo-icon"></i>
              <h2 class="logo-text">DN Cinema</h2>
            </div>
            <h1 class="auth-title">Sign In</h1>
            <p class="auth-subtitle">Welcome back! Please enter your details</p>
          </div>

          <form class="auth-form" (ngSubmit)="login()">
            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-with-icon">
                <i nz-icon nzType="mail" class="input-icon"></i>
                <input
                  nz-input
                  type="email"
                  id="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  autocomplete="email"
                />
              </div>
            </div>

            <div class="form-group">
              <div class="label-with-link">
                <label for="password">Password</label>
                <a class="forgot-link" [routerLink]="['/auth/forgot-password']">Forgot password?</a>
              </div>
              <div class="input-with-icon">
                <i nz-icon nzType="lock" class="input-icon"></i>
                <input
                  nz-input
                  type="password"
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  autocomplete="current-password"
                />
                <i
                  nz-icon
                  [nzType]="passwordVisible ? 'eye' : 'eye-invisible'"
                  class="toggle-password"
                  (click)="togglePasswordVisibility()"
                ></i>
              </div>
            </div>

            <div class="remember-me">
              <label nz-checkbox [(ngModel)]="rememberMe" name="rememberMe">
                <span>Remember me</span>
              </label>
            </div>

            <button
              nz-button
              nzType="primary"
              nzBlock
              [nzLoading]="isLoading"
              class="submit-btn"
            >
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>

            <div class="social-login">
              <span class="divider">OR</span>
              <div class="social-buttons">
                <button type="button" nz-button class="google-btn">
                  <i nz-icon nzType="google" nzTheme="outline"></i>
                  Continue with Google
                </button>
                <button type="button" nz-button class="facebook-btn">
                  <i nz-icon nzType="facebook" nzTheme="outline"></i>
                  Continue with Facebook
                </button>
              </div>
            </div>
          </form>

          <div class="auth-footer">
            <p>
              Don't have an account?
              <a [routerLink]="['/auth/register']" class="register-link">Create an account</a>
            </p>
          </div>
        </div>

        <div class="auth-promo">
          <div class="promo-content">
            <h2>Experience the magic of cinema</h2>
            <p>Sign in to enjoy exclusive benefits, book tickets online, and get personalized movie recommendations.</p>
            <ul class="benefits">
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Earn reward points with every booking</span>
              </li>
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Special offers and discounts</span>
              </li>
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Priority booking for premiere shows</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Page layout */
    .auth-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0c1119 0%, #1c1c1c 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
    }

    .auth-container {
      width: 100%;
      max-width: 1000px;
      display: flex;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      overflow: hidden;
      background-color: white;
    }

    /* Auth card (form side) */
    .auth-card {
      flex: 1;
      padding: 40px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .logo-icon {
      font-size: 28px;
      color: #ff4d4f;
      margin-right: 8px;
      filter: drop-shadow(0 0 5px rgba(255, 77, 79, 0.5));
    }

    .logo-text {
      color: #1c1c1c;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(90deg, #ff4d4f, #ff7875);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Auth header */
    .auth-header {
      margin-bottom: 32px;
    }

    .auth-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      color: #1c1c1c;
    }

    .auth-subtitle {
      color: #666;
      margin: 0;
      font-size: 15px;
    }

    /* Form styles */
    .auth-form {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .label-with-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .forgot-link {
      font-size: 13px;
      font-weight: 500;
      color: #ff4d4f;
      transition: color 0.2s;
    }

    .forgot-link:hover {
      color: #ff7875;
      text-decoration: underline;
    }

    .input-with-icon {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 16px;
    }

    .input-with-icon input {
      padding-left: 40px;
      height: 44px;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .input-with-icon input:focus {
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
      border-color: #ff4d4f;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 16px;
      cursor: pointer;
    }

    .remember-me {
      margin-bottom: 24px;
    }

    .submit-btn {
      height: 44px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 8px;
      background: linear-gradient(45deg, #ff4d4f, #ff7875);
      border: none;
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
      transition: all 0.3s;
    }

    .submit-btn:hover, .submit-btn:focus {
      background: linear-gradient(45deg, #ff7875, #ff4d4f);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 77, 79, 0.4);
    }

    /* Social login */
    .social-login {
      margin-top: 24px;
    }

    .divider {
      display: block;
      text-align: center;
      margin: 16px 0;
      color: #999;
      position: relative;
    }

    .divider::before, .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background-color: #eee;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .google-btn, .facebook-btn {
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .google-btn i, .facebook-btn i {
      margin-right: 8px;
    }

    /* Auth footer */
    .auth-footer {
      margin-top: auto;
      text-align: center;
      color: #666;
    }

    .register-link {
      color: #ff4d4f;
      font-weight: 500;
      transition: color 0.2s;
    }

    .register-link:hover {
      color: #ff7875;
      text-decoration: underline;
    }

    /* Promo section */
    .auth-promo {
      flex: 1;
      background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;
      overflow: hidden;
    }

    .auth-promo::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('https://images.unsplash.com/photo-1606112219348-204d7d8b94ee') center/cover;
      opacity: 0.2;
    }

    .promo-content {
      position: relative;
      z-index: 1;
    }

    .promo-content h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .promo-content p {
      font-size: 16px;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .benefits {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .benefits li {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .benefits li i {
      color: white;
      margin-right: 10px;
      font-size: 18px;
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
      .auth-promo {
        display: none;
      }
    }

    @media (max-width: 576px) {
      .auth-page {
        padding: 20px 10px;
      }

      .auth-card {
        padding: 30px 20px;
      }

      .auth-title {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  passwordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  login(): void {
    if (!this.email || !this.password) {
      this.message.error('Please enter both email and password');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.message.success('Login successful');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.message.error('Login failed: ' + (err.error?.message || 'Invalid credentials'));
        this.isLoading = false;
      }
    });
  }
}
