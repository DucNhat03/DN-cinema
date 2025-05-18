package config

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Database connection variables
var (
	Client              *mongo.Client
	UserCollection      *mongo.Collection
	MovieCollection     *mongo.Collection
	ReviewCollection    *mongo.Collection
	WatchlistCollection *mongo.Collection
)

// ConnectDB establishes a connection to the MongoDB database
func ConnectDB(cfg *Config) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(cfg.MongoURI)

	var err error
	Client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Check the connection
	err = Client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	log.Println("Connected to MongoDB!")

	// Initialize collections
	db := Client.Database("ducnhat_cinema")
	UserCollection = db.Collection("users")
	MovieCollection = db.Collection("movies")
	ReviewCollection = db.Collection("reviews")
	WatchlistCollection = db.Collection("watchlists")
}

// DisconnectDB closes the MongoDB connection
func DisconnectDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := Client.Disconnect(ctx); err != nil {
		log.Fatal("Failed to disconnect from MongoDB:", err)
	}
	log.Println("Disconnected from MongoDB")
}
