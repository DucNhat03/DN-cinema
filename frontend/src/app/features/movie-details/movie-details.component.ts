import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../core/services/movie.service';
import { AuthService } from '../../core/services/auth.service';
import { Movie, Review } from '../../shared/models/movie.model';
import { User } from '../../shared/models/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';
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
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { zorroTabsProviders } from '../../core/zorro.module';

@Component({
  selector: 'app-movie-details',
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
    NzSkeletonModule,
    NzDividerModule,
    NzToolTipModule,
    NzBackTopModule,
    NzPopoverModule,
    NzGridModule,
    NzAlertModule,
    NzProgressModule,
    NzBadgeModule
  ],
  providers: [
    ...zorroTabsProviders
  ],
  template: `
    <div class="movie-details-page">
      <nz-back-top [nzVisibilityHeight]="300"></nz-back-top>

      <div class="container">
        <!-- Loading Skeleton -->
        <div *ngIf="loading" class="loading-container">
          <div class="skeleton-layout">
            <div class="skeleton-header">
              <nz-skeleton-element nzType="image" [nzActive]="true" class="backdrop-skeleton"></nz-skeleton-element>
            </div>
            <div class="skeleton-content">
              <div class="skeleton-poster">
                <nz-skeleton-element nzType="image" [nzActive]="true" class="poster-skeleton"></nz-skeleton-element>
              </div>
              <div class="skeleton-details">
                <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 6 }"></nz-skeleton>
              </div>
            </div>
          </div>
        </div>

        <ng-container *ngIf="!loading && movie">
          <!-- Navigation breadcrumb -->
          <div class="breadcrumb">
            <a [routerLink]="['/movies']"><i nz-icon nzType="home"></i> <span>Movies</span></a>
            <i nz-icon nzType="right" class="separator"></i>
            <span class="current">{{ movie.title }}</span>
          </div>

          <!-- Backdrop & Movie Info Hero Section -->
          <div class="movie-hero">
            <div class="backdrop" [style.backgroundImage]="'url(' + getBackdropUrl(movie.backdropPath) + ')'">
              <div class="backdrop-overlay"></div>
            </div>

            <div class="movie-info">
              <div class="poster-wrapper">
                <div class="poster">
                  <img [src]="getPosterUrl(movie.posterPath)" [alt]="movie.title" />

                  <div *ngIf="isInWatchlist" class="in-watchlist-badge" nz-tooltip nzTooltipTitle="In your watchlist">
                    <i nz-icon nzType="check-circle" nzTheme="fill"></i>
                  </div>

                  <!-- Release status badge -->
                  <div *ngIf="isNewRelease(movie.releaseDate)" class="release-badge new">
                    New Release
                  </div>
                  <div *ngIf="isUpcomingRelease(movie.releaseDate)" class="release-badge upcoming">
                    Coming Soon
                  </div>
                </div>

                <div class="movie-actions">
                  <button
                    nz-button
                    nzBlock
                    [nzType]="isInWatchlist ? 'default' : 'primary'"
                    (click)="toggleWatchlist()"
                    *ngIf="currentUser"
                    [disabled]="watchlistLoading"
                    class="watchlist-btn"
                  >
                    <i nz-icon [nzType]="isInWatchlist ? 'check' : 'plus'"></i>
                    {{ isInWatchlist ? 'In Watchlist' : 'Add to Watchlist' }}
                  </button>

                  <button
                    *ngIf="!currentUser"
                    nz-button
                    nzBlock
                    nzType="primary"
                    (click)="goToLogin()"
                    class="login-prompt-btn"
                  >
                    <i nz-icon nzType="user"></i>Login to Add to Watchlist
                  </button>

                  <a
                    *ngIf="movie.trailerKey"
                    nz-button
                    nzBlock
                    [href]="'https://www.youtube.com/watch?v=' + movie.trailerKey"
                    target="_blank"
                    class="trailer-btn"
                  >
                    <i nz-icon nzType="play-circle"></i>Watch Trailer
                  </a>
                </div>
              </div>

              <div class="details">
                <div class="details-header">
                  <h1 class="title">{{ movie.title }}</h1>
                  <div *ngIf="movie.tagline" class="tagline">{{ movie.tagline }}</div>

                  <div class="meta">
                    <span class="release-date">{{ formatDate(movie.releaseDate) }}</span>
                    <span class="runtime">{{ formatRuntime(movie.runtime) }}</span>
                    <span *ngIf="movie.certification" class="certification">{{ movie.certification }}</span>
                  </div>

                  <div class="genres">
                    <nz-tag *ngFor="let genre of movie.genres || []" [nzColor]="getGenreColor(genre.name)">
                      {{ genre.name }}
                    </nz-tag>
                  </div>
                </div>

                <div class="ratings-section">
                  <div class="rating-card tmdb">
                    <div class="rating-value">{{ movie.voteAverage.toFixed(1) }}</div>
                    <div class="rating-stars">
                      <nz-rate [ngModel]="movie.voteAverage / 2" nzAllowHalf nzDisabled></nz-rate>
                    </div>
                    <div class="rating-label">TMDB Rating</div>
                    <div class="vote-count">({{ movie.voteCount }} votes)</div>
                  </div>

                  <div *ngIf="movie.averageRating > 0" class="rating-card user">
                    <div class="rating-value">{{ movie.averageRating.toFixed(1) }}</div>
                    <div class="rating-stars">
                      <nz-rate [ngModel]="movie.averageRating / 2" nzAllowHalf nzDisabled></nz-rate>
                    </div>
                    <div class="rating-label">User Rating</div>
                    <div class="vote-count">({{ movie.reviewCount }} {{ movie.reviewCount === 1 ? 'review' : 'reviews' }})</div>
                  </div>

                  <div class="your-rating" *ngIf="currentUser && hasRated">
                    <div class="your-rating-label">Your Rating:</div>
                    <div class="your-rating-stars">
                      <nz-rate [(ngModel)]="yourRating" (ngModelChange)="onRatingChange($event)"></nz-rate>
                    </div>
                  </div>
                </div>

                <div class="overview-section">
                  <h3 class="section-title">Overview</h3>
                  <p class="overview-text">{{ movie.overview || 'No overview available.' }}</p>
                </div>

                <div class="details-grid">
                  <div class="detail-item" *ngIf="movie?.director">
                    <span class="label">Director</span>
                    <span class="value">{{ movie.director }}</span>
                  </div>

                  <div class="detail-item" *ngIf="movie?.writer">
                    <span class="label">Writer</span>
                    <span class="value">{{ movie.writer }}</span>
                  </div>

                  <div class="detail-item" *ngIf="movie?.originalLanguage">
                    <span class="label">Language</span>
                    <span class="value">{{ getLanguageName(movie.originalLanguage) }}</span>
                  </div>

                  <div class="detail-item" *ngIf="(movie?.budget ?? 0) > 0">
                    <span class="label">Budget</span>
                    <span class="value">{{ formatCurrency(movie.budget) }}</span>
                  </div>

                  <div class="detail-item" *ngIf="(movie?.revenue ?? 0) > 0">
                    <span class="label">Revenue</span>
                    <span class="value">{{ formatCurrency(movie.revenue) }}</span>
                  </div>

                  <div class="detail-item" *ngIf="movie?.status">
                    <span class="label">Status</span>
                    <span class="value">{{ movie.status }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Tabs -->
          <div class="content-tabs">
            <nz-tabset nzSize="large" [nzAnimated]="true">
              <!-- Cast & Crew Tab -->
              <nz-tab nzTitle="Cast & Crew">
                <div class="tab-content">
                  <h3 class="section-title">Cast</h3>

                  <div *ngIf="movie.cast && movie.cast.length > 0; else noCast" class="cast-grid">
                    <div *ngFor="let actor of movie.cast" class="cast-card">
                      <div class="cast-photo">
                        <img [src]="getProfileUrl(actor.profilePath)" [alt]="actor.name" />
                      </div>
                      <div class="cast-info">
                        <div class="cast-name">{{ actor.name }}</div>
                        <div class="cast-character">{{ actor.character }}</div>
                      </div>
                    </div>
                  </div>

                  <ng-template #noCast>
                    <nz-empty nzDescription="No cast information available"></nz-empty>
                  </ng-template>

                  <nz-divider></nz-divider>

                  <h3 class="section-title">Crew</h3>

                  <div *ngIf="movie.crew && movie.crew.length > 0; else noCrew" class="crew-grid">
                    <div *ngFor="let crewMember of movie.crew" class="crew-card">
                      <div class="crew-photo">
                        <img [src]="getProfileUrl(crewMember.profilePath)" [alt]="crewMember.name" />
                      </div>
                      <div class="crew-info">
                        <div class="crew-name">{{ crewMember.name }}</div>
                        <div class="crew-job">{{ crewMember.job }}</div>
                      </div>
                    </div>
                  </div>

                  <ng-template #noCrew>
                    <nz-empty nzDescription="No crew information available"></nz-empty>
                  </ng-template>
                </div>
              </nz-tab>

              <!-- Reviews Tab -->
              <nz-tab nzTitle="Reviews" [nzBadge]="reviews.length ? reviews.length : null">
                <div class="tab-content">
                  <div class="reviews-header">
                    <h3 class="section-title">Reviews</h3>

                    <div *ngIf="currentUser && !userReviewExists()" class="add-review-prompt">
                      <button nz-button nzType="primary" (click)="scrollToReviewForm()">
                        <i nz-icon nzType="edit"></i>Write a Review
                      </button>
                    </div>
                  </div>

                  <!-- Review form for logged in users -->
                  <div class="review-form" *ngIf="currentUser && !userReviewExists()" id="review-form">
                    <nz-card>
                      <h3 class="review-form-title">Write a Review</h3>

                      <div class="rate-movie">
                        <span class="rate-label">Your Rating:</span>
                        <nz-rate [(ngModel)]="userRating" [nzAllowHalf]="false"></nz-rate>
                        <span class="selected-rating" *ngIf="userRating">
                          {{ userRating }}/5
                        </span>
                      </div>

                      <div class="review-input">
                        <textarea
                          nz-input
                          [(ngModel)]="reviewContent"
                          rows="4"
                          placeholder="Share your thoughts about the movie..."
                          [nzAutosize]="{ minRows: 4, maxRows: 8 }"
                        ></textarea>

                        <div class="review-guidelines">
                          <i nz-icon nzType="info-circle"></i>
                          <span>Please keep reviews respectful and avoid spoilers.</span>
                        </div>

                        <div class="char-counter" [class.near-limit]="reviewContent.length > 400" [class.at-limit]="reviewContent.length >= 500">
                          {{ reviewContent.length }}/500
                        </div>
                      </div>

                      <div class="form-actions">
                        <button
                          nz-button
                          (click)="clearReviewForm()"
                          [disabled]="!userRating && !reviewContent"
                        >
                          Cancel
                        </button>

                        <button
                          nz-button
                          nzType="primary"
                          [disabled]="!userRating || !reviewContent || reviewContent.length > 500 || submittingReview"
                          (click)="submitReview()"
                          [nzLoading]="submittingReview"
                        >
                          {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
                        </button>
                      </div>
                    </nz-card>
                  </div>

                  <!-- Reviews list -->
                  <div class="reviews-list">
                    <ng-container *ngIf="reviews && reviews.length > 0; else noReviews">
                      <div *ngFor="let review of reviews" class="review-item">
                        <nz-comment
                          [nzAuthor]="review.user.name"
                          [nzDatetime]="formatDate(review.createdAt)"
                          [nzAvatar]="review.user.avatar || 'assets/images/avatar.png'"
                        >
                          <div class="review-rating">
                            <nz-rate [ngModel]="review.rating" nzDisabled></nz-rate>
                            <span class="rating-text">{{ review.rating }}/5</span>
                          </div>

                          <p class="review-content">{{ review.content }}</p>

                          <!-- User can edit or delete their own review -->
                          <div *ngIf="isCurrentUserReview(review)" class="review-actions">
                            <button nz-button nzType="text" nzSize="small" (click)="editReview(review)">
                              <i nz-icon nzType="edit"></i>Edit
                            </button>

                            <button
                              nz-button
                              nzType="text"
                              nzDanger
                              nzSize="small"
                              nz-popconfirm
                              nzPopconfirmTitle="Are you sure you want to delete this review?"
                              nzPopconfirmPlacement="top"
                              (nzOnConfirm)="deleteReview(review.id)"
                            >
                              <i nz-icon nzType="delete"></i>Delete
                            </button>
                          </div>
                        </nz-comment>
                      </div>
                    </ng-container>

                    <ng-template #noReviews>
                      <div class="no-reviews">
                        <nz-empty
                          nzDescription="No reviews yet. Be the first to review this movie!"
                          [nzNotFoundImage]="'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'"
                        ></nz-empty>
                      </div>
                    </ng-template>
                  </div>
                </div>
              </nz-tab>

              <!-- More Info Tab -->
              <nz-tab nzTitle="More Info">
                <div class="tab-content">
                  <h3 class="section-title">Technical Details</h3>

                  <div class="details-table">
                    <div class="detail-row" *ngIf="movie?.originalTitle">
                      <div class="detail-label">Original Title</div>
                      <div class="detail-value">{{ movie.originalTitle }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.productionCompanies?.length">
                      <div class="detail-label">Production</div>
                      <div class="detail-value">{{ formatProductionCompanies(movie.productionCompanies) }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.productionCountries?.length">
                      <div class="detail-label">Country</div>
                      <div class="detail-value">{{ formatCountries(movie.productionCountries) }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.spoken_languages?.length">
                      <div class="detail-label">Spoken Languages</div>
                      <div class="detail-value">{{ formatLanguages(movie.spoken_languages) }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.releaseDate">
                      <div class="detail-label">Release Date</div>
                      <div class="detail-value">{{ formatFullDate(movie.releaseDate) }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.budget">
                      <div class="detail-label">Budget</div>
                      <div class="detail-value">{{ formatCurrency(movie.budget) }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.revenue">
                      <div class="detail-label">Box Office</div>
                      <div class="detail-value">{{ formatCurrency(movie.revenue) }}</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.runtime">
                      <div class="detail-label">Runtime</div>
                      <div class="detail-value">{{ movie.runtime }} minutes ({{ formatRuntime(movie.runtime) }})</div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.homepage">
                      <div class="detail-label">Website</div>
                      <div class="detail-value">
                        <a [href]="movie.homepage" target="_blank" rel="noopener noreferrer">{{ movie.homepage }}</a>
                      </div>
                    </div>

                    <div class="detail-row" *ngIf="movie?.imdbId">
                      <div class="detail-label">IMDB</div>
                      <div class="detail-value">
                        <a [href]="'https://www.imdb.com/title/' + movie.imdbId" target="_blank" rel="noopener noreferrer">
                          {{ movie.imdbId }}
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Keywords -->
                  <div *ngIf="movie?.keywords?.length" class="keywords-section">
                    <h3 class="section-title">Keywords</h3>
                    <div class="keywords-list">
                      <nz-tag *ngFor="let keyword of movie.keywords">{{ keyword.name }}</nz-tag>
                    </div>
                  </div>
                </div>
              </nz-tab>

              <!-- Similar Movies -->
              <nz-tab nzTitle="Similar Movies">
                <div class="tab-content">
                  <h3 class="section-title">You May Also Like</h3>

                  <div *ngIf="similarMovies && similarMovies.length > 0; else noSimilarMovies" class="similar-movies-grid">
                    <div *ngFor="let similar of similarMovies" class="similar-movie-card" [routerLink]="['/movies', similar.id]">
                      <div class="similar-poster">
                        <img [src]="getPosterUrl(similar.posterPath)" [alt]="similar.title" />
                      </div>
                      <div class="similar-info">
                        <div class="similar-title">{{ similar.title }}</div>
                        <div class="similar-year" *ngIf="similar.releaseDate">{{ getYear(similar.releaseDate) }}</div>
                        <div class="similar-rating" *ngIf="similar.voteAverage">
                          <i nz-icon nzType="star" nzTheme="fill"></i>
                          <span>{{ similar.voteAverage.toFixed(1) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ng-template #noSimilarMovies>
                    <nz-empty nzDescription="No similar movies found"></nz-empty>
                  </ng-template>
                </div>
              </nz-tab>
            </nz-tabset>
          </div>
        </ng-container>

        <!-- Error State -->
        <div *ngIf="!loading && !movie" class="error-container">
          <nz-result
            nzStatus="warning"
            nzTitle="Movie Not Found"
            nzSubTitle="Sorry, the movie you are looking for does not exist or has been removed."
          >
            <div nz-result-extra>
              <button nz-button nzType="primary" [routerLink]="['/movies']">Browse Movies</button>
              <button nz-button (click)="goBack()">Go Back</button>
            </div>
          </nz-result>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-details-page {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px 40px;
      position: relative;
    }

    /* Breadcrumb Navigation */
    .breadcrumb {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
    }

    .breadcrumb a {
      color: #666;
      transition: color 0.2s;
      display: flex;
      align-items: center;
    }

    .breadcrumb a:hover {
      color: #ff4d4f;
    }

    .breadcrumb i {
      font-size: 12px;
      margin-right: 4px;
    }

    .separator {
      margin: 0 8px;
      color:rgb(150, 22, 22);
    }

    .current {
      font-weight: 500;
      color: #262626;
    }

    /* Loading Skeleton */
    .loading-container {
      width: 100%;
    }

    .skeleton-layout {
      display: flex;
      flex-direction: column;
    }

    .skeleton-header {
      width: 100%;
      margin-bottom: 24px;
    }

    .backdrop-skeleton {
      width: 100%;
      height: 400px;
      border-radius: 8px;
    }

    .skeleton-content {
      display: flex;
      gap: 24px;
    }

    .skeleton-poster {
      width: 300px;
      height: 450px;
      flex-shrink: 0;
    }

    .poster-skeleton {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }

    .skeleton-details {
      flex: 1;
    }

    /* Movie Hero Section */
    .movie-hero {
      position: relative;
      margin-bottom: 32px;
    }

    .backdrop {
      height: 500px;
      background-size: cover;
      background-position: center top;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
    }

    .backdrop-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%);
    }

    .movie-info {
      display: flex;
      margin-top: -250px;
      position: relative;
      z-index: 2;
      padding: 0 24px;
    }

    .poster-wrapper {
      flex: 0 0 300px;
    }

    .poster {
      position: relative;
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .poster img {
      width: 100%;
      display: block;
    }

    .in-watchlist-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #52c41a;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .release-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 4px;
      color: white;
    }

    .release-badge.new {
      background-color: #ff4d4f;
    }

    .release-badge.upcoming {
      background-color: #722ed1;
    }

    .movie-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .watchlist-btn, .login-prompt-btn, .trailer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 0;
      font-size: 14px;
    }

    .watchlist-btn {
      background: linear-gradient(45deg, #ff4d4f, #ff7875);
      border-color: #ff4d4f;
    }

    .details {
      flex: 1;
      margin-left: 32px;
      color: white;
    }

    .details-header {
      margin-bottom: 32px;
    }

    .title {
      font-size: 2.5em;
      margin-bottom: 8px;
      color: #fff;
      font-weight: 700;
      line-height: 1.2;
    }

    .tagline {
      font-style: italic;
      margin-bottom: 16px;
      opacity: 0.8;
      font-size: 1.1em;
    }

    .meta {
      margin-bottom: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .meta > span {
      position: relative;
      padding-right: 16px;
    }

    .meta > span:not(:last-child)::after {
      content: '•';
      position: absolute;
      right: 0;
      color: rgba(255, 255, 255, 0.5);
    }

    .certification {
      border: 1px solid white;
      padding: 0px 4px;
      border-radius: 2px;
      font-size: 0.9em;
    }

    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    /* Ratings Section */
    .ratings-section {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      margin-bottom: 32px;
    }

    .rating-card {
      padding: 16px;
      border-radius: 8px;
      min-width: 120px;
      text-align: center;
    }

    .rating-card.tmdb {
      background-color: rgba(236, 232, 232, 0.48);
    }

    .rating-card.user {
      background-color: rgba(82, 196, 26, 0.15);
    }

    .rating-value {
      font-size: 24px;
      font-weight: 700;
      color: white;
    }

    .rating-stars {
      margin: 8px 0;
    }

    .rating-label {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.8;
      margin-bottom: 4px;
      color: black;
    }

    .vote-count {
      font-size: 12px;
      opacity: 0.6;
      color: black;

    }

    .your-rating {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 16px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .your-rating-label {
      font-size: 14px;
      margin-bottom: 8px;
    }

    /* Overview Section */
    .overview-section {
      margin-bottom: 32px;
    }

    .section-title {
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 600;
      color: black;
      position: relative;
      padding-bottom: 8px;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: #ff4d4f;
    }

    .overview-text {
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      color: black;

    }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-item .label {
      font-size: 12px;
      text-transform: uppercase;
      color: black;
      margin-bottom: 4px;
    }

    .detail-item .value {
      font-size: 14px;
      color: black;
    }

    /* Content Tabs */
    .content-tabs {
      background-color: white;
      border-radius: 12px;
      padding: 32px;
      margin-top: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .tab-content {
      padding: 24px 0;
    }

    .tab-content .section-title {
      color: #262626;
    }

    .tab-content .section-title::after {
      background-color: #ff4d4f;
    }

    /* Cast & Crew */
    .cast-grid, .crew-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }

    .cast-card, .crew-card {
      background-color: #fafafa;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .cast-card:hover, .crew-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .cast-photo, .crew-photo {
      height: 270px;
      overflow: hidden;
    }

    .cast-photo img, .crew-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .cast-card:hover .cast-photo img, .crew-card:hover .crew-photo img {
      transform: scale(1.05);
    }

    .cast-info, .crew-info {
      padding: 12px;
    }

    .cast-name, .crew-name {
      font-weight: 600;
      margin-bottom: 4px;
      color: #262626;
    }

    .cast-character, .crew-job {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.45);
    }

    /* Reviews */
    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .add-review-prompt {
      margin-bottom: 16px;
    }

    .review-form {
      margin-bottom: 32px;
    }

    .review-form-title {
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 600;
    }

    .rate-movie {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
    }

    .rate-label {
      margin-right: 12px;
      font-weight: 500;
    }

    .selected-rating {
      margin-left: 12px;
      font-weight: 500;
      color: #ff4d4f;
    }

    .review-input {
      position: relative;
      margin-bottom: 16px;
    }

    .review-guidelines {
      margin-top: 8px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .char-counter {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
    }

    .char-counter.near-limit {
      color: #faad14;
    }

    .char-counter.at-limit {
      color: #ff4d4f;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .reviews-list {
      margin-top: 24px;
    }

    .review-item {
      margin-bottom: 24px;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 24px;
    }

    .review-item:last-child {
      margin-bottom: 0;
      border-bottom: none;
      padding-bottom: 0;
    }

    .review-rating {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .rating-text {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }

    .review-content {
      margin: 0;
      font-size: 15px;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.85);
      white-space: pre-line;
    }

    .review-actions {
      margin-top: 12px;
      display: flex;
      gap: 12px;
    }

    .no-reviews {
      padding: 32px 0;
    }

    /* More Info Tab */
    .details-table {
      width: 100%;
      margin-bottom: 32px;
    }

    .detail-row {
      display: flex;
      border-bottom: 1px solid #f0f0f0;
      padding: 12px 0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      width: 180px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
    }

    .detail-value {
      flex: 1;
      color: rgba(0, 0, 0, 0.85);
    }

    .detail-value a {
      color: #1890ff;
      text-decoration: none;
    }

    .detail-value a:hover {
      color: #40a9ff;
      text-decoration: underline;
    }

    .keywords-section {
      margin-top: 32px;
    }

    .keywords-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    /* Similar Movies */
    .similar-movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .similar-movie-card {
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .similar-movie-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }

    .similar-poster {
      height: 240px;
      overflow: hidden;
    }

    .similar-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .similar-movie-card:hover .similar-poster img {
      transform: scale(1.05);
    }

    .similar-info {
      padding: 12px;
    }

    .similar-title {
      font-weight: 500;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .similar-year {
      font-size: 0.9em;
      color: rgba(0, 0, 0, 0.45);
      margin-bottom: 4px;
    }

    .similar-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9em;
    }

    .similar-rating i {
      color: #fadb14;
    }

    /* Error container */
    .error-container {
      padding: 48px 0;
    }

    /* Responsive Styles */
    @media (max-width: 991px) {
      .container {
        padding: 60px 16px 32px;
      }

      .movie-info {
        flex-direction: column;
        margin-top: -150px;
      }

      .poster-wrapper {
        flex: 0 0 auto;
        max-width: 250px;
        margin: 0 auto 32px;
      }

      .details {
        margin-left: 0;
      }

      .cast-grid, .crew-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      }

      .cast-photo, .crew-photo {
        height: 210px;
      }

      .content-tabs {
        padding: 24px 16px;
      }
    }

    @media (max-width: 767px) {
      .container {
        padding: 16px;
        padding-top: 60px;
      }

      .backdrop {
        height: 300px;
      }

      .title {
        font-size: 1.8em;
      }

      .cast-grid, .crew-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }

      .cast-photo, .crew-photo {
        height: 180px;
      }

      .similar-movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }

      .similar-poster {
        height: 180px;
      }

      .detail-row {
        flex-direction: column;
      }

      .detail-label {
        width: 100%;
        margin-bottom: 4px;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  similarMovies: any[] = [];
  loading: boolean = true;
  currentUser: User | null = null;
  userRating: number = 0;
  reviewContent: string = '';
  isInWatchlist: boolean = false;
  watchlistLoading: boolean = false;
  submittingReview: boolean = false;
  hasRated: boolean = false;
  yourRating: number = 0;

  // Genre colors mapping
  genreColors: {[key: string]: string} = {
    'Action': 'magenta',
    'Adventure': 'red',
    'Animation': 'orange',
    'Comedy': 'gold',
    'Crime': 'lime',
    'Documentary': 'green',
    'Drama': 'cyan',
    'Family': 'blue',
    'Fantasy': 'geekblue',
    'History': 'purple',
    'Horror': 'volcano',
    'Music': 'magenta',
    'Mystery': 'purple',
    'Romance': 'pink',
    'Science Fiction': 'blue',
    'TV Movie': 'cyan',
    'Thriller': 'red',
    'War': 'volcano',
    'Western': 'orange'
  };

  // Language mapping
  languageNames: {[key: string]: string} = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ru': 'Russian',
    'pt': 'Portuguese',
    'hi': 'Hindi'
  };

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadMovieDetails(id);
      }
    });
  }

  loadMovieDetails(id: number): void {
    this.loading = true;
    this.movieService.getMovieDetails(id).subscribe({
      next: (data) => {
        this.movie = data;
        this.checkWatchlistStatus(data.id);
        this.loadReviews(data.id);
        this.loadSimilarMovies(data.id);
      },
      error: (err) => {
        console.error('Error loading movie details:', err);
        this.loading = false;
      }
    });
  }

  loadReviews(movieId: string): void {
    this.movieService.getMovieReviews(movieId).subscribe({
      next: (data) => {
        this.reviews = data.reviews || [];
        // Check if the current user has reviewed this movie
        if (this.currentUser && this.reviews && this.reviews.length > 0) {
          const userReview = this.reviews.find(review =>
            review.user && review.user.id === this.currentUser?.id
          );

          if (userReview) {
            this.hasRated = true;
            this.yourRating = userReview.rating;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.loading = false;
        this.reviews = []; // Initialize to empty array on error
      }
    });
  }

  loadSimilarMovies(movieId: string): void {
    this.movieService.getSimilarMovies(movieId).subscribe({
      next: (data) => {
        if (data && data.movies) {
          this.similarMovies = data.movies.slice(0, 12); // Limit to 12 similar movies
        } else {
          this.similarMovies = [];
        }
      },
      error: (err) => {
        console.error('Error loading similar movies:', err);
        this.similarMovies = []; // Initialize to empty array on error
      }
    });
  }

  checkWatchlistStatus(movieId: string): void {
    if (!this.currentUser) return;

    this.watchlistLoading = true;
    this.movieService.checkWatchlistStatus(movieId).subscribe({
      next: (data) => {
        this.isInWatchlist = data.inWatchlist;
        this.watchlistLoading = false;
      },
      error: (err) => {
        console.error('Error checking watchlist status:', err);
        this.watchlistLoading = false;
      }
    });
  }

  toggleWatchlist(): void {
    if (!this.movie || !this.currentUser) return;

    this.watchlistLoading = true;

    if (this.isInWatchlist) {
      // Remove from watchlist
      this.movieService.removeFromWatchlistByMovieId(this.movie.id).subscribe({
        next: () => {
          this.isInWatchlist = false;
          this.watchlistLoading = false;
          this.message.success('Removed from watchlist');
        },
        error: (err) => {
          console.error('Error removing from watchlist:', err);
          this.watchlistLoading = false;
          this.message.error('Failed to remove from watchlist');
        }
      });
    } else {
      // Add to watchlist
      this.movieService.addToWatchlist(this.movie.id).subscribe({
        next: () => {
          this.isInWatchlist = true;
          this.watchlistLoading = false;
          this.message.success('Added to watchlist');
        },
        error: (err) => {
          console.error('Error adding to watchlist:', err);
          this.watchlistLoading = false;
          this.message.error('Failed to add to watchlist');
        }
      });
    }
  }

  submitReview(): void {
    if (!this.movie || !this.currentUser || !this.userRating || !this.reviewContent) return;

    this.submittingReview = true;

    this.movieService.createReview(this.movie.id, this.userRating, this.reviewContent).subscribe({
      next: () => {
        this.message.success('Review submitted successfully');

        // Reload reviews after submission
        this.loadReviews(this.movie!.id);

        // Reset form
        this.clearReviewForm();
        this.submittingReview = false;
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.message.error('Failed to submit review');
        this.submittingReview = false;
      }
    });
  }

  clearReviewForm(): void {
    this.userRating = 0;
    this.reviewContent = '';
  }

  editReview(review: Review): void {
    // Populate the form with review data
    this.userRating = review.rating;
    this.reviewContent = review.content;

    // Scroll to the review form
    this.scrollToReviewForm();

    // Set up to update instead of create
    // For now we'll just delete and create a new one
    this.deleteReview(review.id, true);
  }

  deleteReview(reviewId: string, isEditing: boolean = false): void {
    this.movieService.deleteReview(reviewId).subscribe({
      next: () => {
        if (!isEditing) {
          this.message.success('Review deleted successfully');
        }
        // Reload reviews after deletion
        this.loadReviews(this.movie!.id);
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.message.error('Failed to delete review');
      }
    });
  }

  isCurrentUserReview(review: Review): boolean {
    return Boolean(this.currentUser && review.user.id === this.currentUser.id);
  }

  userReviewExists(): boolean {
    if (!this.currentUser) return false;
    return this.reviews.some(review => review.user.id === this.currentUser?.id);
  }

  onRatingChange(rating: number): void {
    if (!this.movie || !this.currentUser) return;

    // Just update the rating without a review
    this.movieService.rateMovie(this.movie.id, rating).subscribe({
      next: () => {
        this.message.success('Rating updated');
        this.loadReviews(this.movie!.id); // Reload to update average
      },
      error: (err) => {
        console.error('Error updating rating:', err);
        this.message.error('Failed to update rating');
      }
    });
  }

  getPosterUrl(path: string): string {
    if (!path) return 'assets/images/no-poster.jpg';
    return this.movieService.getImageUrl(path, 'w500');
  }

  getBackdropUrl(path: string): string {
    if (!path) return 'assets/images/no-backdrop.jpg';
    return this.movieService.getImageUrl(path, 'original');
  }

  getProfileUrl(path: string | undefined): string {
    if (!path) return 'assets/images/no-profile.jpg';
    return this.movieService.getImageUrl(path, 'w185');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatFullDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatGenres(genres: { id: number, name: string }[] | null | undefined): string {
    if (!genres || !genres.length) return 'N/A';
    return genres.map(g => g.name).join(', ');
  }

  formatProductionCompanies(companies: { id: number, name: string }[] | undefined): string {
    if (!companies || !companies.length) return 'N/A';
    return companies.map(c => c.name).join(', ');
  }

  formatCountries(countries: { iso_3166_1: string, name: string }[] | undefined): string {
    if (!countries || !countries.length) return 'N/A';
    return countries.map(c => c.name).join(', ');
  }

  formatLanguages(languages: { iso_639_1: string, name: string }[] | undefined): string {
    if (!languages || !languages.length) return 'N/A';
    return languages.map(l => l.name).join(', ');
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  getLanguageName(languageCode: string | undefined): string {
    if (!languageCode) return 'Unknown';
    return this.languageNames[languageCode] || languageCode;
  }

  getGenreColor(genreName: string): string {
    return this.genreColors[genreName] || 'blue';
  }

  isNewRelease(dateString: string): boolean {
    const releaseDate = new Date(dateString);
    const now = new Date();

    // Movie is released within the last 30 days
    return releaseDate <= now &&
      (now.getTime() - releaseDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
  }

  isUpcomingRelease(dateString: string): boolean {
    const releaseDate = new Date(dateString);
    const now = new Date();

    // Movie is not released yet
    return releaseDate > now;
  }

  scrollToReviewForm(): void {
    const element = document.getElementById('review-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { redirect: this.router.url }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
