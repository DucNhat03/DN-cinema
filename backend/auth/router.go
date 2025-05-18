package auth

import (
	"ducnhat_cinema/config"
	"ducnhat_cinema/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the authentication routes
func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	handler := NewHandler(cfg)

	// Public routes
	authGroup := router.Group("/api/auth")
	{
		authGroup.POST("/register", handler.Register)
		authGroup.POST("/login", handler.Login)
		authGroup.GET("/verify-email", handler.VerifyEmail)
		authGroup.POST("/forgot-password", handler.ForgotPassword)
		authGroup.POST("/reset-password", handler.ResetPassword)
	}

	// Protected routes
	protectedGroup := router.Group("/api/user")
	protectedGroup.Use(middleware.AuthMiddleware(cfg))
	{
		protectedGroup.GET("/me", handler.GetMe)
		protectedGroup.PATCH("/profile", handler.UpdateProfile)
	}
}
