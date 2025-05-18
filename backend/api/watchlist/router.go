package watchlist

import (
	"ducnhat_cinema/config"
	"ducnhat_cinema/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the watchlist routes
func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	handler := NewHandler(cfg)

	// All watchlist routes require authentication
	watchlistGroup := router.Group("/api/watchlist")
	watchlistGroup.Use(middleware.AuthMiddleware(cfg))
	{
		watchlistGroup.GET("", handler.GetWatchlist)
		watchlistGroup.POST("", handler.AddToWatchlist)
		watchlistGroup.DELETE("/:id", handler.RemoveFromWatchlist)
	}
}
