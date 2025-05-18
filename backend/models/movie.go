package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Movie represents a movie stored in our database
// This is different from the TMDB movie model as it contains additional information
type Movie struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	TMDBID        int                `json:"tmdbId" bson:"tmdbId"`
	Title         string             `json:"title" bson:"title"`
	Overview      string             `json:"overview" bson:"overview"`
	PosterPath    string             `json:"posterPath" bson:"posterPath"`
	BackdropPath  string             `json:"backdropPath" bson:"backdropPath"`
	ReleaseDate   string             `json:"releaseDate" bson:"releaseDate"`
	Popularity    float64            `json:"popularity" bson:"popularity"`
	VoteAverage   float64            `json:"voteAverage" bson:"voteAverage"`
	VoteCount     int                `json:"voteCount" bson:"voteCount"`
	Runtime       int                `json:"runtime" bson:"runtime"`
	Genres        []Genre            `json:"genres" bson:"genres"`
	TrailerKey    string             `json:"trailerKey,omitempty" bson:"trailerKey,omitempty"`
	Cast          []Cast             `json:"cast,omitempty" bson:"cast,omitempty"`
	Director      string             `json:"director,omitempty" bson:"director,omitempty"`
	AverageRating float64            `json:"averageRating" bson:"averageRating"`
	ReviewCount   int                `json:"reviewCount" bson:"reviewCount"`
	CreatedAt     time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt     time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Genre represents a movie genre
type Genre struct {
	ID   int    `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
}

// Cast represents a cast member
type Cast struct {
	ID          int    `json:"id" bson:"id"`
	Name        string `json:"name" bson:"name"`
	Character   string `json:"character" bson:"character"`
	ProfilePath string `json:"profilePath" bson:"profilePath,omitempty"`
}

// MovieResponse represents a movie response to clients
type MovieResponse struct {
	ID            primitive.ObjectID `json:"id"`
	TMDBID        int                `json:"tmdbId"`
	Title         string             `json:"title"`
	Overview      string             `json:"overview"`
	PosterPath    string             `json:"posterPath"`
	BackdropPath  string             `json:"backdropPath"`
	ReleaseDate   string             `json:"releaseDate"`
	VoteAverage   float64            `json:"voteAverage"`
	Runtime       int                `json:"runtime"`
	Genres        []Genre            `json:"genres"`
	TrailerKey    string             `json:"trailerKey,omitempty"`
	Cast          []Cast             `json:"cast,omitempty"`
	Director      string             `json:"director,omitempty"`
	AverageRating float64            `json:"averageRating"`
	ReviewCount   int                `json:"reviewCount"`
}

// ToResponse converts a Movie to MovieResponse
func (m *Movie) ToResponse() MovieResponse {
	return MovieResponse{
		ID:            m.ID,
		TMDBID:        m.TMDBID,
		Title:         m.Title,
		Overview:      m.Overview,
		PosterPath:    m.PosterPath,
		BackdropPath:  m.BackdropPath,
		ReleaseDate:   m.ReleaseDate,
		VoteAverage:   m.VoteAverage,
		Runtime:       m.Runtime,
		Genres:        m.Genres,
		TrailerKey:    m.TrailerKey,
		Cast:          m.Cast,
		Director:      m.Director,
		AverageRating: m.AverageRating,
		ReviewCount:   m.ReviewCount,
	}
}
