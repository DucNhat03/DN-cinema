package main

import (
	"log"
	"net/http"

	"ducnhat_cinema/api/movie"
	"ducnhat_cinema/api/watchlist"
	"ducnhat_cinema/auth"
	"ducnhat_cinema/config"
	"ducnhat_cinema/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Connect to database
	config.ConnectDB(cfg)
	defer config.DisconnectDB()

	// Create Gin router
	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CorsMiddleware(cfg))

	// Setup routes
	router.GET("/api/health", healthCheck)
	auth.SetupRoutes(router, cfg)
	movie.SetupRoutes(router, cfg)
	watchlist.SetupRoutes(router, cfg)

	// Run server
	log.Printf("Server running on port %s\n", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, router))
}

// healthCheck is a simple endpoint to check if the server is running
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"data": gin.H{
			"service": "Ducnhat Cinema API",
			"version": "1.0.0",
		},
	})
}
