import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { MovieListItem } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent, NzButtonModule],
  template: `
    <div class="container">
      <h1 class="page-title">{{ title }}</h1>

      <div class="movie-grid">
        <div *ngFor="let movie of movies" class="movie-item">
          <app-movie-card [movie]="movie"></app-movie-card>
        </div>
      </div>

      <div class="pagination">
        <button
          nz-button
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)">
          Previous
        </button>

        <ng-container *ngFor="let page of paginationRange">
          <button
            nz-button
            [disabled]="page === '...'"
            [nzType]="page === currentPage ? 'primary' : 'default'"
            (click)="goToPage(page)"
            class="page-button">
            {{ page }}
          </button>
        </ng-container>

        <button
          nz-button
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-title {
      font-size: 2em;
      margin-bottom: 24px;
      color: #001529;
    }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    .pagination button[nz-button] {
      border-radius: 4px;
      padding: 0 12px;
      height: 36px;
      font-weight: 500;
    }

    .pagination button[nz-button][nzType="primary"] {
      background-color: #1890ff;
      color: #fff;
      border: none;
    }

    .pagination button[nz-button]:disabled {
      background-color: #d9d9d9;
      color: #888;
      cursor: not-allowed;
    }

    .page-button {
      min-width: 36px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }

      .pagination {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies: MovieListItem[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  listType: string = '';
  title: string = '';
  paginationRange: (number | string)[] = [];

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.listType = data['type'];
      this.title = data['title'];
      this.loadMovies();
    });

    this.route.queryParams.subscribe(params => {
      this.currentPage = parseInt(params['page']) || 1;
      this.loadMovies();
    });
  }

  loadMovies(): void {
    switch (this.listType) {
      case 'popular':
        this.loadPopularMovies();
        break;
      case 'top-rated':
        this.loadTopRatedMovies();
        break;
      case 'now-playing':
        this.loadNowPlayingMovies();
        break;
      case 'upcoming':
        this.loadUpcomingMovies();
        break;
    }
  }

  loadPopularMovies(): void {
    this.movieService.getPopularMovies(this.currentPage).subscribe(data => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.updatePagination();
    });
  }

  loadTopRatedMovies(): void {
    this.movieService.getTopRatedMovies(this.currentPage).subscribe(data => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.updatePagination();
    });
  }

  loadNowPlayingMovies(): void {
    this.movieService.getNowPlayingMovies(this.currentPage).subscribe(data => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.updatePagination();
    });
  }

  loadUpcomingMovies(): void {
    this.movieService.getUpcomingMovies(this.currentPage).subscribe(data => {
      this.movies = data.results;
      this.totalPages = data.total_pages;
      this.updatePagination();
    });
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.currentPage = page;
      this.loadMovies();
    }
  }

  updatePagination(): void {
    this.paginationRange = this.getPaginationRange(this.currentPage, this.totalPages);
  }

  getPaginationRange(current: number, total: number): (number | string)[] {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);

    if (left > 2) range.push('...');

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < total - 1) range.push('...');

    if (total > 1) range.push(total);

    return range;
  }
}
