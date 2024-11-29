package main

import (
	"log"
	"nmc/models"
	"nmc/routers"
)

func main() {
	// gin.SetMode(gin.DebugMode)

	models.ConnectDatabase()

	r := routers.SetupRouter()

	// Start the server
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
