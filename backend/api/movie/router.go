package movie

import (
	"ducnhat_cinema/config"
	"ducnhat_cinema/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the movie routes
func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	handler := NewHandler(cfg)

	// Public movie routes
	movieGroup := router.Group("/api/movies")
	{
		movieGroup.GET("/search", handler.SearchMovies)
		movieGroup.GET("/popular", handler.GetPopularMovies)
		movieGroup.GET("/top-rated", handler.GetTopRatedMovies)
		movieGroup.GET("/now-playing", handler.GetNowPlayingMovies)
		movieGroup.GET("/upcoming", handler.GetUpcomingMovies)
		movieGroup.GET("/:id", handler.GetMovieDetails)
		movieGroup.GET("/:id/reviews", handler.GetMovieReviews)
		movieGroup.GET("/:id/similar", handler.GetSimilarMovies)
	}

	// Protected movie routes for creating reviews
	protectedGroup := router.Group("/api/movies")
	protectedGroup.Use(middleware.AuthMiddleware(cfg))
	{
		// These will be implemented in the review handler
		protectedGroup.GET("/watchlist/status/:id", handler.CheckWatchlistStatus)
	}
}
