package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"analytics-dashboard/internal/models"
	"analytics-dashboard/internal/services"

	"github.com/gin-gonic/gin"
)

// EventHandler handles event-related API requests
type EventHandler struct {
	dataService *services.DataService
}

// NewEventHandler creates a new event handler
func NewEventHandler(dataService *services.DataService) *EventHandler {
	return &EventHandler{
		dataService: dataService,
	}
}

// GetEvents handles GET /api/v1/events with unified search and filtering
func (h *EventHandler) GetEvents(c *gin.Context) {
	// Parse query parameters
	query := c.Query("query")
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	company := c.Query("company")
	companiesStr := c.Query("companies") // Support comma-separated companies
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))

	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	// Create search request
	searchReq := models.SearchRequest{
		SearchQuery: query,
		Filters: models.SearchFilters{
			Companies: []string{},
		},
		Pagination: models.PaginationRequest{
			Page:     page,
			PageSize: pageSize,
		},
	}

	// Only add date range if provided
	if startDate != "" && endDate != "" {
		searchReq.Filters.DateRange = &models.DateRange{
			Start: startDate,
			End:   endDate,
		}
	}

	// Add company filter if provided (support both single and comma-separated companies)
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
		searchReq.Filters.Companies = companies
	} else if company != "" {
		// Backward compatibility: support single company parameter
		searchReq.Filters.Companies = []string{company}
	}

	// Get events and metrics
	response := h.dataService.SearchEvents(searchReq)

	// Combine response without metrics (metrics will be fetched separately)
	c.JSON(http.StatusOK, gin.H{
		"events": response.Data,
		"pagination": gin.H{
			"currentPage": response.Pagination.Page,
			"totalPages":  response.Pagination.TotalPages,
			"totalItems":  response.Pagination.Total,
			"pageSize":    response.Pagination.PageSize,
			"hasNext":     response.Pagination.Page < response.Pagination.TotalPages,
			"hasPrev":     response.Pagination.Page > 1,
		},
	})
}

// GetTimeSeriesData handles GET /api/v1/trends
func (h *EventHandler) GetTimeSeriesData(c *gin.Context) {
	timeframe := c.Query("timeframe")
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies")
	eventTypesStr := c.Query("eventTypes")

	// Validate required parameters
	if timeframe == "" || startDate == "" || endDate == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: models.ErrorDetails{
				Code:    "MISSING_PARAMETERS",
				Message: "timeframe, startDate, and endDate are required",
			},
		})
		return
	}

	// Validate timeframe
	if timeframe != "daily" && timeframe != "weekly" && timeframe != "monthly" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: models.ErrorDetails{
				Code:    "INVALID_TIMEFRAME",
				Message: "timeframe must be one of: daily, weekly, monthly",
			},
		})
		return
	}

	// Parse optional arrays
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
	}

	var eventTypes []string
	if eventTypesStr != "" {
		eventTypes = strings.Split(eventTypesStr, ",")
	}

	response := h.dataService.GetTimeSeriesData(timeframe, startDate, endDate, companies, eventTypes)
	c.JSON(http.StatusOK, response)
}

// GetMultiCompanyTrends handles GET /api/v1/trends/multi-company for multi-line chart
func (h *EventHandler) GetMultiCompanyTrends(c *gin.Context) {
	timeframe := c.Query("timeframe")
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies") // Support comma-separated companies
	eventTypesStr := c.Query("eventTypes")

	// Validate required parameters
	if startDate == "" || endDate == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: models.ErrorDetails{
				Code:    "MISSING_PARAMETERS",
				Message: "startDate and endDate are required",
			},
		})
		return
	}

	// Default to daily if timeframe is not provided
	if timeframe == "" {
		timeframe = "daily"
	}

	// Parse comma-separated companies
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
	}

	// Parse comma-separated event types
	var eventTypes []string
	if eventTypesStr != "" {
		eventTypes = strings.Split(eventTypesStr, ",")
		// Trim whitespace from each event type
		for i, eventType := range eventTypes {
			eventTypes[i] = strings.TrimSpace(eventType)
		}
	}

	// If no companies specified, get data for all companies
	if len(companies) == 0 {
		allCompanies := h.dataService.GetAllCompanyNames()
		companies = allCompanies
	}

	response := h.dataService.GetMultiCompanyTimeSeriesData(timeframe, startDate, endDate, companies, eventTypes)
	c.JSON(http.StatusOK, response)
}

// GetMetrics handles GET /api/v1/metrics
func (h *EventHandler) GetMetrics(c *gin.Context) {
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies")
	eventTypesStr := c.Query("eventTypes")

	// Parse comma-separated companies
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
	}

	// Parse comma-separated event types
	var eventTypes []string
	if eventTypesStr != "" {
		eventTypes = strings.Split(eventTypesStr, ",")
		// Trim whitespace from each event type
		for i, eventType := range eventTypes {
			eventTypes[i] = strings.TrimSpace(eventType)
		}
	}

	response := h.dataService.GetMetrics(startDate, endDate, companies, eventTypes)
	c.JSON(http.StatusOK, response)
}

// GetFilteredMetrics handles GET /api/v1/events/metrics
func (h *EventHandler) GetFilteredMetrics(c *gin.Context) {
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	company := c.Query("company")
	companiesStr := c.Query("companies") // Support comma-separated companies

	// Calculate metrics for the filtered results
	var companiesList []string
	if companiesStr != "" {
		companiesList = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companiesList {
			companiesList[i] = strings.TrimSpace(companyName)
		}
	} else if company != "" {
		// Backward compatibility: support single company parameter
		companiesList = []string{company}
	}
	metrics := h.dataService.GetMetrics(startDate, endDate, companiesList, []string{})

	// Calculate additional metrics
	topEventType := "N/A"
	topEventCount := 0
	if len(metrics.TopEventTypes) > 0 {
		topEventType = metrics.TopEventTypes[0].Type
		topEventCount = metrics.TopEventTypes[0].Count
	}

	avgEventsPerCompany := 0
	if metrics.ActiveCompanies > 0 {
		avgEventsPerCompany = metrics.TotalEvents / metrics.ActiveCompanies
	}

	// Calculate unique users from filtered events
	uniqueUsers := h.dataService.GetUniqueUsersCount(startDate, endDate, companiesList)

	c.JSON(http.StatusOK, gin.H{
		"totalEvents":         metrics.TotalEvents,
		"uniqueCompanies":     metrics.ActiveCompanies,
		"uniqueUsers":         uniqueUsers,
		"topEventType":        topEventType,
		"topEventCount":       topEventCount,
		"avgEventsPerCompany": avgEventsPerCompany,
	})
}

// GetCompanies handles GET /api/v1/companies
func (h *EventHandler) GetCompanies(c *gin.Context) {
	response := h.dataService.GetCompanies()
	c.JSON(http.StatusOK, response)
}

// GetEventTypes handles GET /api/v1/event-types
func (h *EventHandler) GetEventTypes(c *gin.Context) {
	response := h.dataService.GetEventDistribution()
	c.JSON(http.StatusOK, response)
}

// GetTopActiveCompanies handles GET /api/v1/analytics/companies
func (h *EventHandler) GetTopActiveCompanies(c *gin.Context) {
	response := h.dataService.GetTopActiveCompanies()
	c.JSON(http.StatusOK, response)
}

// GetEventDistribution handles GET /api/v1/analytics/event-distribution
func (h *EventHandler) GetEventDistribution(c *gin.Context) {
	response := h.dataService.GetEventDistribution()
	c.JSON(http.StatusOK, response)
}

// GetTopEventsByVolume handles GET /api/v1/analytics/top-events
func (h *EventHandler) GetTopEventsByVolume(c *gin.Context) {
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Parse comma-separated companies
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
	}

	response := h.dataService.GetTopEventsByVolume(startDate, endDate, companies, limit)
	c.JSON(http.StatusOK, gin.H{
		"data":  response,
		"total": len(response),
	})
}

// GetMostActiveUsers handles GET /api/v1/analytics/active-users
func (h *EventHandler) GetMostActiveUsers(c *gin.Context) {
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Parse comma-separated companies
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
	}

	response := h.dataService.GetMostActiveUsers(startDate, endDate, companies, limit)
	c.JSON(http.StatusOK, gin.H{
		"data":  response,
		"total": len(response),
	})
}

// GetTopEndpointsByUsage handles GET /api/v1/analytics/top-endpoints
func (h *EventHandler) GetTopEndpointsByUsage(c *gin.Context) {
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Parse comma-separated companies
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
	}

	response := h.dataService.GetTopEndpointsByUsage(startDate, endDate, companies, limit)
	c.JSON(http.StatusOK, gin.H{
		"data":  response,
		"total": len(response),
	})
}

// GetTopActiveCompaniesWithFiltering handles GET /api/v1/analytics/top-companies
func (h *EventHandler) GetTopActiveCompaniesWithFiltering(c *gin.Context) {
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	companiesStr := c.Query("companies")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Parse comma-separated companies
	var companies []string
	if companiesStr != "" {
		companies = strings.Split(companiesStr, ",")
		// Trim whitespace from each company name
		for i, companyName := range companies {
			companies[i] = strings.TrimSpace(companyName)
		}
	}

	response := h.dataService.GetTopActiveCompaniesWithFiltering(startDate, endDate, companies, limit)
	c.JSON(http.StatusOK, gin.H{
		"data":  response,
		"total": len(response),
	})
}
