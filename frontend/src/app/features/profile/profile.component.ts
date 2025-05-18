import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/models/user.model';
// Import all Zorro modules directly
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzProgressModule, NzProgressStatusType } from 'ng-zorro-antd/progress';
import { zorroTabsProviders } from '../../core/zorro.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // List all Zorro modules directly
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzDropDownModule,
    NzAvatarModule,
    NzCardModule,
    NzTagModule,
    NzRateModule,
    NzTabsModule,
    NzCommentModule,
    NzEmptyModule,
    NzSpinModule,
    NzFormModule,
    NzCheckboxModule,
    NzMessageModule,
    NzUploadModule,
    NzProgressModule
  ],
  providers: [
    ...zorroTabsProviders
  ],
  template: `
    <div class="profile-page">
      <div class="profile-container">
        <div *ngIf="!user" class="loading">
          <nz-spin nzTip="Loading your profile...">
            <div class="loading-content">
              <i nz-icon nzType="loading" class="loading-icon"></i>
            </div>
          </nz-spin>
        </div>

        <ng-container *ngIf="user">
          <!-- Profile Header Card -->
          <div class="profile-header-card">
            <div class="profile-background"></div>
            <div class="profile-header-content">
              <div class="avatar-section">
                <div class="avatar-container">
                  <nz-avatar [nzSize]="120" [nzSrc]="user.avatar || 'assets/images/avatar.png'" class="profile-avatar"></nz-avatar>
                  <div class="avatar-edit" (click)="avatarFileInput.click()">
                    <i nz-icon nzType="camera" nzTheme="outline"></i>
                  </div>
                  <input #avatarFileInput type="file" accept="image/*" (change)="onFileSelected($event)" style="display: none;" />
                </div>
              </div>
              <div class="user-info">
                <h1 class="user-name">{{ user.name }}</h1>
                <div class="user-details">
                  <div class="detail-item">
                    <i nz-icon nzType="mail" nzTheme="outline"></i>
                    <span>{{ user.email }}</span>
                  </div>
                  <div class="detail-item">
                    <i nz-icon nzType="calendar" nzTheme="outline"></i>
                    <span>Member since {{ formatDate(user.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs Section -->
          <nz-card class="profile-tabs-card">
            <nz-tabset class="profile-tabs" [nzTabPosition]="'top'" [nzType]="'card'">
              <!-- Profile Information Tab -->
              <nz-tab nzTitle="Profile Information">
                <form (ngSubmit)="updateProfile()" class="profile-form">
                  <div class="form-section">
                    <h2 class="section-title">Personal Information</h2>
                    <div class="form-group">
                      <label for="name">Full Name</label>
                      <nz-input-group [nzPrefix]="prefixUser">
                        <input nz-input type="text" id="name" [(ngModel)]="profileName" name="name" placeholder="Your full name" required />
                      </nz-input-group>
                      <ng-template #prefixUser><i nz-icon nzType="user" nzTheme="outline"></i></ng-template>
                    </div>

                    <div class="form-group">
                      <label>Email Address</label>
                      <nz-input-group [nzPrefix]="prefixMail" [nzSuffix]="suffixVerified">
                        <input nz-input type="email" [value]="user.email" disabled />
                      </nz-input-group>
                      <ng-template #prefixMail><i nz-icon nzType="mail" nzTheme="outline"></i></ng-template>
                      <ng-template #suffixVerified>
                        <i nz-icon nzType="check-circle" nzTheme="twotone" nzTwotoneColor="#52c41a"
                           nz-tooltip nzTooltipTitle="Verified"></i>
                      </ng-template>
                    </div>
                  </div>

                  <div class="form-section">
                    <h2 class="section-title">Profile Picture</h2>
                    <div class="avatar-uploader">
                      <div class="preview">
                        <img [src]="avatarPreview || user.avatar || 'assets/images/avatar.png'" alt="Avatar Preview" />
                        <div class="avatar-overlay" (click)="avatarFileInput.click()">
                          <i nz-icon nzType="camera" nzTheme="outline"></i>
                          <span>Change Photo</span>
                        </div>
                      </div>
                      <div class="avatar-info">
                        <p class="avatar-help">Upload a new profile picture. JPG, PNG or GIF, max 2MB.</p>
                        <div class="avatar-actions">
                          <button nz-button nzType="primary" (click)="avatarFileInput.click()" [disabled]="isUpdating">
                            <i nz-icon nzType="upload"></i>Upload New Image
                          </button>
                          <button *ngIf="avatarPreview" nz-button nzType="default" (click)="cancelAvatarUpdate()" [disabled]="isUpdating">
                            <i nz-icon nzType="close"></i>Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-section">
                    <h2 class="section-title">Preferences</h2>
                    <div class="preferences-group">
                      <label nz-checkbox [(ngModel)]="emailNotifications" name="emailNotifications">
                        <span>Email notifications for new releases and promotions</span>
                      </label>
                      <label nz-checkbox [(ngModel)]="smsNotifications" name="smsNotifications">
                        <span>SMS notifications for ticket confirmations</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button nz-button nzType="default" class="cancel-btn" (click)="resetForm()">
                      <i nz-icon nzType="close"></i>Cancel
                    </button>
                    <button nz-button nzType="primary" [disabled]="isUpdating" class="update-btn" [nzLoading]="isUpdating">
                      <i nz-icon nzType="save"></i>{{ isUpdating ? 'Saving Changes...' : 'Save Changes' }}
                    </button>
                  </div>
                </form>
              </nz-tab>

              <!-- Security Tab -->
              <nz-tab nzTitle="Security Settings">
                <div class="password-section">
                  <h2 class="section-title">Password & Security</h2>
                  <form (ngSubmit)="changePassword()" class="password-form">
                    <div class="form-group">
                      <label for="currentPassword">Current Password</label>
                      <nz-input-group [nzPrefix]="prefixLock" [nzSuffix]="suffixEye1">
                        <input nz-input [type]="showCurrentPassword ? 'text' : 'password'"
                               id="currentPassword"
                               [(ngModel)]="currentPassword"
                               name="currentPassword"
                               placeholder="Enter your current password"
                               required />
                      </nz-input-group>
                      <ng-template #prefixLock><i nz-icon nzType="lock" nzTheme="outline"></i></ng-template>
                      <ng-template #suffixEye1>
                        <i nz-icon
                           [nzType]="showCurrentPassword ? 'eye' : 'eye-invisible'"
                           nzTheme="outline"
                           (click)="showCurrentPassword = !showCurrentPassword"
                           class="clickable-icon">
                        </i>
                      </ng-template>
                    </div>

                    <div class="form-group">
                      <label for="newPassword">New Password</label>
                      <nz-input-group [nzPrefix]="prefixKey" [nzSuffix]="suffixEye2">
                        <input nz-input [type]="showNewPassword ? 'text' : 'password'"
                               id="newPassword"
                               [(ngModel)]="newPassword"
                               name="newPassword"
                               placeholder="Create new password"
                               required />
                      </nz-input-group>
                      <ng-template #prefixKey><i nz-icon nzType="key" nzTheme="outline"></i></ng-template>
                      <ng-template #suffixEye2>
                        <i nz-icon
                           [nzType]="showNewPassword ? 'eye' : 'eye-invisible'"
                           nzTheme="outline"
                           (click)="showNewPassword = !showNewPassword"
                           class="clickable-icon">
                        </i>
                      </ng-template>

                      <div *ngIf="newPassword" class="password-strength">
                        <nz-progress
                          [nzPercent]="passwordStrength"
                          [nzStatus]="passwordStrengthStatus"
                          [nzShowInfo]="false"
                          [nzStrokeWidth]="6">
                        </nz-progress>
                        <span class="strength-text" [ngClass]="passwordStrengthClass">
                          {{ passwordStrengthText }}
                        </span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="confirmPassword">Confirm New Password</label>
                      <nz-input-group [nzPrefix]="prefixCheck" [nzSuffix]="suffixEye3">
                        <input nz-input [type]="showConfirmPassword ? 'text' : 'password'"
                               id="confirmPassword"
                               [(ngModel)]="confirmPassword"
                               name="confirmPassword"
                               placeholder="Confirm your new password"
                               required />
                      </nz-input-group>
                      <ng-template #prefixCheck><i nz-icon nzType="check-circle" nzTheme="outline"></i></ng-template>
                      <ng-template #suffixEye3>
                        <i nz-icon
                           [nzType]="showConfirmPassword ? 'eye' : 'eye-invisible'"
                           nzTheme="outline"
                           (click)="showConfirmPassword = !showConfirmPassword"
                           class="clickable-icon">
                        </i>
                      </ng-template>

                      <div *ngIf="confirmPassword" class="password-match-indicator">
                        <ng-container *ngIf="passwordsMatch(); else passwordsDontMatch">
                          <i nz-icon nzType="check-circle" nzTheme="twotone" nzTwotoneColor="#52c41a"></i>
                          <span class="match-text success">Passwords match</span>
                        </ng-container>
                        <ng-template #passwordsDontMatch>
                          <i nz-icon nzType="close-circle" nzTheme="twotone" nzTwotoneColor="#ff4d4f"></i>
                          <span class="match-text error">Passwords don't match</span>
                        </ng-template>
                      </div>
                    </div>

                    <div class="password-requirements">
                      <div class="requirements-header">Password must contain:</div>
                      <ul>
                        <li [class.met]="hasMinLength()"><i nz-icon [nzType]="hasMinLength() ? 'check' : 'close'" nzTheme="outline"></i> At least 8 characters</li>
                        <li [class.met]="hasUpperCase()"><i nz-icon [nzType]="hasUpperCase() ? 'check' : 'close'" nzTheme="outline"></i> At least one uppercase letter</li>
                        <li [class.met]="hasLowerCase()"><i nz-icon [nzType]="hasLowerCase() ? 'check' : 'close'" nzTheme="outline"></i> At least one lowercase letter</li>
                        <li [class.met]="hasNumber()"><i nz-icon [nzType]="hasNumber() ? 'check' : 'close'" nzTheme="outline"></i> At least one number</li>
                      </ul>
                    </div>

                    <div class="form-actions">
                      <button type="button" nz-button nzType="default" class="cancel-btn" (click)="resetPasswordForm()">
                        <i nz-icon nzType="close"></i>Cancel
                      </button>
                      <button nz-button nzType="primary"
                              [disabled]="isChangingPassword || !isValidPasswordChange()"
                              class="update-btn"
                              [nzLoading]="isChangingPassword">
                        <i nz-icon nzType="lock"></i>{{ isChangingPassword ? 'Updating Password...' : 'Update Password' }}
                      </button>
                    </div>
                  </form>
                </div>

                <div class="account-security">
                  <h2 class="section-title">Account Security</h2>

                  <div class="security-item">
                    <div class="security-info">
                      <i nz-icon nzType="safety-certificate" class="security-icon"></i>
                      <div class="security-details">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <nz-switch [(ngModel)]="twoFactorEnabled"></nz-switch>
                  </div>

                  <div class="security-item">
                    <div class="security-info">
                      <i nz-icon nzType="login" class="security-icon"></i>
                      <div class="security-details">
                        <h4>Recent Login Activity</h4>
                        <p>View your recent login history</p>
                      </div>
                    </div>
                    <button nz-button nzType="default">View Activity</button>
                  </div>

                  <div class="security-item danger">
                    <div class="security-info">
                      <i nz-icon nzType="delete" class="security-icon"></i>
                      <div class="security-details">
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button nz-button nzType="default" nzDanger>Delete Account</button>
                  </div>
                </div>
              </nz-tab>

              <!-- Activity Tab -->
              <nz-tab nzTitle="Activity">
                <div class="activity-container">
                  <h2 class="section-title">Recent Activity</h2>

                  <div class="activity-tabs">
                    <nz-tabset nzSize="small">
                      <nz-tab nzTitle="All Activity">
                        <div class="activity-timeline">
                          <div class="timeline-item">
                            <div class="timeline-icon ticket">
                              <i nz-icon nzType="ticket" nzTheme="outline"></i>
                            </div>
                            <div class="timeline-content">
                              <div class="timeline-date">May 16, 2025</div>
                              <div class="timeline-title">Purchased 2 tickets for "Marvel Movie"</div>
                              <div class="timeline-details">Cinema: DN Cinema Central • Time: 7:30 PM</div>
                            </div>
                          </div>

                          <div class="timeline-item">
                            <div class="timeline-icon review">
                              <i nz-icon nzType="star" nzTheme="outline"></i>
                            </div>
                            <div class="timeline-content">
                              <div class="timeline-date">May 12, 2025</div>
                              <div class="timeline-title">Reviewed "Action Movie"</div>
                              <div class="timeline-details">
                                Rating:
                                <nz-rate [ngModel]="4" nzDisabled [nzCount]="5"></nz-rate>
                              </div>
                            </div>
                          </div>

                          <div class="timeline-item">
                            <div class="timeline-icon watchlist">
                              <i nz-icon nzType="heart" nzTheme="outline"></i>
                            </div>
                            <div class="timeline-content">
                              <div class="timeline-date">May 10, 2025</div>
                              <div class="timeline-title">Added "Comedy Film" to watchlist</div>
                            </div>
                          </div>

                          <div class="timeline-item">
                            <div class="timeline-icon profile">
                              <i nz-icon nzType="user" nzTheme="outline"></i>
                            </div>
                            <div class="timeline-content">
                              <div class="timeline-date">May 8, 2025</div>
                              <div class="timeline-title">Updated profile information</div>
                            </div>
                          </div>
                        </div>
                      </nz-tab>

                      <nz-tab nzTitle="Purchases">
                        <div class="activity-list">
                          <div class="activity-item">
                            <div class="activity-poster">
                              <img src="assets/images/placeholder-poster.jpg" alt="Movie poster">
                            </div>
                            <div class="activity-details">
                              <h4>Marvel Movie</h4>
                              <div class="activity-meta">
                                <span><i nz-icon nzType="calendar"></i> May 16, 2025</span>
                                <span><i nz-icon nzType="clock-circle"></i> 7:30 PM</span>
                                <span><i nz-icon nzType="environment"></i> DN Cinema Central</span>
                              </div>
                              <div class="activity-info">
                                <span class="seats">2 tickets • Seats: F5, F6</span>
                                <span class="price">$25.00</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </nz-tab>

                      <nz-tab nzTitle="Reviews">
                        <div class="activity-list">
                          <div class="activity-item">
                            <div class="activity-poster">
                              <img src="assets/images/placeholder-poster.jpg" alt="Movie poster">
                            </div>
                            <div class="activity-details">
                              <h4>Action Movie</h4>
                              <div class="activity-meta">
                                <span><i nz-icon nzType="calendar"></i> May 12, 2025</span>
                                <nz-rate [ngModel]="4" nzDisabled [nzCount]="5"></nz-rate>
                              </div>
                              <div class="activity-review">
                                "This movie was amazing! Great action sequences and impressive special effects."
                              </div>
                            </div>
                          </div>
                        </div>
                      </nz-tab>

                      <nz-tab nzTitle="Watchlist">
                        <div class="activity-grid">
                          <div class="watchlist-item">
                            <div class="watchlist-poster">
                              <img src="assets/images/placeholder-poster.jpg" alt="Movie poster">
                              <div class="watchlist-overlay">
                                <button nz-button nzType="primary" nzShape="circle">
                                  <i nz-icon nzType="eye"></i>
                                </button>
                                <button nz-button nzType="default" nzShape="circle" nzDanger>
                                  <i nz-icon nzType="delete"></i>
                                </button>
                              </div>
                            </div>
                            <h5>Comedy Film</h5>
                            <div class="watchlist-meta">
                              <span>2025</span> •
                              <span>Comedy</span>
                            </div>
                          </div>
                        </div>
                      </nz-tab>
                    </nz-tabset>
                  </div>
                </div>
              </nz-tab>
            </nz-tabset>
          </nz-card>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding-top: 80px;
      padding-bottom: 40px;
    }

    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }

    .loading-content {
      text-align: center;
    }

    .loading-icon {
      font-size: 48px;
      color: #ff4d4f;
    }

    /* Profile Header Card */
    .profile-header-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }

    .profile-background {
      height: 180px;
      background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
      position: relative;
    }

    .profile-header-content {
      display: flex;
      padding: 0 32px 24px;
      position: relative;
    }

    .avatar-section {
      margin-top: -60px;
      margin-right: 32px;
      position: relative;
    }

    .avatar-container {
      position: relative;
    }

    .profile-avatar {
      border: 5px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .avatar-edit {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 40px;
      height: 40px;
      background-color: #ff4d4f;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;
    }

    .avatar-edit:hover {
      background-color: #ff7875;
      transform: scale(1.1);
    }

    .user-info {
      padding-top: 70px;
    }

    .user-name {
      margin: 0 0 16px 0;
      font-size: 28px;
      font-weight: 700;
      color: #262626;
    }

    .user-details {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      color: rgba(0, 0, 0, 0.65);
      font-size: 16px;
    }

    .detail-item i {
      margin-right: 8px;
      color: #ff4d4f;
    }

    /* Tabs Card */
    .profile-tabs-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    /* Form Section */
    .form-section {
      margin-bottom: 40px;
      padding-bottom: 32px;
      border-bottom: 1px solid #f0f0f0;
    }

    .form-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 24px;
      position: relative;
    }

    .section-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -8px;
      width: 40px;
      height: 3px;
      background-color: #ff4d4f;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #262626;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
    }

    .update-btn, .cancel-btn {
      min-width: 120px;
    }

    .update-btn {
      background: linear-gradient(45deg, #ff4d4f, #ff7875);
      border-color: #ff4d4f;
    }

    .update-btn i, .cancel-btn i {
      margin-right: 8px;
    }

    /* Avatar uploader */
    .avatar-uploader {
      display: flex;
      align-items: flex-start;
      gap: 24px;
    }

    .preview {
      width: 120px;
      height: 120px;
      overflow: hidden;
      border-radius: 50%;
      position: relative;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }

    .preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .avatar-overlay i {
      color: white;
      font-size: 24px;
      margin-bottom: 8px;
    }

    .avatar-overlay span {
      color: white;
      font-size: 12px;
      font-weight: 500;
    }

    .preview:hover .avatar-overlay {
      opacity: 1;
    }

    .avatar-info {
      flex: 1;
    }

    .avatar-help {
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 16px;
      font-size: 14px;
    }

    .avatar-actions {
      display: flex;
      gap: 12px;
    }

    /* Preferences group */
    .preferences-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Password strength */
    .password-strength {
      margin-top: 12px;
    }

    .strength-text {
      font-size: 12px;
      font-weight: 500;
      margin-top: 4px;
      display: inline-block;
    }

    .strength-weak {
      color: #ff4d4f;
    }

    .strength-medium {
      color: #faad14;
    }

    .strength-strong {
      color: #52c41a;
    }

    /* Password match indicator */
    .password-match-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 12px;
      font-weight: 500;
    }

    .match-text.success {
      color: #52c41a;
    }

    .match-text.error {
      color: #ff4d4f;
    }

    /* Password requirements */
    .password-requirements {
      margin-top: 24px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .requirements-header {
      font-weight: 500;
      margin-bottom: 8px;
      color: #262626;
    }

    .password-requirements ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .password-requirements li {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0, 0, 0, 0.65);
    }

    .password-requirements li i {
      color: #bfbfbf;
    }

    .password-requirements li.met i {
      color: #52c41a;
    }

    /* Eye icon for password visibility */
    .clickable-icon {
      cursor: pointer;
    }

    /* Account security section */
    .account-security {
      margin-top: 40px;
    }

    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .security-item:last-child {
      border-bottom: none;
    }

    .security-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .security-icon {
      font-size: 24px;
      color: #ff4d4f;
    }

    .security-details h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
      color: #262626;
    }

    .security-details p {
      margin: 0;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }

    .security-item.danger .security-icon {
      color: #ff4d4f;
    }

    /* Activity Timeline */
    .activity-container {
      padding: 0 8px;
    }

    .activity-timeline {
      margin-top: 24px;
    }

    .timeline-item {
      display: flex;
      padding: 16px 0;
      position: relative;
    }

    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 48px;
      left: 16px;
      bottom: 0;
      width: 1px;
      background-color: #f0f0f0;
    }

    .timeline-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }

    .timeline-icon.ticket {
      background-color: #ff4d4f;
      color: white;
    }

    .timeline-icon.review {
      background-color: #faad14;
      color: white;
    }

    .timeline-icon.watchlist {
      background-color: #722ed1;
      color: white;
    }

    .timeline-icon.profile {
      background-color: #13c2c2;
      color: white;
    }

    .timeline-content {
      flex: 1;
    }

    .timeline-date {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 4px;
    }

    .timeline-title {
      font-weight: 500;
      margin-bottom: 4px;
      color: #262626;
    }

    .timeline-details {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }

    /* Activity List */
    .activity-list {
      margin-top: 24px;
    }

    .activity-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background-color: #fafafa;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .activity-poster {
      width: 80px;
      height: 120px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .activity-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .activity-details {
      flex: 1;
    }

    .activity-details h4 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #262626;
    }

    .activity-meta {
      display: flex;
      gap: 16px;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .activity-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .activity-info {
      display: flex;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.65);
    }

    .activity-review {
      color: rgba(0, 0, 0, 0.65);
      font-style: italic;
    }

    /* Watchlist Grid */
    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }

    .watchlist-item {
      width: 100%;
    }

    .watchlist-poster {
      height: 225px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      margin-bottom: 8px;
    }

    .watchlist-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .watchlist-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .watchlist-poster:hover .watchlist-overlay {
      opacity: 1;
    }

    .watchlist-item h5 {
      margin: 8px 0 4px;
      font-size: 14px;
      font-weight: 500;
    }

    .watchlist-meta {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .profile-header-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .avatar-section {
        margin-right: 0;
      }

      .user-info {
        padding-top: 24px;
      }

      .user-details {
        justify-content: center;
      }

      .avatar-uploader {
        flex-direction: column;
        align-items: center;
      }

      .preview {
        margin-bottom: 16px;
      }

      .avatar-actions {
        flex-direction: column;
      }

      .security-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .activity-item {
        flex-direction: column;
      }

      .activity-poster {
        width: 100%;
        height: 200px;
      }

      .activity-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }

    @media (max-width: 576px) {
      .profile-page {
        padding-top: 60px;
      }

      .profile-container {
        padding: 0 12px;
      }

      .form-actions {
        flex-direction: column;
      }

      .update-btn, .cancel-btn {
        width: 100%;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileName: string = '';
  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  // Preferences
  emailNotifications: boolean = true;
  smsNotifications: boolean = true;

  // Security
  twoFactorEnabled: boolean = false;

  // Password change fields
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Password visibility toggles
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isUpdating: boolean = false;
  isChangingPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.profileName = user.name;
      }
    });

    // Fetch updated user data
    this.authService.getMe().subscribe({
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  updateProfile(): void {
    if (!this.user) return;

    this.isUpdating = true;

    // Check if avatar has been updated
    if (this.avatarFile) {
      this.uploadAvatar().then(avatarUrl => {
        // After successful avatar upload, update the profile with the new avatar URL
        this.updateProfileData(avatarUrl);
      }).catch(error => {
        console.error('Error uploading avatar:', error);
        this.message.error('Failed to upload avatar');
        this.isUpdating = false;
      });
    } else {
      // Just update the profile without changing the avatar
      this.updateProfileData();
    }
  }

  private uploadAvatar(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.avatarFile) {
        reject('No avatar file selected');
        return;
      }

      // Convert the file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        resolve(base64Image); // Resolve with the base64 data URL
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(this.avatarFile);
    });
  }

  private updateProfileData(avatarUrl?: string): void {
    this.authService.updateProfile(this.profileName, avatarUrl).subscribe({
      next: () => {
        this.message.success('Profile updated successfully');
        this.isUpdating = false;
        this.avatarFile = null; // Reset the file after successful upload

        // You would also save preferences here in a real application
        console.log('Preferences saved:', {
          emailNotifications: this.emailNotifications,
          smsNotifications: this.smsNotifications
        });
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.message.error('Error updating profile');
        this.isUpdating = false;
      }
    });
  }

  changePassword(): void {
    if (!this.isValidPasswordChange()) {
      return;
    }

    this.isChangingPassword = true;

    // In a real application, we would call a service method here
    setTimeout(() => {
      this.message.success('Password changed successfully');
      this.resetPasswordForm();
      this.isChangingPassword = false;
    }, 1500);
  }

  isValidPasswordChange(): boolean {
    return Boolean(
      this.currentPassword &&
      this.newPassword &&
      this.confirmPassword &&
      this.passwordsMatch() &&
      this.passwordStrength >= 60
    );
  }

  resetPasswordForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  resetForm(): void {
    if (this.user) {
      this.profileName = this.user.name;
    }
    this.cancelAvatarUpdate();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.message.error('Image size exceeds 2MB limit');
        return;
      }

      this.avatarFile = file;

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cancelAvatarUpdate(): void {
    this.avatarPreview = null;
    this.avatarFile = null;
  }

  // Password validation methods
  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.newPassword !== '';
  }

  get passwordStrength(): number {
    if (!this.newPassword) return 0;

    let strength = 0;

    // Length check
    if (this.hasMinLength()) strength += 25;

    // Has uppercase
    if (this.hasUpperCase()) strength += 25;

    // Has lowercase
    if (this.hasLowerCase()) strength += 25;

    // Has number
    if (this.hasNumber()) strength += 25;

    return strength;
  }

  get passwordStrengthStatus(): NzProgressStatusType {
    const strength = this.passwordStrength;
    if (strength < 50) return 'exception';
    if (strength < 75) return 'normal';
    return 'success';
  }

  get passwordStrengthText(): string {
    const strength = this.passwordStrength;
    if (strength === 0) return '';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Medium';
    if (strength === 100) return 'Very Strong';
    return 'Strong';
  }

  get passwordStrengthClass(): string {
    const strength = this.passwordStrength;
    if (strength < 50) return 'strength-weak';
    if (strength < 75) return 'strength-medium';
    return 'strength-strong';
  }

  hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }
}
