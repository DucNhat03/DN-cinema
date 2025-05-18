import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { MovieListItem } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { zorroModules } from '../../core/zorro.module';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent, ...zorroModules],
  template: `
    <div class="container">
      <h1 class="page-title">Search Results for "{{ searchQuery }}"</h1>

      <div *ngIf="loading" class="loading-container">
        <nz-spin nzTip="Loading..."></nz-spin>
      </div>

      <ng-container *ngIf="!loading">
        <div *ngIf="movies.length > 0; else noResults" class="movie-grid">
          <div *ngFor="let movie of movies" class="movie-item">
            <app-movie-card [movie]="movie"></app-movie-card>
          </div>
        </div>

        <ng-template #noResults>
          <div class="no-results">
            <nz-empty nzDescription="No movies found matching your search"></nz-empty>
          </div>
        </ng-template>
      </ng-container>
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
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px 0;
    }
    .no-results {
      padding: 48px 0;
      text-align: center;
    }
    @media (max-width: 768px) {
      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class SearchResultsComponent implements OnInit {
  movies: MovieListItem[] = [];
  searchQuery: string = '';
  loading: boolean = true;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      if (this.searchQuery) {
        this.searchMovies();
      } else {
        this.loading = false;
      }
    });
  }

  searchMovies(): void {
    this.loading = true;
    this.movieService.searchMovies(this.searchQuery).subscribe({
      next: (data) => {
        this.movies = data.results;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching movies:', err);
        this.loading = false;
      }
    });
  }
}
