import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { MovieListItem } from '../../models/movie.model';
import { zorroModules } from '../../../core/zorro.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe, ...zorroModules, NzCardModule, NzTagModule, NzIconModule],
  template: `
    <div class="movie-card" [routerLink]="['/movies', movie.id]">
      <div class="poster-container">
        <img class="poster" [src]="getPosterUrl(movie.poster_path)" [alt]="movie.title" />
        <div class="overlay">
          <div class="rating">
            <div class="rating-value">{{movie.vote_average | number:'1.1-1'}}</div>
            <div class="rating-stars">
              <i nz-icon nzType="star" nzTheme="fill" *ngFor="let star of getStars(movie.vote_average)"></i>
              <i nz-icon nzType="star" nzTheme="outline" *ngFor="let emptyStar of getEmptyStars(movie.vote_average)"></i>
            </div>
          </div>

          <div class="buttons">
            <a class="btn view-btn" [routerLink]="['/movies', movie.id]">
              <i nz-icon nzType="eye"></i> Details
            </a>
            <a class="btn rate-btn" [routerLink]="['/movies', movie.id]" [fragment]="'reviews'">
              <i nz-icon nzType="star"></i> Rate
            </a>
          </div>
        </div>

        <div class="badge" *ngIf="isNewRelease(movie.release_date)">
          NEW
        </div>
      </div>

      <div class="movie-info">
        <h3 class="movie-title" [title]="movie.title">{{movie.title}}</h3>
        <div class="movie-meta">
          <span class="year">{{getYear(movie.release_date)}}</span>
          <span class="dot-divider"></span>
          <span class="category" [ngClass]="getRatingClass(movie.vote_average)">
            {{getRatingCategory(movie.vote_average)}}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-card {
      width: 100%;
      margin-bottom: 20px;
      transition: all 0.3s ease;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      position: relative;
      background-color: #fff;
    }

    .movie-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .poster-container {
      position: relative;
      height: 0;
      padding-top: 150%; /* 2:3 aspect ratio */
      overflow: hidden;
    }

    .poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .movie-card:hover .poster {
      transform: scale(1.05);
    }

    /* Overlay with gradient */
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 60%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 20px 15px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .movie-card:hover .overlay {
      opacity: 1;
    }

    /* Rating */
    .rating {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;
    }

    .rating-value {
      font-size: 24px;
      font-weight: bold;
      color: white;
      margin-bottom: 5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    }

    .rating-stars {
      display: flex;
      gap: 3px;
    }

    .rating-stars i {
      color: #ffc107;
      font-size: 14px;
    }

    /* Action buttons */
    .buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 15px;
      border-radius: 20px;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
      color: white;
      text-decoration: none;
    }

    .btn i {
      margin-right: 5px;
      font-size: 14px;
    }

    .view-btn {
      background-color: rgba(255, 77, 79, 0.9);
    }

    .view-btn:hover {
      background-color: #ff4d4f;
    }

    .rate-btn {
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
    }

    .rate-btn:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    /* New badge */
    .badge {
      position: absolute;
      top: 15px;
      left: 0;
      background: linear-gradient(135deg, #ff4d4f, #ff7875);
      color: white;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.5px;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
      z-index: 2;
    }

    /* Movie info */
    .movie-info {
      padding: 15px;
    }

    .movie-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .movie-meta {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #666;
    }

    .dot-divider {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: #ccc;
      border-radius: 50%;
      margin: 0 8px;
    }

    .category {
      font-weight: 500;
    }

    .category.excellent {
      color: #52c41a;
    }

    .category.good {
      color: #faad14;
    }

    .category.average {
      color: #fa8c16;
    }

    .category.poor {
      color: #f5222d;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
      .movie-title {
        font-size: 14px;
      }

      .movie-meta {
        font-size: 12px;
      }

      .buttons {
        gap: 5px;
      }

      .btn {
        padding: 6px 10px;
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .overlay {
        opacity: 1;
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0) 50%);
        padding: 15px 10px;
      }

      .rating-value {
        font-size: 20px;
      }

      .rating-stars i {
        font-size: 12px;
      }
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: MovieListItem;

  constructor(private movieService: MovieService) {}

  getPosterUrl(path: string): string {
    return this.movieService.getImageUrl(path, 'w500');
  }

  getYear(dateString: string): string {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear().toString();
  }

  isNewRelease(dateString: string): boolean {
    if (!dateString) return false;
    const releaseDate = new Date(dateString);
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return releaseDate >= thirtyDaysAgo && releaseDate <= today;
  }

  getRatingColor(rating: number): string {
    if (rating >= 8) return '#52c41a'; // excellent - green
    if (rating >= 7) return '#389e0d'; // very good - dark green
    if (rating >= 6) return '#faad14'; // good - yellow
    if (rating >= 5) return '#fa8c16'; // average - orange
    return '#f5222d'; // poor - red
  }

  getRatingClass(rating: number): string {
    if (rating >= 8) return 'excellent';
    if (rating >= 7) return 'good';
    if (rating >= 5) return 'average';
    return 'poor';
  }

  getRatingCategory(rating: number): string {
    if (rating >= 8) return 'Excellent';
    if (rating >= 7) return 'Good';
    if (rating >= 5) return 'Average';
    return 'Poor';
  }

  getStars(rating: number): number[] {
    // Convert rating to stars (0-10 -> 0-5 scale)
    const starCount = Math.round(rating / 2);
    return Array(starCount).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    // Get remaining empty stars (5 - filled stars)
    const starCount = Math.round(rating / 2);
    const emptyStarCount = 5 - starCount;
    return Array(emptyStarCount).fill(0);
  }
}
