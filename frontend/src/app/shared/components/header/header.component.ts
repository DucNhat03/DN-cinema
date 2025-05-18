import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../models/user.model';
import { zorroModules } from '../../../core/zorro.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ...zorroModules
  ],
  template: `
    <div class="header-container" [class.scrolled]="scrolled">
      <div class="header">
        <div class="logo">
          <a [routerLink]="['/']" class="logo-link">
            <i nz-icon nzType="play-circle" nzTheme="fill" class="logo-icon"></i>
            <span class="logo-text">DN Cinema</span>
          </a>
        </div>

        <div class="nav-menu">
          <a [routerLink]="['/']" class="nav-item">
            <i nz-icon nzType="home"></i>
            <span>Home</span>
          </a>
          <a [routerLink]="['/movies/popular']" class="nav-item">
            <i nz-icon nzType="fire"></i>
            <span>Popular</span>
          </a>
          <a [routerLink]="['/movies/top-rated']" class="nav-item">
            <i nz-icon nzType="trophy"></i>
            <span>Top Rated</span>
          </a>
          <a [routerLink]="['/movies/now-playing']" class="nav-item">
            <i nz-icon nzType="calendar"></i>
            <span>Now Playing</span>
          </a>
          <a [routerLink]="['/movies/upcoming']" class="nav-item">
            <i nz-icon nzType="rocket"></i>
            <span>Upcoming</span>
          </a>
        </div>

        <div class="user-section">
          <div class="search-box">
            <input
              type="text"
              placeholder="Search movies..."
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()"
            >
            <button (click)="search()" class="search-btn">
              <i nz-icon nzType="search"></i>
            </button>
          </div>

          <ng-container *ngIf="!currentUser; else userLoggedIn">
            <div class="auth-buttons">
              <a [routerLink]="['/auth/login']" class="btn login-btn">
                <i nz-icon nzType="login"></i>
                <span>Login</span>
              </a>
              <a [routerLink]="['/auth/register']" class="btn register-btn">
                <i nz-icon nzType="user-add"></i>
                <span>Register</span>
              </a>
            </div>
          </ng-container>

          <ng-template #userLoggedIn>
            <div class="user-profile" nz-dropdown [nzDropdownMenu]="userMenu">
              <nz-avatar [nzSrc]="currentUser?.avatar || 'assets/images/avatar.png'" nzSize="default"></nz-avatar>
              <span class="username">{{ currentUser?.name }}</span>
              <i nz-icon nzType="down"></i>
            </div>
            <nz-dropdown-menu #userMenu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item>
                  <a [routerLink]="['/profile']">
                    <i nz-icon nzType="user" class="icon-spacing"></i>My Profile
                  </a>
                </li>
                <li nz-menu-item>
                  <a [routerLink]="['/profile/watchlist']">
                    <i nz-icon nzType="heart" class="icon-spacing"></i>My Watchlist
                  </a>
                </li>
                <li nz-menu-item>
                  <a [routerLink]="['/profile/reviews']">
                    <i nz-icon nzType="comment" class="icon-spacing"></i>My Reviews
                  </a>
                </li>
                <li nz-menu-divider></li>
                <li nz-menu-item (click)="logout()">
                  <i nz-icon nzType="logout" class="icon-spacing"></i>Logout
                </li>
              </ul>
            </nz-dropdown-menu>
          </ng-template>

          <button *ngIf="isPlatformBrowser" class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <i nz-icon [nzType]="mobileMenuVisible ? 'close' : 'menu'"></i>
          </button>
        </div>
      </div>

      <div class="mobile-nav" *ngIf="mobileMenuVisible">
        <a [routerLink]="['/']" class="mobile-nav-item" (click)="mobileMenuVisible = false">
          <i nz-icon nzType="home"></i>
          <span>Home</span>
        </a>
        <a [routerLink]="['/movies/popular']" class="mobile-nav-item" (click)="mobileMenuVisible = false">
          <i nz-icon nzType="fire"></i>
          <span>Popular</span>
        </a>
        <a [routerLink]="['/movies/top-rated']" class="mobile-nav-item" (click)="mobileMenuVisible = false">
          <i nz-icon nzType="trophy"></i>
          <span>Top Rated</span>
        </a>
        <a [routerLink]="['/movies/now-playing']" class="mobile-nav-item" (click)="mobileMenuVisible = false">
          <i nz-icon nzType="calendar"></i>
          <span>Now Playing</span>
        </a>
        <a [routerLink]="['/movies/upcoming']" class="mobile-nav-item" (click)="mobileMenuVisible = false">
          <i nz-icon nzType="rocket"></i>
          <span>Upcoming</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    /* Container styles */
    .header-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: #1c1c1c;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }

    .scrolled {
      background-color: rgba(18, 18, 18, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    /* Main header layout */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      height: 60px;
    }

    /* Logo styles */
    .logo {
      display: flex;
      align-items: center;
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .logo-icon {
      font-size: 24px;
      color: #ff4d4f;
      margin-right: 8px;
      filter: drop-shadow(0 0 5px rgba(255, 77, 79, 0.5));
    }

    .logo-text {
      color: white;
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(90deg, #ff4d4f, #ff7875);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Navigation menu */
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #e0e0e0;
      text-decoration: none;
      padding: 0 10px;
      font-weight: 500;
      height: 60px;
      line-height: 60px;
      position: relative;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      color: #ff7875;
    }

    .nav-item::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background-color: #ff4d4f;
      transition: width 0.3s ease;
    }

    .nav-item:hover::after {
      width: 70%;
    }

    /* User section styles */
    .user-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    /* Search box */
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box input {
      width: 180px;
      height: 32px;
      padding: 0 35px 0 15px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.2);
      background-color: rgba(255,255,255,0.1);
      color: white;
      outline: none;
      transition: all 0.3s;
    }

    .search-box input:focus {
      width: 200px;
      border-color: #ff4d4f;
      background-color: rgba(255,255,255,0.15);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
    }

    .search-box input::placeholder {
      color: rgba(255,255,255,0.6);
    }

    .search-btn {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .search-btn:hover {
      color: #ff4d4f;
      background-color: rgba(255,255,255,0.1);
    }

    /* Auth buttons */
    .auth-buttons {
      display: flex;
      gap: 10px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 12px;
      height: 32px;
      border-radius: 16px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }

    .login-btn {
      background: linear-gradient(45deg, #ff4d4f, #ff7875);
      color: white;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255, 77, 79, 0.4);
    }

    .register-btn {
      background-color: transparent;
      border: 1px solid rgba(255,255,255,0.3);
      color: #e0e0e0;
    }

    .register-btn:hover {
      border-color: white;
      background-color: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }

    /* User profile dropdown */
    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 16px;
      background-color: rgba(255,255,255,0.1);
      transition: all 0.2s;
    }

    .user-profile:hover {
      background-color: rgba(255,255,255,0.15);
    }

    .username {
      color: white;
      font-weight: 500;
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Mobile menu button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.1);
    }

    .icon-spacing {
       margin-right: 8px;
    }

    /* Mobile navigation */
    .mobile-nav {
      display: none;
      flex-direction: column;
      background-color: #1c1c1c;
      padding: 10px 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      color: #e0e0e0;
      text-decoration: none;
      transition: background-color 0.2s;
    }

    .mobile-nav-item:hover {
      background-color: rgba(255,255,255,0.05);
      color: #ff7875;
    }

    /* Media queries */
    @media (max-width: 992px) {
      .nav-item span {
        display: none;
      }

      .nav-item {
        padding: 0 8px;
      }

      .search-box input {
        width: 150px;
      }

      .search-box input:focus {
        width: 170px;
      }
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }

      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mobile-nav {
        display: flex;
      }

      .login-btn span, .register-btn span {
        display: none;
      }

      .btn {
        width: 32px;
        height: 32px;
        padding: 0;
        justify-content: center;
      }

      .search-box input {
        width: 120px;
      }

      .search-box input:focus {
        width: 140px;
      }
    }

    @media (max-width: 480px) {
      .header {
        padding: 0 10px;
      }

      .search-box input {
        width: 100px;
      }

      .search-box input:focus {
        width: 100px;
      }

      .auth-buttons {
        gap: 5px;
      }

      .logo-text {
        display: none;
      }

      .user-profile .username {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  currentUser: User | null = null;
  scrolled: boolean = false;
  isMobile: boolean = false;
  mobileMenuVisible: boolean = false;
  isPlatformBrowser: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    if (this.isPlatformBrowser) {
      this.checkScreenSize();
    }
  }

  ngOnDestroy(): void {
    // No event listeners to clean up since we're using HostListener
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isPlatformBrowser) {
      this.scrolled = window.scrollY > 20;
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isPlatformBrowser) {
      this.checkScreenSize();
    }
  }

  checkScreenSize(): void {
    if (this.isPlatformBrowser) {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.mobileMenuVisible = false;
      }
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }

  search(): void {
    if (this.searchQuery?.trim()) {
      this.router.navigate(['/movies/search'], { queryParams: { query: this.searchQuery } });
      this.mobileMenuVisible = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.mobileMenuVisible = false;
  }
}
