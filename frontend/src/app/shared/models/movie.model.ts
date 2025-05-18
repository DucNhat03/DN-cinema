export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  genres: { id: number, name: string }[];
  cast?: { id: number, name: string, character: string, profilePath?: string }[];
  crew?: { id: number, name: string, job: string, profilePath?: string }[];
  director?: string;
  writer?: string;
  trailerKey?: string;
  averageRating: number;
  reviewCount: number;
  tagline?: string;
  certification?: string;
  originalTitle?: string;
  originalLanguage?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  homepage?: string;
  imdbId?: string;
  productionCompanies?: { id: number, name: string }[];
  productionCountries?: { iso_3166_1: string, name: string }[];
  spoken_languages?: { iso_639_1: string, name: string }[];
  keywords?: { id: number, name: string }[];
  tmdbId?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface Review {
  id: string;
  movieId: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  page: number;
  limit: number;
  totalReviews: number;
  totalPages: number;
}

export interface MovieListItem {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface MovieListResponse {
  page: number;
  results: MovieListItem[];
  total_results: number;
  total_pages: number;
}
