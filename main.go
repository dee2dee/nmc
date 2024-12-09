package main

import (
	"fmt"
	"log"
	"nmc/models"
	"nmc/routers"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	models.ConnectDatabase()

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	fileUploadPath := os.Getenv("FILE_UPLOAD_PATH")
	if fileUploadPath == "" {
		log.Fatalf("FILE_UPLOAD_PATH is not set in .env")
	}

	fmt.Println("File upload path:", fileUploadPath)

	r := routers.SetupRouter()

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
