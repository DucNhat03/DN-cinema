package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user in the system
type User struct {
	ID              primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name            string             `json:"name" bson:"name"`
	Email           string             `json:"email" bson:"email"`
	Password        string             `json:"password,omitempty" bson:"password,omitempty"`
	Avatar          string             `json:"avatar,omitempty" bson:"avatar,omitempty"`
	Role            string             `json:"role" bson:"role"`
	IsVerified      bool               `json:"isVerified" bson:"isVerified"`
	GoogleID        string             `json:"googleId,omitempty" bson:"googleId,omitempty"`
	VerificationCode string            `json:"-" bson:"verificationCode,omitempty"`
	ResetPasswordToken string          `json:"-" bson:"resetPasswordToken,omitempty"`
	ResetPasswordExpire time.Time      `json:"-" bson:"resetPasswordExpire,omitempty"`
	CreatedAt       time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt       time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// UserResponse is the user response without sensitive information
type UserResponse struct {
	ID         primitive.ObjectID `json:"id"`
	Name       string             `json:"name"`
	Email      string             `json:"email"`
	Avatar     string             `json:"avatar,omitempty"`
	Role       string             `json:"role"`
	IsVerified bool               `json:"isVerified"`
	CreatedAt  time.Time          `json:"createdAt"`
}

// ToResponse converts a User to UserResponse
func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:         u.ID,
		Name:       u.Name,
		Email:      u.Email,
		Avatar:     u.Avatar,
		Role:       u.Role,
		IsVerified: u.IsVerified,
		CreatedAt:  u.CreatedAt,
	}
}

// RegisterRequest represents a user registration request
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest represents a user login request
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UpdateProfileRequest represents a profile update request
type UpdateProfileRequest struct {
	Name   string `json:"name" binding:"required"`
	Avatar string `json:"avatar"`
}

// ForgotPasswordRequest represents a forgot password request
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest represents a reset password request
type ResetPasswordRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
} 