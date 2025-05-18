package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	MongoURI           string
	JWTSecret          string
	GoogleClientID     string
	GoogleClientSecret string
	EmailUser          string
	EmailPass          string
	CloudinaryName     string
	CloudinaryAPIKey   string
	CloudinarySecret   string
	ClientURL          string
	TMDBAPIKey         string
	TMDBAPIToken       string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	} else {
		log.Println("Loaded .env from working directory")
	}

	return &Config{
		Port:               getEnv("PORT", "5000"),
		MongoURI:           getEnv("MONGODB_URI", ""),
		JWTSecret:          getEnv("JWT_SECRET", ""),
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		EmailUser:          getEnv("EMAIL_USER", ""),
		EmailPass:          getEnv("EMAIL_PASS", ""),
		CloudinaryName:     getEnv("CLOUDINARY_CLOUD_NAME", ""),
		CloudinaryAPIKey:   getEnv("CLOUDINARY_API_KEY", ""),
		CloudinarySecret:   getEnv("CLOUDINARY_API_SECRET", ""),
		ClientURL:          getEnv("CLIENT_URL", "http://localhost:4200"),
		TMDBAPIKey:         getEnv("TMDB_API_KEY", ""),
		TMDBAPIToken:       getEnv("TMDB_API_TOKEN", ""),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
