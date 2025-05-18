package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// WatchlistItem represents a movie in a user's watchlist
type WatchlistItem struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	UserID    primitive.ObjectID `bson:"userID" json:"userID"`
	MovieID   primitive.ObjectID `bson:"movieID" json:"movieID"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
}

// WatchlistWithMovie represents a watchlist item with movie details
type WatchlistWithMovie struct {
	ID        primitive.ObjectID   `json:"id"`
	UserID    primitive.ObjectID   `json:"userId"`
	Movie     MovieResponse        `json:"movie"`
	CreatedAt time.Time            `json:"createdAt"`
}

// AddToWatchlistRequest represents a request to add a movie to watchlist
type AddToWatchlistRequest struct {
	MovieID primitive.ObjectID `json:"movieId" binding:"required"`
}