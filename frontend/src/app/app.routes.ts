import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'movies/popular',
    loadComponent: () => import('./features/movie-details/movie-list.component').then(c => c.MovieListComponent),
    data: { type: 'popular', title: 'Popular Movies' }
  },
  {
    path: 'movies/top-rated',
    loadComponent: () => import('./features/movie-details/movie-list.component').then(c => c.MovieListComponent),
    data: { type: 'top-rated', title: 'Top Rated Movies' }
  },
  {
    path: 'movies/now-playing',
    loadComponent: () => import('./features/movie-details/movie-list.component').then(c => c.MovieListComponent),
    data: { type: 'now-playing', title: 'Now Playing Movies' }
  },
  {
    path: 'movies/upcoming',
    loadComponent: () => import('./features/movie-details/movie-list.component').then(c => c.MovieListComponent),
    data: { type: 'upcoming', title: 'Upcoming Movies' }
  },
  {
    path: 'movies/search',
    loadComponent: () => import('./features/search/search-results.component').then(c => c.SearchResultsComponent)
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./features/movie-details/movie-details.component').then(c => c.MovieDetailsComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'profile/watchlist',
    loadComponent: () => import('./features/watchlist/watchlist.component').then(c => c.WatchlistComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
