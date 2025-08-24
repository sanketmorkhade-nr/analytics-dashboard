package main

import (
	"log"

	"analytics-dashboard/internal/api"
	"analytics-dashboard/internal/config"
	"analytics-dashboard/internal/services"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize data service
	dataService, err := services.NewDataService(cfg.DataPath)
	if err != nil {
		log.Fatalf("Failed to initialize data service: %v", err)
	}

	// Load CSV data
	if err := dataService.LoadData(); err != nil {
		log.Fatalf("Failed to load data: %v", err)
	}

	log.Printf("Successfully loaded %d events from CSV", dataService.GetTotalEvents())

	// Initialize and start server
	server := api.NewServer(cfg, dataService)

	log.Printf("Starting server on port %s", cfg.Port)
	if err := server.Start(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
