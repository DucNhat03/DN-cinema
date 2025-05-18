import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { MovieListItem } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    <div class="container">
      <h1 class="section-title">Welcome to Ducnhat Cinema</h1>

      <section>
        <div class="section-header">
          <h2>Popular Movies</h2>
          <a [routerLink]="['/movies/popular']" class="view-more">View All</a>
        </div>
        <div class="movie-grid">
          <div *ngFor="let movie of popularMovies" class="movie-item">
            <app-movie-card [movie]="movie"></app-movie-card>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2>Now Playing</h2>
          <a [routerLink]="['/movies/now-playing']" class="view-more">View All</a>
        </div>
        <div class="movie-grid">
          <div *ngFor="let movie of nowPlayingMovies" class="movie-item">
            <app-movie-card [movie]="movie"></app-movie-card>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <h2>Upcoming Movies</h2>
          <a [routerLink]="['/movies/upcoming']" class="view-more">View All</a>
        </div>
        <div class="movie-grid">
          <div *ngFor="let movie of upcomingMovies" class="movie-item">
            <app-movie-card [movie]="movie"></app-movie-card>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    .section-title {
      font-size: 2em;
      margin-bottom: 24px;
      color: #001529;
    }
    section {
      margin-bottom: 40px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

    }
    .view-more {
      color: #1890ff;
    }
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    @media (max-width: 768px) {
      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  popularMovies: MovieListItem[] = [];
  nowPlayingMovies: MovieListItem[] = [];
  upcomingMovies: MovieListItem[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadPopularMovies();
    this.loadNowPlayingMovies();
    this.loadUpcomingMovies();
  }

  loadPopularMovies(): void {
    this.movieService.getPopularMovies().subscribe(data => {
      this.popularMovies = data.results.slice(0, 6);
    });
  }

  loadNowPlayingMovies(): void {
    this.movieService.getNowPlayingMovies().subscribe(data => {
      this.nowPlayingMovies = data.results.slice(0, 6);
    });
  }

  loadUpcomingMovies(): void {
    this.movieService.getUpcomingMovies().subscribe(data => {
      this.upcomingMovies = data.results.slice(0, 6);
    });
  }
}
