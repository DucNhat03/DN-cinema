package movie

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"ducnhat_cinema/api/tmdb"
	"ducnhat_cinema/config"
	"ducnhat_cinema/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Handler handles movie-related requests
type Handler struct {
	cfg        *config.Config
	tmdbClient *tmdb.Client
}

// NewHandler creates a new movie handler
func NewHandler(cfg *config.Config) *Handler {
	tmdbClient := tmdb.NewClient(cfg.TMDBAPIKey, cfg.TMDBAPIToken)
	return &Handler{
		cfg:        cfg,
		tmdbClient: tmdbClient,
	}
}

// SearchMovies searches for movies
func (h *Handler) SearchMovies(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter is required"})
		return
	}

	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	// Search TMDB
	result, err := h.tmdbClient.SearchMovies(query, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search movies: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetPopularMovies gets popular movies
func (h *Handler) GetPopularMovies(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	// Get popular movies from TMDB
	result, err := h.tmdbClient.GetPopularMovies(page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get popular movies: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetTopRatedMovies gets top rated movies
func (h *Handler) GetTopRatedMovies(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	// Get top rated movies from TMDB
	result, err := h.tmdbClient.GetTopRatedMovies(page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get top rated movies: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetNowPlayingMovies gets now playing movies
func (h *Handler) GetNowPlayingMovies(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	// Get now playing movies from TMDB
	result, err := h.tmdbClient.GetNowPlayingMovies(page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get now playing movies: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetUpcomingMovies gets upcoming movies
func (h *Handler) GetUpcomingMovies(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	// Get upcoming movies from TMDB
	result, err := h.tmdbClient.GetUpcomingMovies(page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get upcoming movies: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetMovieDetails gets details for a specific movie
func (h *Handler) GetMovieDetails(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	// Try to get movie from our database first
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var movie models.Movie
	err = config.MovieCollection.FindOne(ctx, bson.M{"tmdbId": id}).Decode(&movie)

	// If not found in our database, fetch from TMDB and save
	if err != nil {
		// Get movie details from TMDB
		tmdbMovie, err := h.tmdbClient.GetMovie(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get movie details: " + err.Error()})
			return
		}

		// Convert TMDB movie to our movie model
		movie = h.convertTMDBMovieToModel(*tmdbMovie)

		// Save movie to database
		_, err = config.MovieCollection.InsertOne(ctx, movie)
		if err != nil {
			// Log error but continue - we'll just return the movie without saving
			// This would be properly logged in a production app
		}
	}

	// Get review summary
	var reviewSummary models.ReviewSummary
	err = config.ReviewCollection.FindOne(ctx, bson.M{"movieId": movie.ID}).Decode(&reviewSummary)
	if err == nil {
		movie.AverageRating = reviewSummary.AverageRating
		movie.ReviewCount = reviewSummary.TotalReviews
	}

	c.JSON(http.StatusOK, movie.ToResponse())
}

// GetMovieReviews gets reviews for a specific movie
func (h *Handler) GetMovieReviews(c *gin.Context) {
	movieIDStr := c.Param("id")
	movieID, err := primitive.ObjectIDFromHex(movieIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	pageStr := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		limit = 10
	}

	// Get movie reviews
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find reviews for the movie
	skip := (page - 1) * limit
	findOptions := options.Find().
		SetSort(bson.M{"createdAt": -1}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	cursor, err := config.ReviewCollection.Find(ctx, bson.M{"movieId": movieID}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get reviews"})
		return
	}
	defer cursor.Close(ctx)

	// Decode reviews
	var reviews []models.Review
	if err := cursor.All(ctx, &reviews); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode reviews"})
		return
	}

	// Get user information for each review
	var reviewsWithUser []models.ReviewWithUser
	for _, review := range reviews {
		var user models.User
		err := config.UserCollection.FindOne(ctx, bson.M{"_id": review.UserID}).Decode(&user)
		if err != nil {
			// Skip this review if user not found
			continue
		}

		reviewWithUser := models.ReviewWithUser{
			ID:        review.ID,
			MovieID:   review.MovieID,
			User:      user.ToResponse(),
			Rating:    review.Rating,
			Content:   review.Content,
			CreatedAt: review.CreatedAt,
			UpdatedAt: review.UpdatedAt,
		}
		reviewsWithUser = append(reviewsWithUser, reviewWithUser)
	}

	// Count total reviews
	totalReviews, err := config.ReviewCollection.CountDocuments(ctx, bson.M{"movieId": movieID})
	if err != nil {
		totalReviews = 0
	}

	c.JSON(http.StatusOK, gin.H{
		"reviews":      reviewsWithUser,
		"page":         page,
		"limit":        limit,
		"totalReviews": totalReviews,
		"totalPages":   (totalReviews + int64(limit) - 1) / int64(limit),
	})
}

// GetSimilarMovies gets similar movies to a specific movie
func (h *Handler) GetSimilarMovies(c *gin.Context) {
	idStr := c.Param("id")
	movieID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	// Get the TMDB ID from our database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var movie models.Movie
	err = config.MovieCollection.FindOne(ctx, bson.M{"_id": movieID}).Decode(&movie)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	// Call TMDB API to get similar movies
	similarMovies, err := h.tmdbClient.GetSimilarMovies(movie.TMDBID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get similar movies: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"movies": similarMovies})
}

// CheckWatchlistStatus checks if a movie is in the user's watchlist
func (h *Handler) CheckWatchlistStatus(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Get user ObjectID from context - it's already a primitive.ObjectID, no need to convert
	userObjID, ok := userID.(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Get movie ID from URL
	movieIDStr := c.Param("id")
	movieID, err := primitive.ObjectIDFromHex(movieIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID"})
		return
	}

	// Check if movie is in watchlist
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	count, err := config.WatchlistCollection.CountDocuments(ctx, bson.M{
		"userId":  userObjID,
		"movieId": movieID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check watchlist status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"inWatchlist": count > 0,
	})
}

// convertTMDBMovieToModel converts a TMDB movie to our movie model
func (h *Handler) convertTMDBMovieToModel(tmdbMovie tmdb.Movie) models.Movie {
	now := time.Now()
	movie := models.Movie{
		ID:           primitive.NewObjectID(),
		TMDBID:       tmdbMovie.ID,
		Title:        tmdbMovie.Title,
		Overview:     tmdbMovie.Overview,
		PosterPath:   tmdbMovie.PosterPath,
		BackdropPath: tmdbMovie.BackdropPath,
		ReleaseDate:  tmdbMovie.ReleaseDate,
		Popularity:   tmdbMovie.Popularity,
		VoteAverage:  tmdbMovie.VoteAverage,
		VoteCount:    tmdbMovie.VoteCount,
		Runtime:      tmdbMovie.Runtime,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	// Add genres
	if tmdbMovie.Genres != nil {
		for _, genre := range tmdbMovie.Genres {
			movie.Genres = append(movie.Genres, models.Genre{
				ID:   genre.ID,
				Name: genre.Name,
			})
		}
	}

	// Add trailer if available
	if tmdbMovie.Videos != nil && len(tmdbMovie.Videos.Results) > 0 {
		for _, video := range tmdbMovie.Videos.Results {
			if video.Type == "Trailer" && video.Site == "YouTube" {
				movie.TrailerKey = video.Key
				break
			}
		}
	}

	// Add cast
	if tmdbMovie.Credits != nil && len(tmdbMovie.Credits.Cast) > 0 {
		// Limit to 10 cast members
		castLimit := 10
		if len(tmdbMovie.Credits.Cast) < castLimit {
			castLimit = len(tmdbMovie.Credits.Cast)
		}

		for i := 0; i < castLimit; i++ {
			tmdbCast := tmdbMovie.Credits.Cast[i]
			movie.Cast = append(movie.Cast, models.Cast{
				ID:          tmdbCast.ID,
				Name:        tmdbCast.Name,
				Character:   tmdbCast.Character,
				ProfilePath: tmdbCast.ProfilePath,
			})
		}
	}

	// Add director
	if tmdbMovie.Credits != nil && len(tmdbMovie.Credits.Crew) > 0 {
		for _, crew := range tmdbMovie.Credits.Crew {
			if crew.Job == "Director" {
				movie.Director = crew.Name
				break
			}
		}
	}

	return movie
}
