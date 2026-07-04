package database

import (
	"context"
	"fmt"
	"net"
	"time"

	"github.com/RealMtrx/Discord-Handler-Go/config"
	"github.com/fatih/color"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var DB *mongo.Database

func Connect() bool {
	net.DefaultResolver = &net.Resolver{
		PreferGo: true,
		Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{Timeout: 5 * time.Second}
			return d.DialContext(ctx, "udp", "8.8.8.8:53")
		},
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.App.MongoDBURI))
	if err != nil {
		color.Red("[MongoDB] Connection failed: %v", err)
		return false
	}

	if err := client.Ping(ctx, nil); err != nil {
		color.Red("[MongoDB] Connection failed: %v", err)
		return false
	}

	Client = client
	DB = client.Database("discord_bot")
	color.Green("[MongoDB] Connected successfully")
	return true
}

func Disconnect() {
	if Client != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		Client.Disconnect(ctx)
	}
	fmt.Println("[MongoDB] Disconnected")
}
