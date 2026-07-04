package models

import (
	"context"
	"time"

	"github.com/RealMtrx/Discord-Handler-Go/database"
	"go.mongodb.org/mongo-driver/bson"
)

type User struct {
	UserID string `bson:"userId"`
	Points int    `bson:"points"`
}

func GetUser(userID string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	col := database.DB.Collection("users")
	var user User
	err := col.FindOne(ctx, bson.M{"userId": userID}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUser(userID string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user := &User{UserID: userID, Points: 0}
	col := database.DB.Collection("users")
	_, err := col.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
