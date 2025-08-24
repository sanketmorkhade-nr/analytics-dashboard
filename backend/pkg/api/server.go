package api

import (
	"fmt"
	"net/http"

	"analytics-dashboard/pkg/api/handlers"
	"analytics-dashboard/pkg/config"
	"analytics-dashboard/pkg/services"

	"github.com/gin-gonic/gin"
)

// Server represents the HTTP server
type Server struct {
	config      *config.Config
	dataService *services.DataService
	router      *gin.Engine
}

// NewServer creates a new server instance
func NewServer(cfg *config.Config, dataService *services.DataService) *Server {
	server := &Server{
		config:      cfg,
		dataService: dataService,
		router:      gin.Default(),
	}

	server.setupRoutes()
	return server
}

// setupRoutes configures all API routes
func (s *Server) setupRoutes() {
	// Enable CORS for development
	s.router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// API v1 routes
	v1 := s.router.Group("/api/v1")
	{
		// Initialize handlers
		eventHandler := handlers.NewEventHandler(s.dataService)

		// Event routes - Unified endpoint
		v1.GET("/events", eventHandler.GetEvents)                  // Unified search and filtering
		v1.GET("/events/metrics", eventHandler.GetFilteredMetrics) // Filtered metrics

		// Analytics routes
		v1.GET("/trends", eventHandler.GetTimeSeriesData)
		v1.GET("/trends/multi-company", eventHandler.GetMultiCompanyTrends) // New multi-company trends endpoint
		v1.GET("/metrics", eventHandler.GetMetrics)
		v1.GET("/companies", eventHandler.GetCompanies)
		v1.GET("/event-types", eventHandler.GetEventTypes)

		// Advanced analytics routes
		analytics := v1.Group("/analytics")
		{
			analytics.GET("/companies", eventHandler.GetTopActiveCompanies)
			analytics.GET("/event-distribution", eventHandler.GetEventDistribution)
			analytics.GET("/top-events", eventHandler.GetTopEventsByVolume)
			analytics.GET("/active-users", eventHandler.GetMostActiveUsers)
			analytics.GET("/top-endpoints", eventHandler.GetTopEndpointsByUsage)
			analytics.GET("/top-companies", eventHandler.GetTopActiveCompaniesWithFiltering)
		}
	}

	// Health check endpoint
	s.router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "Analytics Dashboard API is running",
		})
	})

	// Root endpoint
	s.router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Analytics Dashboard API",
			"version": "1.0.0",
			"endpoints": gin.H{
				"health":      "/health",
				"events":      "/api/v1/events",
				"trends":      "/api/v1/trends",
				"metrics":     "/api/v1/metrics",
				"companies":   "/api/v1/companies",
				"event_types": "/api/v1/event-types",
				"analytics":   "/api/v1/analytics",
			},
		})
	})
}

// Start starts the HTTP server
func (s *Server) Start() error {
	addr := fmt.Sprintf(":%s", s.config.Port)
	return s.router.Run(addr)
}
