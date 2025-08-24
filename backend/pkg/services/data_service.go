package services

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"analytics-dashboard/pkg/models"
)

// DataService handles data loading and operations
type DataService struct {
	dataPath   string
	events     []models.UsageEvent
	companies  map[string]string
	eventTypes map[string]int
	loaded     bool
}

// NewDataService creates a new data service instance
func NewDataService(dataPath string) (*DataService, error) {
	return &DataService{
		dataPath:   dataPath,
		companies:  make(map[string]string),
		eventTypes: make(map[string]int),
		loaded:     false,
	}, nil
}

// LoadData loads CSV data into memory
func (ds *DataService) LoadData() error {
	if ds.loaded {
		return nil
	}

	file, err := os.Open(ds.dataPath)
	if err != nil {
		return fmt.Errorf("failed to open CSV file: %w", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true    // Allow unescaped quotes
	reader.FieldsPerRecord = -1 // Allow variable number of fields

	// Skip header row
	_, err = reader.Read()
	if err != nil {
		return fmt.Errorf("failed to read CSV header: %w", err)
	}

	var events []models.UsageEvent
	companyMap := make(map[string]string)
	eventTypeMap := make(map[string]int)

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Warning: failed to read CSV row: %v", err)
			continue
		}

		// Skip rows that don't have enough columns or have too many
		if len(record) != 9 {
			log.Printf("Warning: skipping row with %d columns (expected 9): %v", len(record), record)
			continue
		}

		event, err := ds.parseEvent(record)
		if err != nil {
			log.Printf("Warning: failed to parse event: %v", err)
			continue
		}

		events = append(events, event)

		// Track companies
		companyMap[event.CompanyID] = ds.extractCompanyName(event.Content)

		// Track event types
		eventTypeMap[event.Type]++
	}

	// Sort events by creation time
	sort.Slice(events, func(i, j int) bool {
		return events[i].CreatedAt.Before(events[j].CreatedAt)
	})

	ds.events = events
	ds.companies = companyMap
	ds.eventTypes = eventTypeMap
	ds.loaded = true

	log.Printf("Loaded %d events, %d companies, %d event types",
		len(events), len(companyMap), len(eventTypeMap))

	return nil
}

// parseEvent parses a CSV record into a UsageEvent
func (ds *DataService) parseEvent(record []string) (models.UsageEvent, error) {
	// Parse timestamps with multiple format support
	createdAt, err := ds.parseTimestamp(record[1])
	if err != nil {
		return models.UsageEvent{}, fmt.Errorf("invalid created_at: %w", err)
	}

	updatedAt, err := ds.parseTimestamp(record[6])
	if err != nil {
		return models.UsageEvent{}, fmt.Errorf("invalid updated_at: %w", err)
	}

	originalTimestamp, err := ds.parseTimestamp(record[7])
	if err != nil {
		return models.UsageEvent{}, fmt.Errorf("invalid original_timestamp: %w", err)
	}

	// Parse value (nullable)
	var value *float64
	if record[8] != "null" && record[8] != "" {
		if v, err := strconv.ParseFloat(record[8], 64); err == nil {
			value = &v
		}
	}

	// Extract user and endpoint from content
	user, endpoint := ds.extractUserAndEndpoint(record[4])

	return models.UsageEvent{
		ID:                record[0],
		CreatedAt:         createdAt,
		CompanyID:         record[2],
		Type:              record[3],
		Content:           record[4],
		Attribute:         record[5],
		User:              user,
		Endpoint:          endpoint,
		UpdatedAt:         updatedAt,
		OriginalTimestamp: originalTimestamp,
		Value:             value,
	}, nil
}

// parseTimestamp parses timestamp with multiple format support
func (ds *DataService) parseTimestamp(timestamp string) (time.Time, error) {
	// Try different timestamp formats
	formats := []string{
		"2006-01-02 15:04:05.999999-07",
		"2006-01-02 15:04:05.999999+00",
		"2006-01-02 15:04:05.999999Z",
		"2006-01-02 15:04:05.999999",
		"2006-01-02 15:04:05-07",
		"2006-01-02 15:04:05+00",
		"2006-01-02 15:04:05Z",
		"2006-01-02 15:04:05",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, timestamp); err == nil {
			return t, nil
		}
	}

	return time.Time{}, fmt.Errorf("unable to parse timestamp: %s", timestamp)
}

// extractCompanyName extracts company name from content field
func (ds *DataService) extractCompanyName(content string) string {
	// Content format: "User active CMMS - Company Name email@domain.com /path"
	parts := strings.Split(content, " - ")
	if len(parts) >= 2 {
		companyPart := parts[1]
		// Remove email and path
		if idx := strings.Index(companyPart, " "); idx != -1 {
			return companyPart[:idx]
		}
		return companyPart
	}
	return "Unknown Company"
}

// extractUserAndEndpoint extracts user and endpoint from content field
func (ds *DataService) extractUserAndEndpoint(content string) (string, string) {
	// Content format: "User active CMMS - Company Name email@domain.com /path"
	parts := strings.Split(content, " - ")
	if len(parts) >= 2 {
		companyPart := parts[1]
		// Extract email (user)
		emailParts := strings.Fields(companyPart)
		user := "Unknown User"
		endpoint := "Unknown Endpoint"

		// Find email in the parts
		for _, part := range emailParts {
			if strings.Contains(part, "@") {
				user = part
				break
			}
		}

		// Extract endpoint (path)
		if idx := strings.LastIndex(companyPart, " "); idx != -1 {
			endpoint = companyPart[idx+1:]
		}

		return user, endpoint
	}
	return "Unknown User", "Unknown Endpoint"
}

// GetTotalEvents returns the total number of events
func (ds *DataService) GetTotalEvents() int {
	return len(ds.events)
}

// GetAllEvents returns all events with pagination
func (ds *DataService) GetAllEvents(page, pageSize int) ([]models.UsageEvent, int) {
	if !ds.loaded {
		return []models.UsageEvent{}, 0
	}

	// Apply pagination
	start := (page - 1) * pageSize
	end := start + pageSize

	if start >= len(ds.events) {
		return []models.UsageEvent{}, len(ds.events)
	}

	if end > len(ds.events) {
		end = len(ds.events)
	}

	return ds.events[start:end], len(ds.events)
}

// SearchEvents performs search and filtering on events
func (ds *DataService) SearchEvents(req models.SearchRequest) models.SearchResponse {
	if !ds.loaded {
		log.Printf("Data not loaded, returning empty response")
		return models.SearchResponse{
			Data:         []models.UsageEvent{},
			Pagination:   models.PaginationInfo{},
			Aggregations: models.SearchAggregations{},
		}
	}

	log.Printf("SearchEvents: Starting with %d total events", len(ds.events))

	// Apply filters
	filtered := ds.applyFilters(ds.events, req.Filters)
	log.Printf("SearchEvents: After filtering: %d events", len(filtered))

	// Apply search query
	if req.SearchQuery != "" {
		filtered = ds.applySearch(filtered, req.SearchQuery)
		log.Printf("SearchEvents: After search: %d events", len(filtered))
	}

	// Apply pagination
	page := req.Pagination.Page
	if page <= 0 {
		page = 1
	}
	pageSize := req.Pagination.PageSize
	if pageSize <= 0 || pageSize > 100 {
		pageSize = 20
	}

	start := (page - 1) * pageSize
	end := start + pageSize

	var paginated []models.UsageEvent
	if start < len(filtered) {
		if end > len(filtered) {
			end = len(filtered)
		}
		paginated = filtered[start:end]
	}

	log.Printf("SearchEvents: After pagination: %d events (page %d, size %d)", len(paginated), page, pageSize)

	// Enhance events with company names and user information
	enhancedEvents := ds.enhanceEvents(paginated)

	// Calculate aggregations
	aggregations := ds.calculateAggregations(filtered)

	// Calculate pagination info
	totalPages := (len(filtered) + pageSize - 1) / pageSize

	return models.SearchResponse{
		Data: enhancedEvents,
		Pagination: models.PaginationInfo{
			Page:       page,
			PageSize:   pageSize,
			Total:      len(filtered),
			TotalPages: totalPages,
		},
		Aggregations: aggregations,
	}
}

// enhanceEvents adds company names and user information to events
func (ds *DataService) enhanceEvents(events []models.UsageEvent) []models.UsageEvent {
	log.Printf("Enhancing %d events", len(events))

	enhanced := make([]models.UsageEvent, len(events))

	for i, event := range events {
		enhanced[i] = event

		// Add company name
		if companyName, exists := ds.companies[event.CompanyID]; exists {
			enhanced[i].CompanyName = companyName
		} else {
			enhanced[i].CompanyName = "Unknown Company"
		}

		// Extract user information from content
		user := ds.extractUserFromContent(event.Content)
		enhanced[i].User = user

		// Extract endpoint from content
		endpoint := ds.extractEndpointFromContent(event.Content)
		enhanced[i].Endpoint = endpoint
	}

	log.Printf("Enhanced %d events successfully", len(enhanced))
	return enhanced
}

// extractUserFromContent extracts user information from event content
func (ds *DataService) extractUserFromContent(content string) string {
	// Look for common user patterns in the content
	patterns := []string{
		"user_email:",
		"user_id:",
		"email:",
		"user:",
	}

	contentLower := strings.ToLower(content)
	for _, pattern := range patterns {
		if idx := strings.Index(contentLower, pattern); idx != -1 {
			// Extract the value after the pattern
			start := idx + len(pattern)
			end := strings.Index(content[start:], " ")
			if end == -1 {
				end = len(content) - start
			}
			user := strings.TrimSpace(content[start : start+end])
			if user != "" {
				return user
			}
		}
	}

	// If no specific pattern found, try to extract email-like patterns
	if strings.Contains(content, "@") {
		words := strings.Fields(content)
		for _, word := range words {
			if strings.Contains(word, "@") && strings.Contains(word, ".") {
				return word
			}
		}
	}

	return "Unknown User"
}

// extractEndpointFromContent extracts API endpoint from event content
func (ds *DataService) extractEndpointFromContent(content string) string {
	// Look for common endpoint patterns in the content
	patterns := []string{
		"/v1/",
		"/api/",
		"/work-orders",
		"/chat/",
		"/completions",
	}

	contentLower := strings.ToLower(content)
	for _, pattern := range patterns {
		if idx := strings.Index(contentLower, pattern); idx != -1 {
			// Extract the endpoint starting from the pattern
			endpoint := content[idx:]
			// Find the end of the endpoint (space, newline, or end of string)
			if spaceIdx := strings.IndexAny(endpoint, " \n\t"); spaceIdx != -1 {
				endpoint = endpoint[:spaceIdx]
			}
			// Clean up the endpoint
			endpoint = strings.TrimSpace(endpoint)
			if endpoint != "" {
				return endpoint
			}
		}
	}

	// If no specific pattern found, try to extract any path-like structure
	if strings.Contains(content, "/") {
		words := strings.Fields(content)
		for _, word := range words {
			if strings.HasPrefix(word, "/") && len(word) > 1 {
				return word
			}
		}
	}

	return "N/A"
}

// applyFilters applies filters to events
func (ds *DataService) applyFilters(events []models.UsageEvent, filters models.SearchFilters) []models.UsageEvent {
	log.Printf("applyFilters: Starting with %d events", len(events))

	if filters.DateRange != nil {
		log.Printf("applyFilters: Applying date range filter: %s to %s", filters.DateRange.Start, filters.DateRange.End)
		startDate, _ := time.Parse("2006-01-02", filters.DateRange.Start)
		endDate, _ := time.Parse("2006-01-02", filters.DateRange.End)
		endDate = endDate.Add(24 * time.Hour) // Include the entire end date

		var filtered []models.UsageEvent
		for _, event := range events {
			if event.CreatedAt.After(startDate) && event.CreatedAt.Before(endDate) {
				filtered = append(filtered, event)
			}
		}
		events = filtered
		log.Printf("applyFilters: After date filter: %d events", len(events))
	}

	if len(filters.Companies) > 0 {
		log.Printf("applyFilters: Applying company filter: %v", filters.Companies)
		companySet := make(map[string]bool)
		for _, company := range filters.Companies {
			companySet[company] = true
		}

		var filtered []models.UsageEvent
		for _, event := range events {
			// Get company name from the companies map
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			if companySet[companyName] {
				filtered = append(filtered, event)
			}
		}
		events = filtered
		log.Printf("applyFilters: After company filter: %d events", len(events))
	}

	if len(filters.EventTypes) > 0 {
		log.Printf("applyFilters: Applying event type filter: %v", filters.EventTypes)
		eventTypeSet := make(map[string]bool)
		for _, eventType := range filters.EventTypes {
			eventTypeSet[eventType] = true
		}

		var filtered []models.UsageEvent
		for _, event := range events {
			if eventTypeSet[event.Type] {
				filtered = append(filtered, event)
			}
		}
		events = filtered
		log.Printf("applyFilters: After event type filter: %d events", len(events))
	}

	log.Printf("applyFilters: Final result: %d events", len(events))
	return events
}

// applySearch applies search query to events
func (ds *DataService) applySearch(events []models.UsageEvent, query string) []models.UsageEvent {
	query = strings.ToLower(query)
	var filtered []models.UsageEvent

	for _, event := range events {
		// Get company name from the companies map
		companyName := ds.companies[event.CompanyID]
		if companyName == "" {
			companyName = "Unknown Company"
		}

		if strings.Contains(strings.ToLower(event.Content), query) ||
			strings.Contains(strings.ToLower(event.Attribute), query) ||
			strings.Contains(strings.ToLower(event.Type), query) ||
			strings.Contains(strings.ToLower(companyName), query) ||
			strings.Contains(strings.ToLower(event.User), query) ||
			strings.Contains(strings.ToLower(event.Endpoint), query) {
			filtered = append(filtered, event)
		}
	}

	return filtered
}

// calculateAggregations calculates aggregations for filtered events
func (ds *DataService) calculateAggregations(events []models.UsageEvent) models.SearchAggregations {
	companySet := make(map[string]bool)
	eventTypeCounts := make(map[string]int)

	for _, event := range events {
		companySet[event.CompanyID] = true
		eventTypeCounts[event.Type]++
	}

	var eventTypes []models.EventTypeCount
	for eventType, count := range eventTypeCounts {
		eventTypes = append(eventTypes, models.EventTypeCount{
			Type:  eventType,
			Count: count,
		})
	}

	// Sort event types by count (descending)
	sort.Slice(eventTypes, func(i, j int) bool {
		return eventTypes[i].Count > eventTypes[j].Count
	})

	return models.SearchAggregations{
		TotalEvents:     len(events),
		UniqueCompanies: len(companySet),
		EventTypes:      eventTypes,
	}
}

// GetUniqueUsersCount returns the count of unique users based on filters
func (ds *DataService) GetUniqueUsersCount(startDate, endDate string, companies []string) int {
	if !ds.loaded {
		return 0
	}

	// Filter events
	filtered := ds.events

	// Apply date range filter
	if startDate != "" && endDate != "" {
		start, _ := time.Parse("2006-01-02", startDate)
		end, _ := time.Parse("2006-01-02", endDate)
		end = end.Add(24 * time.Hour)

		var dateFiltered []models.UsageEvent
		for _, event := range filtered {
			if event.CreatedAt.After(start) && event.CreatedAt.Before(end) {
				dateFiltered = append(dateFiltered, event)
			}
		}
		filtered = dateFiltered
	}

	// Apply company filter
	if len(companies) > 0 {
		companySet := make(map[string]bool)
		for _, company := range companies {
			companySet[company] = true
		}
		var companyFiltered []models.UsageEvent
		for _, event := range filtered {
			// Get company name from the companies map
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			if companySet[companyName] {
				companyFiltered = append(companyFiltered, event)
			}
		}
		filtered = companyFiltered
	}

	// Count unique users
	userSet := make(map[string]bool)
	for _, event := range filtered {
		if event.User != "" && event.User != "Unknown User" {
			userSet[event.User] = true
		}
	}

	return len(userSet)
}

// GetAllCompanyNames returns all company names
func (ds *DataService) GetAllCompanyNames() []string {
	if !ds.loaded {
		return []string{}
	}

	companyNames := make([]string, 0, len(ds.companies))
	for _, name := range ds.companies {
		if name != "" {
			companyNames = append(companyNames, name)
		}
	}
	return companyNames
}

// GetMultiCompanyTimeSeriesData returns time series data for multiple companies
func (ds *DataService) GetMultiCompanyTimeSeriesData(timeframe, startDate, endDate string, companies, eventTypes []string) models.MultiCompanyTimeSeriesResponse {
	if !ds.loaded {
		return models.MultiCompanyTimeSeriesResponse{
			Data:        []map[string]interface{}{},
			Timeframe:   timeframe,
			TotalPoints: 0,
		}
	}

	// Parse dates
	start, _ := time.Parse("2006-01-02", startDate)
	end, _ := time.Parse("2006-01-02", endDate)
	end = end.Add(24 * time.Hour)

	// Filter events
	filtered := ds.events

	// Apply company filter
	if len(companies) > 0 {
		companySet := make(map[string]bool)
		for _, company := range companies {
			companySet[company] = true
		}
		var companyFiltered []models.UsageEvent
		for _, event := range filtered {
			// Get company name from the companies map
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			if companySet[companyName] {
				companyFiltered = append(companyFiltered, event)
			}
		}
		filtered = companyFiltered
	}

	// Apply event type filter
	if len(eventTypes) > 0 {
		eventTypeSet := make(map[string]bool)
		for _, eventType := range eventTypes {
			eventTypeSet[eventType] = true
		}
		var eventTypeFiltered []models.UsageEvent
		for _, event := range filtered {
			if eventTypeSet[event.Type] {
				eventTypeFiltered = append(eventTypeFiltered, event)
			}
		}
		filtered = eventTypeFiltered
	}

	// Group events by date and company
	dateCompanyMap := make(map[string]map[string]int)

	for _, event := range filtered {
		if event.CreatedAt.Before(start) || event.CreatedAt.After(end) {
			continue
		}

		// Format date based on timeframe
		var dateKey string
		switch timeframe {
		case "daily":
			dateKey = event.CreatedAt.Format("2006-01-02")
		case "weekly":
			// Get the start of the week (Monday)
			weekStart := event.CreatedAt
			for weekStart.Weekday() != time.Monday {
				weekStart = weekStart.AddDate(0, 0, -1)
			}
			dateKey = weekStart.Format("2006-01-02")
		case "monthly":
			dateKey = event.CreatedAt.Format("2006-01")
		default:
			dateKey = event.CreatedAt.Format("2006-01-02")
		}

		// Get company name
		companyName := ds.companies[event.CompanyID]
		if companyName == "" {
			companyName = "Unknown Company"
		}

		if dateCompanyMap[dateKey] == nil {
			dateCompanyMap[dateKey] = make(map[string]int)
		}
		dateCompanyMap[dateKey][companyName]++
	}

	// Ensure all companies are included in the response (with 0 values if no events)
	allCompanyNames := ds.GetAllCompanyNames()
	for dateKey := range dateCompanyMap {
		for _, companyName := range allCompanyNames {
			if dateCompanyMap[dateKey][companyName] == 0 {
				dateCompanyMap[dateKey][companyName] = 0
			}
		}
	}

	// Convert to response format with company-specific data
	var data []map[string]interface{}
	for dateKey, companyCounts := range dateCompanyMap {
		dataPoint := map[string]interface{}{
			"timestamp": dateKey,
		}

		// Add company-specific data
		for companyName, count := range companyCounts {
			dataPoint[companyName] = count
		}

		data = append(data, dataPoint)
	}

	// Sort by timestamp
	sort.Slice(data, func(i, j int) bool {
		return data[i]["timestamp"].(string) < data[j]["timestamp"].(string)
	})

	return models.MultiCompanyTimeSeriesResponse{
		Data:        data,
		Timeframe:   timeframe,
		TotalPoints: len(data),
	}
}

// GetTimeSeriesData returns time series data for trends
func (ds *DataService) GetTimeSeriesData(timeframe, startDate, endDate string, companies, eventTypes []string) models.TimeSeriesResponse {
	if !ds.loaded {
		return models.TimeSeriesResponse{
			Data:        []models.TimeSeriesData{},
			Timeframe:   timeframe,
			TotalPoints: 0,
		}
	}

	// Parse dates
	start, _ := time.Parse("2006-01-02", startDate)
	end, _ := time.Parse("2006-01-02", endDate)
	end = end.Add(24 * time.Hour)

	// Filter events
	filtered := ds.events
	if len(companies) > 0 {
		companySet := make(map[string]bool)
		for _, company := range companies {
			companySet[company] = true
		}
		var companyFiltered []models.UsageEvent
		for _, event := range filtered {
			// Get company name from the companies map
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			if companySet[companyName] {
				companyFiltered = append(companyFiltered, event)
			}
		}
		filtered = companyFiltered
	}

	if len(eventTypes) > 0 {
		eventTypeSet := make(map[string]bool)
		for _, eventType := range eventTypes {
			eventTypeSet[eventType] = true
		}
		var eventTypeFiltered []models.UsageEvent
		for _, event := range filtered {
			if eventTypeSet[event.Type] {
				eventTypeFiltered = append(eventTypeFiltered, event)
			}
		}
		filtered = eventTypeFiltered
	}

	// Group by timeframe
	timeSeriesMap := make(map[string]int)
	for _, event := range filtered {
		if event.CreatedAt.After(start) && event.CreatedAt.Before(end) {
			var key string
			switch timeframe {
			case "daily":
				key = event.CreatedAt.Format("2006-01-02")
			case "weekly":
				year, week := event.CreatedAt.ISOWeek()
				key = fmt.Sprintf("%d-W%02d", year, week)
			case "monthly":
				key = event.CreatedAt.Format("2006-01")
			default:
				key = event.CreatedAt.Format("2006-01-02")
			}
			timeSeriesMap[key]++
		}
	}

	// Convert to slice and sort
	var data []models.TimeSeriesData
	for timestamp, value := range timeSeriesMap {
		data = append(data, models.TimeSeriesData{
			Timestamp: timestamp,
			Value:     value,
			EventType: "Action", // Default event type
		})
	}

	sort.Slice(data, func(i, j int) bool {
		return data[i].Timestamp < data[j].Timestamp
	})

	return models.TimeSeriesResponse{
		Data:        data,
		Timeframe:   timeframe,
		TotalPoints: len(data),
	}
}

// GetMetrics returns aggregated metrics
func (ds *DataService) GetMetrics(startDate, endDate string, companies, eventTypes []string) models.MetricsResponse {
	if !ds.loaded {
		return models.MetricsResponse{
			TotalEvents:     0,
			ActiveCompanies: 0,
			TopEventTypes:   []models.EventTypeCount{},
			TimeRange:       models.TimeRange{},
		}
	}

	// Filter events
	filtered := ds.events
	if startDate != "" && endDate != "" {
		start, _ := time.Parse("2006-01-02", startDate)
		end, _ := time.Parse("2006-01-02", endDate)
		end = end.Add(24 * time.Hour)

		var dateFiltered []models.UsageEvent
		for _, event := range filtered {
			if event.CreatedAt.After(start) && event.CreatedAt.Before(end) {
				dateFiltered = append(dateFiltered, event)
			}
		}
		filtered = dateFiltered
	}

	if len(companies) > 0 {
		companySet := make(map[string]bool)
		for _, company := range companies {
			companySet[company] = true
		}
		var companyFiltered []models.UsageEvent
		for _, event := range filtered {
			// Get company name from the companies map
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			if companySet[companyName] {
				companyFiltered = append(companyFiltered, event)
			}
		}
		filtered = companyFiltered
	}

	if len(eventTypes) > 0 {
		eventTypeSet := make(map[string]bool)
		for _, eventType := range eventTypes {
			eventTypeSet[eventType] = true
		}
		var eventTypeFiltered []models.UsageEvent
		for _, event := range filtered {
			if eventTypeSet[event.Type] {
				eventTypeFiltered = append(eventTypeFiltered, event)
			}
		}
		filtered = eventTypeFiltered
	}

	// Calculate metrics
	companySet := make(map[string]bool)
	eventTypeCounts := make(map[string]int)

	for _, event := range filtered {
		companySet[event.CompanyID] = true
		eventTypeCounts[event.Type]++
	}

	var topEventTypes []models.EventTypeCount
	for eventType, count := range eventTypeCounts {
		topEventTypes = append(topEventTypes, models.EventTypeCount{
			Type:  eventType,
			Count: count,
		})
	}

	// Sort by count (descending)
	sort.Slice(topEventTypes, func(i, j int) bool {
		return topEventTypes[i].Count > topEventTypes[j].Count
	})

	// Get time range
	var timeRange models.TimeRange
	if len(filtered) > 0 {
		timeRange.Start = filtered[0].CreatedAt.Format("2006-01-02T15:04:05Z")
		timeRange.End = filtered[len(filtered)-1].CreatedAt.Format("2006-01-02T15:04:05Z")
	}

	return models.MetricsResponse{
		TotalEvents:     len(filtered),
		ActiveCompanies: len(companySet),
		TopEventTypes:   topEventTypes,
		TimeRange:       timeRange,
	}
}

// GetCompanies returns all companies
func (ds *DataService) GetCompanies() models.CompaniesResponse {
	if !ds.loaded {
		return models.CompaniesResponse{
			Data:  []models.Company{},
			Total: 0,
		}
	}

	var companies []models.Company
	companyEventCounts := make(map[string]int)

	// Count events per company
	for _, event := range ds.events {
		companyEventCounts[event.CompanyID]++
	}

	// Create company objects
	for companyID, eventCount := range companyEventCounts {
		name := ds.companies[companyID]
		if name == "" {
			name = "Unknown Company"
		}
		companies = append(companies, models.Company{
			ID:         companyID,
			Name:       name,
			EventCount: eventCount,
		})
	}

	// Sort by event count (descending)
	sort.Slice(companies, func(i, j int) bool {
		return companies[i].EventCount > companies[j].EventCount
	})

	return models.CompaniesResponse{
		Data:  companies,
		Total: len(companies),
	}
}

// GetTopActiveCompanies returns top 5 most active companies
func (ds *DataService) GetTopActiveCompanies() models.CompanyAnalyticsResponse {
	if !ds.loaded {
		return models.CompanyAnalyticsResponse{
			Data:  []models.CompanyAnalytics{},
			Total: 0,
		}
	}

	companyStats := make(map[string]struct {
		eventCount   int
		lastActivity time.Time
	})

	// Calculate company statistics
	for _, event := range ds.events {
		stats := companyStats[event.CompanyID]
		stats.eventCount++
		if event.CreatedAt.After(stats.lastActivity) {
			stats.lastActivity = event.CreatedAt
		}
		companyStats[event.CompanyID] = stats
	}

	// Convert to slice
	var companies []models.CompanyAnalytics
	totalEvents := len(ds.events)

	for companyID, stats := range companyStats {
		name := ds.companies[companyID]
		if name == "" {
			name = "Unknown Company"
		}
		percentage := float64(stats.eventCount) / float64(totalEvents) * 100

		companies = append(companies, models.CompanyAnalytics{
			CompanyID:    companyID,
			Name:         name,
			EventCount:   stats.eventCount,
			Percentage:   percentage,
			LastActivity: stats.lastActivity,
		})
	}

	// Sort by event count (descending) and take top 5
	sort.Slice(companies, func(i, j int) bool {
		return companies[i].EventCount > companies[j].EventCount
	})

	if len(companies) > 5 {
		companies = companies[:5]
	}

	return models.CompanyAnalyticsResponse{
		Data:  companies,
		Total: len(companies),
	}
}

// GetEventDistribution returns event distribution by type
func (ds *DataService) GetEventDistribution() models.EventDistributionResponse {
	if !ds.loaded {
		return models.EventDistributionResponse{
			Data:  []models.EventDistribution{},
			Total: 0,
		}
	}

	var distributions []models.EventDistribution
	totalEvents := len(ds.events)

	for eventType, count := range ds.eventTypes {
		percentage := float64(count) / float64(totalEvents) * 100

		// Count unique companies for this event type
		companySet := make(map[string]bool)
		for _, event := range ds.events {
			if event.Type == eventType {
				companySet[event.CompanyID] = true
			}
		}

		distributions = append(distributions, models.EventDistribution{
			Type:       eventType,
			Count:      count,
			Percentage: percentage,
			Companies:  len(companySet),
		})
	}

	// Sort by count (descending)
	sort.Slice(distributions, func(i, j int) bool {
		return distributions[i].Count > distributions[j].Count
	})

	return models.EventDistributionResponse{
		Data:  distributions,
		Total: len(distributions),
	}
}

// GetTopEventsByVolume returns top events by volume with filtering support
func (ds *DataService) GetTopEventsByVolume(startDate, endDate string, companies []string, limit int) []models.EventTypeCount {
	if !ds.loaded {
		return []models.EventTypeCount{}
	}

	// Filter events
	filtered := ds.filterEventsByDateAndCompanies(startDate, endDate, companies)

	// Count events by type
	eventTypeCounts := make(map[string]int)
	for _, event := range filtered {
		eventTypeCounts[event.Type]++
	}

	// Convert to slice and sort
	var topEvents []models.EventTypeCount
	for eventType, count := range eventTypeCounts {
		topEvents = append(topEvents, models.EventTypeCount{
			Type:  eventType,
			Count: count,
		})
	}

	// Sort by count descending
	sort.Slice(topEvents, func(i, j int) bool {
		return topEvents[i].Count > topEvents[j].Count
	})

	// Limit results
	if limit > 0 && len(topEvents) > limit {
		topEvents = topEvents[:limit]
	}

	return topEvents
}

// GetMostActiveUsers returns most active users with filtering support
func (ds *DataService) GetMostActiveUsers(startDate, endDate string, companies []string, limit int) []models.UserActivity {
	if !ds.loaded {
		return []models.UserActivity{}
	}

	// Filter events
	filtered := ds.filterEventsByDateAndCompanies(startDate, endDate, companies)

	// Count events by user
	userCounts := make(map[string]int)
	userCompanies := make(map[string]map[string]bool)
	userCompanyNames := make(map[string]map[string]bool)
	userLastActivity := make(map[string]time.Time)

	for _, event := range filtered {
		if event.User != "" {
			userCounts[event.User]++

			// Track unique companies per user
			if userCompanies[event.User] == nil {
				userCompanies[event.User] = make(map[string]bool)
			}
			userCompanies[event.User][event.CompanyID] = true

			// Track unique company names per user
			if userCompanyNames[event.User] == nil {
				userCompanyNames[event.User] = make(map[string]bool)
			}
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			userCompanyNames[event.User][companyName] = true

			// Track last activity
			if event.CreatedAt.After(userLastActivity[event.User]) {
				userLastActivity[event.User] = event.CreatedAt
			}
		}
	}

	// Convert to slice and sort
	var activeUsers []models.UserActivity
	for user, count := range userCounts {
		// Convert company names map to slice
		var companyNames []string
		for companyName := range userCompanyNames[user] {
			companyNames = append(companyNames, companyName)
		}
		sort.Strings(companyNames)

		activeUsers = append(activeUsers, models.UserActivity{
			User:         user,
			EventCount:   count,
			Companies:    len(userCompanies[user]),
			CompanyNames: companyNames,
			LastActivity: userLastActivity[user],
		})
	}

	// Sort by event count descending
	sort.Slice(activeUsers, func(i, j int) bool {
		return activeUsers[i].EventCount > activeUsers[j].EventCount
	})

	// Limit results
	if limit > 0 && len(activeUsers) > limit {
		activeUsers = activeUsers[:limit]
	}

	return activeUsers
}

// GetTopEndpointsByUsage returns top endpoints by usage with filtering support
func (ds *DataService) GetTopEndpointsByUsage(startDate, endDate string, companies []string, limit int) []models.EndpointActivity {
	if !ds.loaded {
		return []models.EndpointActivity{}
	}

	// Filter events
	filtered := ds.filterEventsByDateAndCompanies(startDate, endDate, companies)

	// Count events by endpoint
	endpointCounts := make(map[string]int)
	endpointUsers := make(map[string]map[string]bool)
	endpointCompanies := make(map[string]map[string]bool)

	for _, event := range filtered {
		if event.Endpoint != "" {
			endpointCounts[event.Endpoint]++

			// Track unique users per endpoint
			if endpointUsers[event.Endpoint] == nil {
				endpointUsers[event.Endpoint] = make(map[string]bool)
			}
			if event.User != "" {
				endpointUsers[event.Endpoint][event.User] = true
			}

			// Track unique companies per endpoint
			if endpointCompanies[event.Endpoint] == nil {
				endpointCompanies[event.Endpoint] = make(map[string]bool)
			}
			endpointCompanies[event.Endpoint][event.CompanyID] = true
		}
	}

	// Calculate total events for percentage
	totalEvents := len(filtered)

	// Convert to slice and sort
	var topEndpoints []models.EndpointActivity
	for endpoint, count := range endpointCounts {
		percentage := float64(count) / float64(totalEvents) * 100
		topEndpoints = append(topEndpoints, models.EndpointActivity{
			Endpoint:     endpoint,
			EventCount:   count,
			UserCount:    len(endpointUsers[endpoint]),
			CompanyCount: len(endpointCompanies[endpoint]),
			Percentage:   percentage,
		})
	}

	// Sort by event count descending
	sort.Slice(topEndpoints, func(i, j int) bool {
		return topEndpoints[i].EventCount > topEndpoints[j].EventCount
	})

	// Limit results
	if limit > 0 && len(topEndpoints) > limit {
		topEndpoints = topEndpoints[:limit]
	}

	return topEndpoints
}

// GetTopActiveCompaniesWithFiltering returns top active companies with filtering support
func (ds *DataService) GetTopActiveCompaniesWithFiltering(startDate, endDate string, companies []string, limit int) []models.CompanyActivity {
	if !ds.loaded {
		return []models.CompanyActivity{}
	}

	// Filter events
	filtered := ds.filterEventsByDateAndCompanies(startDate, endDate, companies)

	// Count events by company
	companyCounts := make(map[string]int)
	companyUsers := make(map[string]map[string]bool)
	companyEndpoints := make(map[string]map[string]bool)
	companyLastActivity := make(map[string]time.Time)

	for _, event := range filtered {
		companyName := ds.companies[event.CompanyID]
		if companyName == "" {
			companyName = "Unknown Company"
		}

		companyCounts[companyName]++

		// Track unique users per company
		if companyUsers[companyName] == nil {
			companyUsers[companyName] = make(map[string]bool)
		}
		if event.User != "" {
			companyUsers[companyName][event.User] = true
		}

		// Track unique endpoints per company
		if companyEndpoints[companyName] == nil {
			companyEndpoints[companyName] = make(map[string]bool)
		}
		if event.Endpoint != "" {
			companyEndpoints[companyName][event.Endpoint] = true
		}

		// Track last activity
		if event.CreatedAt.After(companyLastActivity[companyName]) {
			companyLastActivity[companyName] = event.CreatedAt
		}
	}

	// Convert to slice and sort
	var topCompanies []models.CompanyActivity
	for companyName, count := range companyCounts {
		topCompanies = append(topCompanies, models.CompanyActivity{
			CompanyName:   companyName,
			EventCount:    count,
			UserCount:     len(companyUsers[companyName]),
			EndpointCount: len(companyEndpoints[companyName]),
			LastActivity:  companyLastActivity[companyName],
		})
	}

	// Sort by event count descending
	sort.Slice(topCompanies, func(i, j int) bool {
		return topCompanies[i].EventCount > topCompanies[j].EventCount
	})

	// Limit results
	if limit > 0 && len(topCompanies) > limit {
		topCompanies = topCompanies[:limit]
	}

	return topCompanies
}

// Helper function to filter events by date and companies
func (ds *DataService) filterEventsByDateAndCompanies(startDate, endDate string, companies []string) []models.UsageEvent {
	filtered := ds.events

	// Filter by date range
	if startDate != "" && endDate != "" {
		start, _ := time.Parse("2006-01-02", startDate)
		end, _ := time.Parse("2006-01-02", endDate)
		end = end.Add(24 * time.Hour)

		var dateFiltered []models.UsageEvent
		for _, event := range filtered {
			if event.CreatedAt.After(start) && event.CreatedAt.Before(end) {
				dateFiltered = append(dateFiltered, event)
			}
		}
		filtered = dateFiltered
	}

	// Filter by companies
	if len(companies) > 0 {
		companySet := make(map[string]bool)
		for _, company := range companies {
			companySet[company] = true
		}
		var companyFiltered []models.UsageEvent
		for _, event := range filtered {
			companyName := ds.companies[event.CompanyID]
			if companyName == "" {
				companyName = "Unknown Company"
			}
			if companySet[companyName] {
				companyFiltered = append(companyFiltered, event)
			}
		}
		filtered = companyFiltered
	}

	return filtered
}
