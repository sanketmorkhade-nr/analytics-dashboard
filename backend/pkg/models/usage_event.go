package models

import (
	"time"
)

// UsageEvent represents a single usage event in the system
type UsageEvent struct {
	ID                string    `json:"id"`
	CreatedAt         time.Time `json:"created_at"`
	CompanyID         string    `json:"company_id"`
	CompanyName       string    `json:"companyName"` // New field for company name
	Type              string    `json:"type"`
	Content           string    `json:"content"`
	Attribute         string    `json:"attribute"`
	User              string    `json:"user"`     // New field for user information
	Endpoint          string    `json:"endpoint"` // New field for API endpoint
	UpdatedAt         time.Time `json:"updated_at"`
	OriginalTimestamp time.Time `json:"original_timestamp"`
	Value             *float64  `json:"value"`
}

// SearchRequest represents a search and filter request
type SearchRequest struct {
	SearchQuery string            `json:"searchQuery,omitempty"`
	Filters     SearchFilters     `json:"filters,omitempty"`
	Pagination  PaginationRequest `json:"pagination,omitempty"`
}

// SearchFilters represents search and filter criteria
type SearchFilters struct {
	DateRange  *DateRange `json:"dateRange,omitempty"`
	Companies  []string   `json:"companies,omitempty"`
	EventTypes []string   `json:"eventTypes,omitempty"`
	Timeframe  string     `json:"timeframe,omitempty"`
}

// DateRange represents a date range filter
type DateRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

// PaginationRequest represents pagination parameters
type PaginationRequest struct {
	Page     int `json:"page,omitempty"`
	PageSize int `json:"pageSize,omitempty"`
}

// PaginationInfo represents pagination response information
type PaginationInfo struct {
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

// SearchResponse represents a search response
type SearchResponse struct {
	Data         []UsageEvent       `json:"data"`
	Pagination   PaginationInfo     `json:"pagination"`
	Aggregations SearchAggregations `json:"aggregations"`
}

// SearchAggregations represents search result aggregations
type SearchAggregations struct {
	TotalEvents     int              `json:"totalEvents"`
	UniqueCompanies int              `json:"uniqueCompanies"`
	EventTypes      []EventTypeCount `json:"eventTypes"`
}

// EventTypeCount represents event type count information
type EventTypeCount struct {
	Type  string `json:"type"`
	Count int    `json:"count"`
}

// TimeSeriesData represents time series data point
type TimeSeriesData struct {
	Timestamp string `json:"timestamp"`
	Value     int    `json:"value"`
	EventType string `json:"eventType"`
}

// TimeSeriesResponse represents time series response
type TimeSeriesResponse struct {
	Data        []TimeSeriesData `json:"data"`
	Timeframe   string           `json:"timeframe"`
	TotalPoints int              `json:"totalPoints"`
}

// MultiCompanyTimeSeriesResponse represents multi-company time series response
type MultiCompanyTimeSeriesResponse struct {
	Data        []map[string]interface{} `json:"data"`
	Timeframe   string                   `json:"timeframe"`
	TotalPoints int                      `json:"totalPoints"`
}

// MetricsResponse represents metrics response
type MetricsResponse struct {
	TotalEvents     int              `json:"totalEvents"`
	ActiveCompanies int              `json:"activeCompanies"`
	TopEventTypes   []EventTypeCount `json:"topEventTypes"`
	TimeRange       TimeRange        `json:"timeRange"`
}

// TimeRange represents a time range
type TimeRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

// Company represents company information
type Company struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	EventCount int    `json:"eventCount"`
}

// CompaniesResponse represents companies response
type CompaniesResponse struct {
	Data  []Company `json:"data"`
	Total int       `json:"total"`
}

// CompanyAnalytics represents company analytics data
type CompanyAnalytics struct {
	CompanyID    string    `json:"company_id"`
	Name         string    `json:"name"`
	EventCount   int       `json:"event_count"`
	Percentage   float64   `json:"percentage"`
	LastActivity time.Time `json:"last_activity"`
}

// CompanyAnalyticsResponse represents company analytics response
type CompanyAnalyticsResponse struct {
	Data  []CompanyAnalytics `json:"data"`
	Total int                `json:"total"`
}

// EventDistribution represents event distribution data
type EventDistribution struct {
	Type       string  `json:"type"`
	Count      int     `json:"count"`
	Percentage float64 `json:"percentage"`
	Companies  int     `json:"companies"`
}

// UserActivity represents user activity data
type UserActivity struct {
	User         string    `json:"user"`
	EventCount   int       `json:"eventCount"`
	Companies    int       `json:"companies"`
	CompanyNames []string  `json:"companyNames"`
	LastActivity time.Time `json:"lastActivity"`
}

// EndpointActivity represents endpoint activity data
type EndpointActivity struct {
	Endpoint     string  `json:"endpoint"`
	EventCount   int     `json:"eventCount"`
	UserCount    int     `json:"userCount"`
	CompanyCount int     `json:"companyCount"`
	Percentage   float64 `json:"percentage"`
}

// CompanyActivity represents company activity data
type CompanyActivity struct {
	CompanyName   string    `json:"companyName"`
	EventCount    int       `json:"eventCount"`
	UserCount     int       `json:"userCount"`
	EndpointCount int       `json:"endpointCount"`
	LastActivity  time.Time `json:"lastActivity"`
}

// CompanyActivityResponse represents company activity response
type CompanyActivityResponse struct {
	Data  []CompanyActivity `json:"data"`
	Total int               `json:"total"`
}

// EndpointActivityResponse represents endpoint activity response
type EndpointActivityResponse struct {
	Data  []EndpointActivity `json:"data"`
	Total int                `json:"total"`
}

// UserActivityResponse represents user activity response
type UserActivityResponse struct {
	Data  []UserActivity `json:"data"`
	Total int            `json:"total"`
}

// EventDistributionResponse represents event distribution response
type EventDistributionResponse struct {
	Data  []EventDistribution `json:"data"`
	Total int                 `json:"total"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error ErrorDetails `json:"error"`
}

// ErrorDetails represents error details
type ErrorDetails struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}
