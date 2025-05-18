import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { zorroModules } from '../../core/zorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register',
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
            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Join us for the best cinema experience</p>
          </div>

          <form class="auth-form" (ngSubmit)="register()">
            <div class="form-group">
              <label for="name">Full Name</label>
              <div class="input-with-icon">
                <i nz-icon nzType="user" class="input-icon"></i>
                <input
                  nz-input
                  type="text"
                  id="name"
                  [(ngModel)]="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  autocomplete="name"
                />
              </div>
            </div>

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
              <label for="password">Password</label>
              <div class="input-with-icon">
                <i nz-icon nzType="lock" class="input-icon"></i>
                <input
                  nz-input
                  [type]="passwordVisible ? 'text' : 'password'"
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Create a password"
                  required
                  autocomplete="new-password"
                />
                <i
                  nz-icon
                  [nzType]="passwordVisible ? 'eye' : 'eye-invisible'"
                  class="toggle-password"
                  (click)="togglePasswordVisibility('password')"
                ></i>
              </div>
              <div class="password-strength" *ngIf="password">
                <div class="strength-meter">
                  <div class="strength-bar" [ngStyle]="{ 'width': getPasswordStrength() + '%', 'background-color': getPasswordStrengthColor() }"></div>
                </div>
                <span class="strength-text" [ngStyle]="{ 'color': getPasswordStrengthColor() }">
                  {{ getPasswordStrengthText() }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="input-with-icon">
                <i nz-icon nzType="safety" class="input-icon"></i>
                <input
                  nz-input
                  [type]="confirmPasswordVisible ? 'text' : 'password'"
                  id="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  autocomplete="new-password"
                />
                <i
                  nz-icon
                  [nzType]="confirmPasswordVisible ? 'eye' : 'eye-invisible'"
                  class="toggle-password"
                  (click)="togglePasswordVisibility('confirm')"
                ></i>
              </div>
              <div class="password-match" *ngIf="confirmPassword">
                <i nz-icon [nzType]="passwordsMatch() ? 'check-circle' : 'close-circle'"
                  [ngClass]="passwordsMatch() ? 'match' : 'no-match'"></i>
                <span [ngClass]="passwordsMatch() ? 'match' : 'no-match'">
                  {{ passwordsMatch() ? 'Passwords match' : 'Passwords do not match' }}
                </span>
              </div>
            </div>

            <div class="terms-agreement">
              <label nz-checkbox [(ngModel)]="agreeTerms" name="agreeTerms">
                <span>
                  I agree to the
                  <a [routerLink]="['/terms']" target="_blank">Terms of Service</a>
                  and
                  <a [routerLink]="['/privacy']" target="_blank">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              nz-button
              nzType="primary"
              nzBlock
              [nzLoading]="isLoading"
              [disabled]="!agreeTerms || !passwordsMatch() || isPasswordWeak()"
              class="submit-btn"
            >
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>

            <div class="social-login">
              <span class="divider">OR</span>
              <div class="social-buttons">
                <button type="button" nz-button class="google-btn">
                  <i nz-icon nzType="google" nzTheme="outline"></i>
                  Sign up with Google
                </button>
                <button type="button" nz-button class="facebook-btn">
                  <i nz-icon nzType="facebook" nzTheme="outline"></i>
                  Sign up with Facebook
                </button>
              </div>
            </div>
          </form>

          <div class="auth-footer">
            <p>
              Already have an account?
              <a [routerLink]="['/auth/login']" class="login-link">Sign in instead</a>
            </p>
          </div>
        </div>

        <div class="auth-promo">
          <div class="promo-content">
            <h2>Join our cinema community</h2>
            <p>Create an account to unlock exclusive membership benefits and enhanced movie experiences.</p>
            <ul class="benefits">
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Early access to blockbuster releases</span>
              </li>
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Member-only discounts and offers</span>
              </li>
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Personalized movie recommendations</span>
              </li>
              <li>
                <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                <span>Save favorite theaters and seating preferences</span>
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
      margin-top: 44px;
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

    /* Password strength meter */
    .password-strength {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .strength-meter {
      flex: 1;
      height: 6px;
      background-color: #eee;
      border-radius: 3px;
      overflow: hidden;
    }

    .strength-bar {
      height: 100%;
      transition: all 0.3s;
    }

    .strength-text {
      font-size: 12px;
      font-weight: 500;
    }

    /* Password match indicator */
    .password-match {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .match {
      color: #52c41a;
    }

    .no-match {
      color: #ff4d4f;
    }

    /* Terms agreement */
    .terms-agreement {
      margin-bottom: 24px;
    }

    .terms-agreement a {
      color: #ff4d4f;
      text-decoration: none;
    }

    .terms-agreement a:hover {
      text-decoration: underline;
    }

    /* Submit button */
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

    .submit-btn[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
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

    .login-link {
      color: #ff4d4f;
      font-weight: 500;
      transition: color 0.2s;
    }

    .login-link:hover {
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
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  agreeTerms: boolean = false;
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.type = this.passwordVisible ? 'text' : 'password';
      }
    } else if (field === 'confirm') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
      const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
      if (confirmPasswordInput) {
        confirmPasswordInput.type = this.confirmPasswordVisible ? 'text' : 'password';
      }
    }
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.password !== '';
  }

  getPasswordStrength(): number {
    if (!this.password) return 0;

    let strength = 0;

    // Length check
    if (this.password.length >= 8) strength += 25;

    // Contains lowercase
    if (/[a-z]/.test(this.password)) strength += 25;

    // Contains uppercase
    if (/[A-Z]/.test(this.password)) strength += 25;

    // Contains number or special char
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(this.password)) strength += 25;

    return strength;
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return '#f5222d';
    if (strength < 75) return '#faad14';
    return '#52c41a';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    if (strength < 100) return 'Strong';
    return 'Very Strong';
  }

  isPasswordWeak(): boolean {
    return this.password !== '' && this.getPasswordStrength() < 50;
  }

  register(): void {
    if (!this.name || !this.email || !this.password) {
      this.message.error('Please fill in all required fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.message.error('Passwords do not match');
      return;
    }

    if (this.isPasswordWeak()) {
      this.message.error('Please choose a stronger password');
      return;
    }

    if (!this.agreeTerms) {
      this.message.error('Please agree to the terms and conditions');
      return;
    }

    this.isLoading = true;
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.message.success('Registration successful. Please check your email to verify your account.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.message.error('Registration failed: ' + (err.error?.message || 'An error occurred'));
        this.isLoading = false;
      }
    });
  }
}
