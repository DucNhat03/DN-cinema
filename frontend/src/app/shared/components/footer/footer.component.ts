import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { zorroModules } from '../../../core/zorro.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ...zorroModules
  ],
  template: `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-section about">
          <div class="logo-container">
            <i nz-icon nzType="play-circle" nzTheme="fill" class="logo-icon"></i>
            <h2 class="logo-text">DN Cinema</h2>
          </div>
          <p>Experience the magic of cinema with premium comfort and state-of-the-art technology. Your ultimate destination for entertainment.</p>
          <div class="social-icons">
            <a href="https://www.facebook.com/nhatnhatnheo.2" class="social-link" target="_blank" aria-label="Facebook">
              <i nz-icon nzType="facebook" nzTheme="fill"></i>
            </a>
            <a href="https://www.linkedin.com/in/ducnhatdev/" class="social-link" target="_blank" aria-label="Linkedin">
              <i nz-icon nzType="linkedin" nzTheme="fill"></i>
            </a>
            <a href="https://www.youtube.com/@nhat7112" class="social-link" target="_blank" aria-label="Youtube">
              <i nz-icon nzType="youtube" nzTheme="fill"></i>
            </a>
          </div>
        </div>

        <div class="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a [routerLink]="['/']">Home</a></li>
            <li><a [routerLink]="['/movies/now-playing']">Now Playing</a></li>
            <li><a [routerLink]="['/movies/upcoming']">Coming Soon</a></li>
            <li><a [routerLink]="['/movies/popular']">Popular Movies</a></li>
            <li><a [routerLink]="['/about']">About Us</a></li>
          </ul>
        </div>

        <div class="footer-section links">
          <h3>Information</h3>
          <ul>
            <li><a [routerLink]="['/terms']">Terms of Service</a></li>
            <li><a [routerLink]="['/privacy']">Privacy Policy</a></li>
            <li><a [routerLink]="['/faq']">FAQs</a></li>
            <li><a [routerLink]="['/help']">Help Center</a></li>
            <li><a [routerLink]="['/contact']">Contact Us</a></li>
          </ul>
        </div>

        <div class="footer-section contact">
          <h3>Contact Us</h3>
          <div class="contact-info">
            <div class="contact-item">
              <i nz-icon nzType="environment" nzTheme="outline"></i>
              <span>Thu Duc, TP HCM</span>
            </div>
            <div class="contact-item">
              <i nz-icon nzType="phone" nzTheme="outline"></i>
              <span>+84 386076296</span>
            </div>
            <div class="contact-item">
              <i nz-icon nzType="mail" nzTheme="outline"></i>
              <span>ducnhat0910&#64;gmail.com</span>
            </div>
          </div>
          <div class="newsletter">
            <h4>Subscribe to Our Newsletter</h4>
            <div class="newsletter-form">
              <input nz-input type="email" placeholder="Your Email Address">
              <button nz-button nzType="primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            &copy; {{currentYear}} Ducnhat Cinema. All Rights Reserved. Created with <i nz-icon nzType="heart" nzTheme="fill" class="heart-icon"></i> by Duc Nhat Cinema
          </div>
          <div class="payment-methods">
            <i nz-icon nzType="apple" nzTheme="outline"></i>
            <i nz-icon nzType="google" nzTheme="outline"></i>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background-color: #0c1119;
      color: #e4e4e4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      padding: 60px 24px 40px;
    }

    .footer-section h3 {
      color: white;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      position: relative;
      padding-bottom: 10px;
    }

    .footer-section h3::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: #ff4d4f;
    }

    /* About section */
    .about {
      grid-column: span 1;
    }

    .logo-container {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .logo-icon {
      font-size: 32px;
      color: #ff4d4f;
      margin-right: 8px;
    }

    .logo-text {
      color: white;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(90deg, #ff4d4f, #ff7875);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .about p {
      margin-bottom: 20px;
      line-height: 1.6;
      color: #a0a0a0;
    }

    .social-icons {
      display: flex;
      gap: 15px;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background-color: #ff4d4f;
      transform: translateY(-3px);
    }

    /* Links section */
    .links {
      grid-column: span 1;
    }

    .links ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .links li {
      margin-bottom: 12px;
    }

    .links a {
      color: #a0a0a0;
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
      padding-left: 15px;
    }

    .links a::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ff4d4f;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .links a:hover {
      color: white;
      padding-left: 18px;
    }

    .links a:hover::before {
      opacity: 1;
    }

    /* Contact section */
    .contact {
      grid-column: span 1;
    }

    .contact-info {
      margin-bottom: 20px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      color: #a0a0a0;
    }

    .contact-item i {
      margin-right: 10px;
      color: #ff4d4f;
      font-size: 16px;
      margin-top: 3px;
      cursor: pointer;
    }

    .newsletter h4 {
      color: white;
      font-size: 16px;
      margin-bottom: 15px;
    }

    .newsletter-form {
      display: flex;
    }

    .newsletter-form input {
      flex: 1;
      border-radius: 4px 0 0 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .newsletter-form button {
      border-radius: 0 4px 4px 0;
      background-color: #ff4d4f;
      border-color: #ff4d4f;
    }

    .newsletter-form button:hover {
      background-color: #ff7875;
      border-color: #ff7875;
    }

    /* Footer bottom */
    .footer-bottom {
      background-color: #070c13;
      padding: 20px 0;
    }

    .footer-bottom-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .copyright {
      color: #a0a0a0;
      font-size: 14px;
    }

    .heart-icon {
      color: #ff4d4f;
      margin: 0 3px;
    }

    .payment-methods {
      display: flex;
      gap: 15px;
    }

    .payment-methods i {
      font-size: 24px;
      color: #a0a0a0;
      transition: color 0.3s ease;
      cursor: pointer;
    }

    .payment-methods i:hover {
      color: white;
    }

    /* Responsive styles */
    @media screen and (max-width: 992px) {
      .footer-content {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media screen and (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .footer-bottom-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}
