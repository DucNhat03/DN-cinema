package watchlist

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"ducnhat_cinema/config"
	"ducnhat_cinema/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Handler handles watchlist-related requests
type Handler struct {
	cfg *config.Config
}

// NewHandler creates a new watchlist handler
func NewHandler(cfg *config.Config) *Handler {
	return &Handler{
		cfg: cfg,
	}
}

// GetWatchlist gets a user's watchlist
func (h *Handler) GetWatchlist(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}

	// Parse pagination parameters
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

	skip := (page - 1) * limit

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Find watchlist items for the user
	objID := userID.(primitive.ObjectID)

	findOptions := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.M{"createdAt": -1})

	cursor, err := config.WatchlistCollection.Find(ctx, bson.M{"userID": objID}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve watchlist"})
		return
	}
	defer cursor.Close(ctx)

	var watchlistItems []models.WatchlistItem
	if err := cursor.All(ctx, &watchlistItems); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode watchlist items"})
		return
	}

	// Get total count for pagination
	total, err := config.WatchlistCollection.CountDocuments(ctx, bson.M{"userID": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count watchlist items"})
		return
	}

	// Get detailed information about each movie
	var watchlistWithMovies []models.WatchlistWithMovie
	for _, item := range watchlistItems {
		var movie models.Movie
		err := config.MovieCollection.FindOne(ctx, bson.M{"_id": item.MovieID}).Decode(&movie)
		if err != nil {
			// Skip items where the movie can't be found
			continue
		}

		watchlistWithMovies = append(watchlistWithMovies, models.WatchlistWithMovie{
			ID:        item.ID,
			UserID:    item.UserID,
			Movie:     movie.ToResponse(),
			CreatedAt: item.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"items": watchlistWithMovies,
		"pagination": gin.H{
			"total": total,
			"page":  page,
			"limit": limit,
		},
	})
}

// AddToWatchlist adds a movie to a user's watchlist
func (h *Handler) AddToWatchlist(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}

	// Parse request body
	var req models.AddToWatchlistRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if movie exists
	var movie models.Movie
	err := config.MovieCollection.FindOne(ctx, bson.M{"_id": req.MovieID}).Decode(&movie)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Movie not found"})
		return
	}

	// Check if movie is already in watchlist
	userObjID := userID.(primitive.ObjectID)
	count, err := config.WatchlistCollection.CountDocuments(ctx, bson.M{
		"userID":  userObjID,
		"movieID": req.MovieID,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check watchlist"})
		return
	}

	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Movie already in watchlist"})
		return
	}

	// Add movie to watchlist
	watchlistItem := models.WatchlistItem{
		ID:        primitive.NewObjectID(),
		UserID:    userObjID,
		MovieID:   req.MovieID,
		CreatedAt: time.Now(),
	}

	_, err = config.WatchlistCollection.InsertOne(ctx, watchlistItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add movie to watchlist"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":       "Movie added to watchlist",
		"watchlistItem": watchlistItem,
	})
}

// RemoveFromWatchlist removes a movie from a user's watchlist
func (h *Handler) RemoveFromWatchlist(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}

	// Get watchlist item ID from URL
	itemID := c.Param("id")
	watchlistItemID, err := primitive.ObjectIDFromHex(itemID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid watchlist item ID"})
		return
	}

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Delete watchlist item
	userObjID := userID.(primitive.ObjectID)
	result, err := config.WatchlistCollection.DeleteOne(ctx, bson.M{
		"_id":    watchlistItemID,
		"userID": userObjID, // Ensure the item belongs to the user
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove from watchlist"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Watchlist item not found or not owned by user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Removed from watchlist"})
}
