import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieListResponse, ReviewsResponse, Review } from '../../shared/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = `${environment.apiUrl}/api/movies`;
  similarMovies: any[] = [];
  currentUser: any = null; // Add this property, type as needed

  constructor(private http: HttpClient) { }

  searchMovies(query: string, page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/search?query=${query}&page=${page}`);
  }

  getPopularMovies(page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/popular?page=${page}`);
  }

  getTopRatedMovies(page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/top-rated?page=${page}`);
  }

  getNowPlayingMovies(page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/now-playing?page=${page}`);
  }

  getUpcomingMovies(page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/upcoming?page=${page}`);
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  getMovieReviews(movieId: string, page: number = 1, limit: number = 10): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/${movieId}/reviews?page=${page}&limit=${limit}`);
  }

  createReview(movieId: string, rating: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${movieId}/reviews`, { movieId, rating, content });
  }

  updateReview(movieId: string, reviewId: string, rating: number, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${movieId}/reviews/${reviewId}`, { rating, content });
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reviews/${reviewId}`);
  }

  addToWatchlist(movieId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/watchlist`, { movieId });
  }

  removeFromWatchlist(watchlistId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/watchlist/${watchlistId}`);
  }

  removeFromWatchlistByMovieId(movieId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/watchlist/movie/${movieId}`);
  }

  getWatchlist(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/watchlist?page=${page}&limit=${limit}`);
  }

  checkWatchlistStatus(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/watchlist/status/${movieId}`);
  }

  getSimilarMovies(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${movieId}/similar`);
  }

  rateMovie(movieId: string, rating: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/movies/${movieId}/rating`, { rating });
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return 'assets/images/no-image.png';
    return `${environment.tmdbImageUrl}/${size}${path}`;
  }

  loadSimilarMovies(movieId: string): void {
    this.getSimilarMovies(movieId).subscribe({
      next: (data: any) => {
        this.similarMovies = data.movies.slice(0, 12); // Limit to 12 similar movies
      },
      error: (err: any) => {
        console.error('Error loading similar movies:', err);
      }
    });
  }

  // Removed duplicate checkWatchlistStatus method to resolve duplicate implementation error.

  isCurrentUserReview(review: Review): boolean {
    return Boolean(this.currentUser && review.user.id === this.currentUser?.id);
  }
}
