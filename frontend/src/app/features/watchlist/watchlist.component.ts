import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { zorroModules } from '../../core/zorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzPaginationModule,
    NzCardModule,
    NzEmptyModule,
    NzSkeletonModule,
    NzTagModule,
    NzToolTipModule,
    NzPopconfirmModule,
    ...zorroModules
  ],
  template: `
    <div class="watchlist-page">
      <div class="watchlist-container">
        <div class="page-header-wrapper">
          <nz-page-header class="page-header">
            <nz-page-header-title>
              <div class="title-with-count">My Watchlist <span *ngIf="totalItems" class="count-badge">{{ totalItems }}</span></div>
            </nz-page-header-title>
            <nz-page-header-subtitle>
              Keep track of movies you want to watch
            </nz-page-header-subtitle>
            <nz-page-header-extra>
              <button *ngIf="watchlist.length > 0" nz-button nzType="primary" [routerLink]="['/movies']">
                <i nz-icon nzType="plus"></i>Add More Movies
              </button>
            </nz-page-header-extra>
          </nz-page-header>
        </div>

        <div *ngIf="loading" class="loading-container">
          <div class="skeleton-grid">
            <div *ngFor="let i of [1,2,3,4,5,6]">
              <nz-skeleton-element nzType="image" [nzActive]="true" class="skeleton-poster"></nz-skeleton-element>
              <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 2 }"></nz-skeleton>
            </div>
          </div>
        </div>

        <ng-container *ngIf="!loading">
          <div *ngIf="watchlist.length > 0; else emptyWatchlist">
            <div class="search-filter-section">
              <div class="search-sort-bar">
                <nz-input-group [nzPrefix]="prefixSearch" class="search-input" [nzSuffix]="suffixClear">
                  <input
                    nz-input
                    placeholder="Search by title or description"
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="applyFilters()"
                  />
                </nz-input-group>
                <ng-template #prefixSearch>
                  <i nz-icon nzType="search"></i>
                </ng-template>
                <ng-template #suffixClear>
                  <i
                    *ngIf="searchQuery"
                    nz-icon
                    nzType="close-circle"
                    nzTheme="fill"
                    class="clear-icon"
                    (click)="searchQuery=''; applyFilters()"
                  ></i>
                </ng-template>

                <nz-select
                  class="sort-select"
                  [(ngModel)]="sortOption"
                  nzPlaceHolder="Sort by"
                  (ngModelChange)="sortWatchlist()"
                >
                  <nz-option nzValue="newest" nzLabel="Newest First"></nz-option>
                  <nz-option nzValue="oldest" nzLabel="Oldest First"></nz-option>
                  <nz-option nzValue="titleAsc" nzLabel="Title (A-Z)"></nz-option>
                  <nz-option nzValue="titleDesc" nzLabel="Title (Z-A)"></nz-option>
                </nz-select>
              </div>

              <div class="results-info" *ngIf="filteredWatchlist.length !== watchlist.length">
                <span>Showing {{ filteredWatchlist.length }} of {{ watchlist.length }} movies</span>
                <button
                  nz-button
                  nzType="text"
                  class="clear-search"
                  *ngIf="searchQuery"
                  (click)="searchQuery=''; applyFilters()"
                >
                  <i nz-icon nzType="close-circle"></i> Clear search
                </button>
              </div>
            </div>

            <div class="watchlist-grid" *ngIf="filteredWatchlist.length > 0; else noResults">
              <div *ngFor="let item of filteredWatchlist" class="watchlist-item">
                <nz-card
                  class="movie-card"
                  [nzCover]="coverTemplate"
                  [nzBorderless]="true"
                  [nzActions]="[viewAction, removeAction]"
                >
                  <nz-card-meta
                    [nzTitle]="item.movie.title"
                    [nzDescription]="descriptionTemplate"
                  ></nz-card-meta>

                  <ng-template #descriptionTemplate>
                    <div class="movie-genres" *ngIf="item.movie.genres && item.movie.genres.length">
                      <nz-tag *ngFor="let genre of item.movie.genres.slice(0, 2)" [nzColor]="getGenreColor(genre)">
                        {{ genre }}
                      </nz-tag>
                    </div>
                    <p class="movie-overview" *ngIf="item.movie.overview">
                      {{ item.movie.overview | slice:0:120 }}{{ item.movie.overview.length > 120 ? '...' : '' }}
                    </p>
                  </ng-template>

                  <div class="card-footer">
                    <div class="rating" *ngIf="item.movie.voteAverage" nz-tooltip [nzTooltipTitle]="'Rating: ' + item.movie.voteAverage + '/10'">
                      <i nz-icon nzType="star" nzTheme="fill"></i>
                      <span>{{ item.movie.voteAverage.toFixed(1) }}</span>
                    </div>
                    <div class="date-added" nz-tooltip [nzTooltipTitle]="getFullDate(item.createdAt)">
                      Added {{ formatDate(item.createdAt) }}
                    </div>
                  </div>
                </nz-card>

                <ng-template #coverTemplate>
                  <div class="poster-container" [routerLink]="['/movies', item.movie.id]">
                    <img [src]="getPosterUrl(item.movie.posterPath)" [alt]="item.movie.title" class="poster" />
                    <div class="poster-overlay">
                      <div class="overlay-content">
                        <span class="year" *ngIf="item.movie.releaseDate">
                          {{ getYear(item.movie.releaseDate) }}
                        </span>
                        <div class="watch-button">
                          <i nz-icon nzType="eye"></i>
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ng-template>

                <ng-template #viewAction>
                  <button nz-button nzType="text" [routerLink]="['/movies', item.movie.id]">
                    <i nz-icon nzType="eye"></i>
                    <span>View</span>
                  </button>
                </ng-template>

                <ng-template #removeAction>
                  <button
                    nz-button
                    nzType="text"
                    nzDanger
                    nz-popconfirm
                    nzPopconfirmTitle="Remove from watchlist?"
                    nzPopconfirmPlacement="top"
                    (nzOnConfirm)="removeFromWatchlist(item.id)"
                  >
                    <i nz-icon nzType="delete"></i>
                    <span>Remove</span>
                  </button>
                </ng-template>
              </div>
            </div>

            <ng-template #noResults>
              <div class="no-results">
                <nz-empty
                  nzDescription="No movies match your search"
                  [nzNotFoundImage]="'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'"
                ></nz-empty>
                <button nz-button nzType="primary" (click)="searchQuery=''; applyFilters()">
                  <i nz-icon nzType="rollback"></i>Show all movies
                </button>
              </div>
            </ng-template>

            <div class="pagination" *ngIf="totalItems > limit">
              <nz-pagination
                [nzPageIndex]="currentPage"
                [nzTotal]="totalItems"
                [nzPageSize]="limit"
                [nzShowTotal]="totalTemplate"
                (nzPageIndexChange)="onPageChange($event)"
              ></nz-pagination>
              <ng-template #totalTemplate let-total>
                Total {{ total }} movies
              </ng-template>
            </div>
          </div>

          <ng-template #emptyWatchlist>
            <div class="empty-watchlist">
              <nz-empty
                nzDescription="Your watchlist is empty"
                [nzNotFoundImage]="'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'"
              ></nz-empty>
              <div class="empty-watchlist-content">
                <p>Start adding movies to your watchlist to keep track of films you want to see.</p>
                <button nz-button nzType="primary" [routerLink]="['/movies']">
                  <i nz-icon nzType="appstore"></i>Browse Movies
                </button>
              </div>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .watchlist-page {
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 24px 0;
    }

    .watchlist-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      margin-top: 74px;
    }

    .page-header-wrapper {
      margin-bottom: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      overflow: hidden;
    }

    .page-header {
      padding: 24px;
      background: transparent;
    }

    .title-with-count {
      display: flex;
      align-items: center;
    }

    .count-badge {
      font-size: 14px;
      background: #ff4d4f;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      margin-left: 12px;
    }

    .loading-container {
      padding: 20px 0;
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .skeleton-poster {
      height: 400px;
      width: 100%;
      margin-bottom: 12px;
    }

    .search-filter-section {
      margin-bottom: 24px;
    }

    .search-sort-bar {
      display: flex;
      margin-bottom: 12px;
      gap: 16px;
      align-items: center;
    }

    .search-input {
      flex: 1;
    }

    .clear-icon {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.45);
    }

    .clear-icon:hover {
      color: rgba(0, 0, 0, 0.65);
    }

    .sort-select {
      width: 160px;
    }

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: rgba(0,0,0,0.65);
    }

    .clear-search {
      padding: 0;
      color: #ff4d4f;
    }

    .watchlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .watchlist-item {
      transition: all 0.3s;
    }

    .watchlist-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .movie-card {
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .poster-container {
      position: relative;
      height: 0;
      padding-top: 150%; /* 2:3 aspect ratio */
      overflow: hidden;
      cursor: pointer;
    }

    .poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }

    .poster-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
    }

    .overlay-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .watch-button {
      background: rgba(255, 77, 79, 0.9);
      color: white;
      border-radius: 20px;
      padding: 8px 16px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.3s;
    }

    .watch-button:hover {
      background: rgba(255, 77, 79, 1);
    }

    .poster-container:hover .poster {
      transform: scale(1.1);
    }

    .poster-container:hover .poster-overlay {
      opacity: 1;
    }

    .year {
      color: white;
      font-weight: bold;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 14px;
    }

    .movie-genres {
      margin-bottom: 8px;
    }

    .movie-overview {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 0.9em;
      border-top: 1px solid #f0f0f0;
      padding-top: 12px;
    }

    .rating {
      display: flex;
      align-items: center;
      cursor: help;
    }

    .rating i {
      color: #fadb14;
      margin-right: 4px;
    }

    .date-added {
      font-style: italic;
      cursor: help;
    }

    .pagination {
      margin-top: 32px;
      display: flex;
      justify-content: center;
    }

    .empty-watchlist, .no-results {
      text-align: center;
      padding: 60px 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }

    .empty-watchlist-content {
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-watchlist-content p {
      margin-bottom: 24px;
      color: rgba(0, 0, 0, 0.45);
    }

    .empty-watchlist button, .no-results button {
      margin-top: 16px;
    }

    @media (max-width: 768px) {
      .watchlist-page {
        padding: 16px 0;
      }

      .watchlist-container {
        padding: 0 16px;
      }

      .watchlist-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
      }
    }

    @media (max-width: 576px) {
      .search-sort-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .sort-select {
        width: 100%;
      }

      .watchlist-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }

      .page-header {
        padding: 16px;
      }
    }
  `]
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];
  filteredWatchlist: any[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  limit: number = 12; // Increased from 10 to show more items per page
  totalItems: number = 0;
  searchQuery: string = '';
  sortOption: string = 'newest';

  // Genre colors for tags
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

  constructor(
    private movieService: MovieService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.loading = true;
    this.movieService.getWatchlist(this.currentPage, this.limit).subscribe({
      next: (data) => {
        this.watchlist = data.items;
        this.filteredWatchlist = [...this.watchlist];
        this.totalItems = data.pagination.total;
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading watchlist:', err);
        this.message.error('Failed to load watchlist');
        this.loading = false;
      }
    });
  }

  removeFromWatchlist(watchlistId: string): void {
    this.movieService.removeFromWatchlist(watchlistId).subscribe({
      next: () => {
        this.message.success('Removed from watchlist');
        this.watchlist = this.watchlist.filter(item => item.id !== watchlistId);
        this.filteredWatchlist = this.filteredWatchlist.filter(item => item.id !== watchlistId);
        this.totalItems--;
      },
      error: (err) => {
        console.error('Error removing from watchlist:', err);
        this.message.error('Failed to remove from watchlist');
      }
    });
  }

  getPosterUrl(path: string): string {
    if (!path) return 'assets/images/no-poster.jpg';
    return this.movieService.getImageUrl(path, 'w500');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      return 'Today';
    } else if (diffDays <= 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }

  getFullDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadWatchlist();
  }

  sortWatchlist(): void {
    this.applyFilters();
  }

  getGenreColor(genre: string): string {
    return this.genreColors[genre] || 'blue';
  }

  applyFilters(): void {
    // Filter by search query
    let filtered = this.watchlist;
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.movie.title.toLowerCase().includes(query) ||
        (item.movie.overview && item.movie.overview.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (this.sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'titleAsc':
        filtered.sort((a, b) => a.movie.title.localeCompare(b.movie.title));
        break;
      case 'titleDesc':
        filtered.sort((a, b) => b.movie.title.localeCompare(a.movie.title));
        break;
    }

    this.filteredWatchlist = filtered;
  }
}
