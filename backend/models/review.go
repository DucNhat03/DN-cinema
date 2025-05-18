package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Review represents a movie review
type Review struct {
	ID        primitive.ObjectID  `json:"id" bson:"_id,omitempty"`
	MovieID   primitive.ObjectID  `json:"movieId" bson:"movieId"`
	UserID    primitive.ObjectID  `json:"userId" bson:"userId"`
	Rating    int                 `json:"rating" bson:"rating"`
	Content   string              `json:"content" bson:"content"`
	CreatedAt time.Time           `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time           `json:"updatedAt" bson:"updatedAt"`
}

// ReviewWithUser represents a review with user information
type ReviewWithUser struct {
	ID        primitive.ObjectID  `json:"id"`
	MovieID   primitive.ObjectID  `json:"movieId"`
	User      UserResponse        `json:"user"`
	Rating    int                 `json:"rating"`
	Content   string              `json:"content"`
	CreatedAt time.Time           `json:"createdAt"`
	UpdatedAt time.Time           `json:"updatedAt"`
}

// CreateReviewRequest represents a request to create a review
type CreateReviewRequest struct {
	MovieID primitive.ObjectID `json:"movieId" binding:"required"`
	Rating  int                `json:"rating" binding:"required,min=1,max=10"`
	Content string             `json:"content" binding:"required"`
}

// UpdateReviewRequest represents a request to update a review
type UpdateReviewRequest struct {
	Rating  int    `json:"rating" binding:"required,min=1,max=10"`
	Content string `json:"content" binding:"required"`
}

// ReviewSummary represents a summary of reviews for a movie
type ReviewSummary struct {
	AverageRating float64 `json:"averageRating"`
	TotalReviews  int     `json:"totalReviews"`
} 