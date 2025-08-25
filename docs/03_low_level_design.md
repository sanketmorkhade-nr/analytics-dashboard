# Low-Level Design - Usage Analytics Dashboard

**File Path:** /docs/03_low_level_design.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

---

## Component: Frontend React Application (FRONTEND-001)

### Purpose
Single-page React application providing the user interface for analytics dashboard with interactive visualizations and filtering capabilities.

### Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Charts**: Recharts library
- **State Management**: React Context + useState
- **HTTP Client**: Axios or fetch API
- **Styling**: Tailwind CSS (via shadcn/ui)

### shadcn/ui Installation

**Important**: To install shadcn/ui, you must follow the official documentation for Vite. Run the CLI command `npx shadcn-ui@latest init` and follow the prompts. Do not attempt to set up the library manually.

**Official Guide**: https://ui.shadcn.com/docs/installation/vite

**Installation Steps**:
1. Run `npx shadcn-ui@latest init`
2. Follow the CLI prompts to configure:
   - TypeScript support
   - Tailwind CSS configuration
   - CSS variables setup
   - Component location (recommended: `src/shared/components/ui`)
   - Import aliases
3. Install individual components as needed: `npx shadcn-ui@latest add button card select input`

### Data Structures

#### User Interface State
```typescript
interface DashboardState {
  filters: FilterState;
  charts: ChartState;
  search: SearchState;
  loading: boolean;
  error: string | null;
}

interface FilterState {
  dateRange: {
    start: Date;
    end: Date;
  };
  companies: string[];
  eventTypes: string[];
  users: string[];
}

interface ChartState {
  trends: TrendData[];
  metrics: MetricData[];
  selectedTimeframe: 'daily' | 'weekly' | 'monthly';
}

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
}
```

#### API Response Models
```typescript
interface AnalyticsResponse {
  trends: TrendData[];
  metrics: MetricData[];
  summary: SummaryData;
}

interface TrendData {
  timestamp: string;
  value: number;
  eventType: string;
  companyId: string;
}

interface MetricData {
  totalUsage: number;
  topEvents: TopEvent[];
  activeCompanies: number;
  period: string;
}

interface SearchResult {
  id: string;
  timestamp: string;
  companyId: string;
  eventType: string;
  content: string;
  relevance: number;
}
```

### Key Algorithms

#### Data Aggregation Algorithm
```typescript
function aggregateUsageData(data: UsageEvent[], timeframe: string): TrendData[] {
  const grouped = groupByTimeframe(data, timeframe);
  return Object.entries(grouped).map(([timestamp, events]) => ({
    timestamp,
    value: events.length,
    eventType: getMostFrequentEventType(events),
    companyId: getMostActiveCompany(events)
  }));
}
```

#### Filter Application Algorithm
```go
func (ds *DataService) applyFilters(events []UsageEvent, filters SearchFilters) []UsageEvent {
    if filters.DateRange != nil {
        startDate, _ := time.Parse("2006-01-02", filters.DateRange.Start)
        endDate, _ := time.Parse("2006-01-02", filters.DateRange.End)
        endDate = endDate.Add(24 * time.Hour) // Include the entire end date

        var filtered []UsageEvent
        for _, event := range events {
            if event.CreatedAt.After(startDate) && event.CreatedAt.Before(endDate) {
                filtered = append(filtered, event)
            }
        }
        events = filtered
    }

    if len(filters.Companies) > 0 {
        companySet := make(map[string]bool)
        for _, company := range filters.Companies {
            companySet[company] = true
        }

        var filtered []UsageEvent
        for _, event := range events {
            companyName := ds.companies[event.CompanyID]
            if companyName == "" {
                companyName = "Unknown Company"
            }
            if companySet[companyName] {
                filtered = append(filtered, event)
            }
        }
        events = filtered
    }

    if len(filters.EventTypes) > 0 {
        eventTypeSet := make(map[string]bool)
        for _, eventType := range filters.EventTypes {
            eventTypeSet[eventType] = true
        }

        var filtered []UsageEvent
        for _, event := range events {
            if eventTypeSet[event.Type] {
                filtered = append(filtered, event)
            }
        }
        events = filtered
    }

    return events
}
```

### Error Handling
- Network error handling with retry logic
- Data validation for API responses
- Graceful degradation for missing data
- User-friendly error messages

#### Data Loading and Parsing Algorithm
```go
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

    var events []UsageEvent
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

        // Skip rows that don't have enough columns
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

        // Track companies and event types
        companyMap[event.CompanyID] = ds.extractCompanyName(event.Content)
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

    return nil
}

func (ds *DataService) parseEvent(record []string) (UsageEvent, error) {
    // Parse timestamps with multiple format support
    createdAt, err := ds.parseTimestamp(record[1])
    if err != nil {
        return UsageEvent{}, fmt.Errorf("invalid created_at: %w", err)
    }

    updatedAt, err := ds.parseTimestamp(record[6])
    if err != nil {
        return UsageEvent{}, fmt.Errorf("invalid updated_at: %w", err)
    }

    originalTimestamp, err := ds.parseTimestamp(record[7])
    if err != nil {
        return UsageEvent{}, fmt.Errorf("invalid original_timestamp: %w", err)
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

    return UsageEvent{
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
```

---

## Component: Backend API Server (BACKEND-001)

### Purpose
Go-based REST API server handling business logic, data processing, and serving analytics data to the frontend.

### Data Structures

#### In-Memory Data Models
```go
type UsageEvent struct {
    ID                string    `json:"id"`
    CreatedAt         time.Time `json:"created_at"`
    CompanyID         string    `json:"company_id"`
    Type              string    `json:"type"`
    Content           string    `json:"content"`
    Attribute         string    `json:"attribute"`
    UpdatedAt         time.Time `json:"updated_at"`
    OriginalTimestamp time.Time `json:"original_timestamp"`
    Value             *float64  `json:"value"`
}

type Company struct {
    ID          string    `json:"id"`
    Name        string    `json:"name"`
    CreatedAt   time.Time `json:"created_at"`
    IsActive    bool      `json:"is_active"`
}

type AnalyticsMetrics struct {
    TotalEvents    int64                  `json:"total_events"`
    TopEventTypes  []EventTypeCount       `json:"top_event_types"`
    ActiveCompanies int64                 `json:"active_companies"`
    TimeSeries     []TimeSeriesData       `json:"time_series"`
}

type EventTypeCount struct {
    EventType string `json:"event_type"`
    Count     int64  `json:"count"`
}

type TimeSeriesData struct {
    Timestamp string  `json:"timestamp"`
    Value     int64   `json:"value"`
    EventType string  `json:"event_type"`
}
```

#### API Request/Response Models
```go
type SearchRequest struct {
    SearchQuery string            `json:"searchQuery,omitempty"`
    Filters     SearchFilters     `json:"filters,omitempty"`
    Pagination  PaginationRequest `json:"pagination,omitempty"`
}

type SearchFilters struct {
    DateRange  *DateRange `json:"dateRange,omitempty"`
    Companies  []string   `json:"companies,omitempty"`
    EventTypes []string   `json:"eventTypes,omitempty"`
    Timeframe  string     `json:"timeframe,omitempty"`
}

type DateRange struct {
    Start string `json:"start"`
    End   string `json:"end"`
}

type PaginationRequest struct {
    Page     int `json:"page,omitempty"`
    PageSize int `json:"pageSize,omitempty"`
}

type PaginationInfo struct {
    Page       int `json:"page"`
    PageSize   int `json:"pageSize"`
    Total      int `json:"total"`
    TotalPages int `json:"totalPages"`
}

type SearchResponse struct {
    Data         []UsageEvent       `json:"data"`
    Pagination   PaginationInfo     `json:"pagination"`
    Aggregations SearchAggregations `json:"aggregations"`
}

type SearchAggregations struct {
    TotalEvents     int              `json:"totalEvents"`
    UniqueCompanies int              `json:"uniqueCompanies"`
    EventTypes      []EventTypeCount `json:"eventTypes"`
}
```

### API Endpoints

#### Complete API Endpoint List
```go
// Core Event Endpoints
GET  /api/v1/events                    // Unified search and filtering with pagination
GET  /api/v1/events/metrics            // Filtered metrics with enhanced calculations

// Analytics Endpoints
GET  /api/v1/trends                    // Time series data aggregation
GET  /api/v1/trends/multi-company      // Multi-company trends for line/bar charts
GET  /api/v1/metrics                   // Basic dashboard metrics
GET  /api/v1/companies                 // Company list with event counts
GET  /api/v1/event-types               // Event type distribution

// Advanced Analytics Endpoints
GET  /api/v1/analytics/companies       // Top active companies analytics
GET  /api/v1/analytics/event-distribution // Detailed event distribution

// System Endpoints
GET  /health                           // Health check endpoint
GET  /                                 // Root endpoint with API information
```

#### Analytics Endpoints
```go
// GET /api/v1/events - Unified search and filtering
func (h *EventHandler) GetEvents(c *gin.Context) {
    // Parse query parameters: query, startDate, endDate, company, companies, page, pageSize
    // Support both single company and comma-separated companies
    // Returns paginated events with search results
}

// GET /api/v1/trends - Time series data
func (h *EventHandler) GetTimeSeriesData(c *gin.Context) {
    // Parameters: timeframe, startDate, endDate, companies, eventTypes
    // Returns aggregated time series data for charts
}

// GET /api/v1/trends/multi-company - Multi-company trends for line charts
func (h *EventHandler) GetMultiCompanyTrends(c *gin.Context) {
    // Parameters: timeframe, startDate, endDate, companies, eventTypes
    // Returns multi-company time series data for line/bar charts
}

// GET /api/v1/metrics - Basic metrics
func (h *EventHandler) GetMetrics(c *gin.Context) {
    // Parameters: startDate, endDate, companies, eventTypes
    // Returns total events, active companies, top event types
}

// GET /api/v1/events/metrics - Filtered metrics with enhanced data
func (h *EventHandler) GetFilteredMetrics(c *gin.Context) {
    // Parameters: startDate, endDate, company, companies
    // Returns enhanced metrics including unique users, avg events per company
}

// GET /api/v1/companies - Company list
func (h *EventHandler) GetCompanies(c *gin.Context) {
    // Returns list of all companies with event counts
}

// GET /api/v1/event-types - Event type distribution
func (h *EventHandler) GetEventTypes(c *gin.Context) {
    // Returns event type distribution data
}

// GET /api/v1/analytics/companies - Top active companies
func (h *EventHandler) GetTopActiveCompanies(c *gin.Context) {
    // Returns top companies by activity with analytics
}

// GET /api/v1/analytics/event-distribution - Event distribution
func (h *EventHandler) GetEventDistribution(c *gin.Context) {
    // Returns detailed event distribution analytics
}

// GET /health - Health check
func (c *gin.Context) {
    // Returns service health status
}

// GET / - Root endpoint
func (c *gin.Context) {
    // Returns API information and available endpoints
}
```

#### Search and Filtering Algorithm
```go
func (ds *DataService) applySearch(events []UsageEvent, query string) []UsageEvent {
    query = strings.ToLower(query)
    var filtered []UsageEvent

    for _, event := range events {
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

func (ds *DataService) calculateAggregations(events []UsageEvent) SearchAggregations {
    totalEvents := len(events)
    
    // Calculate unique companies
    companySet := make(map[string]bool)
    for _, event := range events {
        companyName := ds.companies[event.CompanyID]
        if companyName != "" {
            companySet[companyName] = true
        }
    }
    uniqueCompanies := len(companySet)

    // Calculate event types
    eventTypeCounts := make(map[string]int)
    for _, event := range events {
        eventTypeCounts[event.Type]++
    }

    var eventTypes []EventTypeCount
    for eventType, count := range eventTypeCounts {
        eventTypes = append(eventTypes, EventTypeCount{
            Type:  eventType,
            Count: count,
        })
    }

    // Sort by count descending
    sort.Slice(eventTypes, func(i, j int) bool {
        return eventTypes[i].Count > eventTypes[j].Count
    })

    return SearchAggregations{
        TotalEvents:     totalEvents,
        UniqueCompanies: uniqueCompanies,
        EventTypes:      eventTypes,
    }
}
```

### Key Algorithms

#### Data Aggregation Algorithm
```go
func (ds *DataService) GetMultiCompanyTimeSeriesData(timeframe, startDate, endDate string, companies, eventTypes []string) MultiCompanyTimeSeriesResponse {
    if !ds.loaded {
        return MultiCompanyTimeSeriesResponse{
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
        var companyFiltered []UsageEvent
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

    // Apply event type filter
    if len(eventTypes) > 0 {
        eventTypeSet := make(map[string]bool)
        for _, eventType := range eventTypes {
            eventTypeSet[eventType] = true
        }
        var eventTypeFiltered []UsageEvent
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

        companyName := ds.companies[event.CompanyID]
        if companyName == "" {
            companyName = "Unknown Company"
        }

        if dateCompanyMap[dateKey] == nil {
            dateCompanyMap[dateKey] = make(map[string]int)
        }
        dateCompanyMap[dateKey][companyName]++
    }

    // Convert to response format
    var result []map[string]interface{}
    for dateKey, companyData := range dateCompanyMap {
        dataPoint := map[string]interface{}{
            "timestamp": dateKey,
        }
        for companyName, count := range companyData {
            dataPoint[companyName] = count
        }
        result = append(result, dataPoint)
    }

    return MultiCompanyTimeSeriesResponse{
        Data:        result,
        Timeframe:   timeframe,
        TotalPoints: len(result),
    }
}
```

#### In-Memory Data Access Strategy
```go
func (s *AnalyticsService) GetMetrics(req AnalyticsRequest) (*AnalyticsMetrics, error) {
    // Filter events based on request criteria
    filteredEvents := s.filterEvents(req)
    
    // Calculate metrics
    metrics := &AnalyticsMetrics{
        TotalEvents:    int64(len(filteredEvents)),
        ActiveCompanies: s.countUniqueCompanies(filteredEvents),
        TopEventTypes:  s.getTopEventTypes(filteredEvents, 10),
        TimeSeries:     s.generateTimeSeries(filteredEvents, req.Timeframe),
    }
    
    return metrics, nil
}

func (s *AnalyticsService) countUniqueCompanies(events []UsageEvent) int64 {
    companies := make(map[string]bool)
    for _, event := range events {
        companies[event.CompanyID] = true
    }
    return int64(len(companies))
}

func (s *AnalyticsService) getTopEventTypes(events []UsageEvent, limit int) []EventTypeCount {
    eventCounts := make(map[string]int64)
    for _, event := range events {
        eventCounts[event.Type]++
    }
    
    var result []EventTypeCount
    for eventType, count := range eventCounts {
        result = append(result, EventTypeCount{
            EventType: eventType,
            Count:     count,
        })
    }
    
    // Sort by count descending
    sort.Slice(result, func(i, j int) bool {
        return result[i].Count > result[j].Count
    })
    
    // Return top N
    if len(result) > limit {
        result = result[:limit]
    }
    
    return result
}
```

### Error Handling
- Input validation with detailed error messages
- Database connection error handling
- Rate limiting and throttling
- Structured error responses
- Logging and monitoring

---

## Component: Data Processing Engine (PROCESSING-001)

### Purpose
Background processing system for ingesting, transforming, and aggregating usage data from multiple sources.

### Data Structures

#### Processing Models
```go
type ProcessingJob struct {
    ID          string                 `json:"id"`
    Type        JobType                `json:"type"`
    Status      JobStatus              `json:"status"`
    Source      DataSource             `json:"source"`
    Config      map[string]interface{} `json:"config"`
    CreatedAt   time.Time              `json:"created_at"`
    StartedAt   *time.Time             `json:"started_at"`
    CompletedAt *time.Time             `json:"completed_at"`
    Error       *string                `json:"error"`
}

type DataSource struct {
    Type     SourceType `json:"type"`
    Location string     `json:"location"`
    Format   string     `json:"format"`
    Config   map[string]interface{} `json:"config"`
}

type ProcessedEvent struct {
    OriginalEvent UsageEvent `json:"original_event"`
    ProcessedAt   time.Time  `json:"processed_at"`
    Validations   []Validation `json:"validations"`
    Enrichments   []Enrichment `json:"enrichments"`
}

type Validation struct {
    Field   string `json:"field"`
    Rule    string `json:"rule"`
    Valid   bool   `json:"valid"`
    Message string `json:"message"`
}

type Enrichment struct {
    Type  string      `json:"type"`
    Field string      `json:"field"`
    Value interface{} `json:"value"`
}
```

### Key Algorithms

#### CSV Data Ingestion Algorithm
```go
func (p *Processor) ProcessCSVFile(source DataSource) error {
    file, err := os.Open(source.Location)
    if err != nil {
        return fmt.Errorf("failed to open file: %w", err)
    }
    defer file.Close()
    
    reader := csv.NewReader(file)
    reader.FieldsPerRecord = -1 // Allow variable number of fields
    
    // Skip header row
    _, err = reader.Read()
    if err != nil {
        return fmt.Errorf("failed to read header: %w", err)
    }
    
    batch := make([]UsageEvent, 0, 1000)
    for {
        record, err := reader.Read()
        if err == io.EOF {
            break
        }
        if err != nil {
            continue // Skip malformed rows
        }
        
        event, err := p.parseCSVRecord(record)
        if err != nil {
            p.logger.Warn("Failed to parse CSV record", "error", err, "record", record)
            continue
        }
        
        batch = append(batch, event)
        
        if len(batch) >= 1000 {
            if err := p.saveBatch(batch); err != nil {
                return fmt.Errorf("failed to save batch: %w", err)
            }
            batch = batch[:0]
        }
    }
    
    // Save remaining batch
    if len(batch) > 0 {
        if err := p.saveBatch(batch); err != nil {
            return fmt.Errorf("failed to save final batch: %w", err)
        }
    }
    
    return nil
}
```

#### Data Validation Algorithm
```go
func (p *Processor) ValidateEvent(event UsageEvent) []Validation {
    var validations []Validation
    
    // Required field validation
    if event.ID == "" {
        validations = append(validations, Validation{
            Field:   "id",
            Rule:    "required",
            Valid:   false,
            Message: "ID is required",
        })
    }
    
    if event.CompanyID == "" {
        validations = append(validations, Validation{
            Field:   "company_id",
            Rule:    "required",
            Valid:   false,
            Message: "Company ID is required",
        })
    }
    
    // Date validation
    if event.CreatedAt.IsZero() {
        validations = append(validations, Validation{
            Field:   "created_at",
            Rule:    "required",
            Valid:   false,
            Message: "Created at timestamp is required",
        })
    }
    
    // Future date check
    if event.CreatedAt.After(time.Now()) {
        validations = append(validations, Validation{
            Field:   "created_at",
            Rule:    "not_future",
            Valid:   false,
            Message: "Created at cannot be in the future",
        })
    }
    
    return validations
}
```

#### Data Enrichment Algorithm
```go
func (p *Processor) EnrichEvent(event UsageEvent) []Enrichment {
    var enrichments []Enrichment
    
    // Extract company name from content if available
    if companyName := p.extractCompanyName(event.Content); companyName != "" {
        enrichments = append(enrichments, Enrichment{
            Type:  "company_name",
            Field: "company_name",
            Value: companyName,
        })
    }
    
    // Extract user email from content
    if userEmail := p.extractUserEmail(event.Content); userEmail != "" {
        enrichments = append(enrichments, Enrichment{
            Type:  "user_email",
            Field: "user_email",
            Value: userEmail,
        })
    }
    
    // Categorize event type
    if category := p.categorizeEventType(event.Type); category != "" {
        enrichments = append(enrichments, Enrichment{
            Type:  "event_category",
            Field: "event_category",
            Value: category,
        })
    }
    
    return enrichments
}
```

### Error Handling
- Graceful handling of malformed data
- Retry logic for transient failures
- Dead letter queue for failed processing
- Comprehensive logging and monitoring
- Data quality metrics tracking

---

## Component: In-Memory Data Store (MEMORY-001)

### Purpose
In-memory data storage system for fast access to processed usage data and analytics results.

### Data Structures

#### In-Memory Data Models
```go
type DataService struct {
    dataPath   string
    events     []UsageEvent
    companies  map[string]string
    eventTypes map[string]int
    loaded     bool
}

type UsageEvent struct {
    ID                string    `json:"id"`
    CreatedAt         time.Time `json:"created_at"`
    CompanyID         string    `json:"company_id"`
    CompanyName       string    `json:"companyName"`
    Type              string    `json:"type"`
    Content           string    `json:"content"`
    Attribute         string    `json:"attribute"`
    User              string    `json:"user"`
    Endpoint          string    `json:"endpoint"`
    UpdatedAt         time.Time `json:"updated_at"`
    OriginalTimestamp time.Time `json:"original_timestamp"`
    Value             *float64  `json:"value"`
}

type Company struct {
    ID         string `json:"id"`
    Name       string `json:"name"`
    EventCount int    `json:"eventCount"`
}
```

#### Data Access Methods
```go
func (ds *DataService) GetTotalEvents() int {
    return len(ds.events)
}

func (ds *DataService) GetAllEvents(page, pageSize int) ([]UsageEvent, int) {
    if !ds.loaded {
        return []UsageEvent{}, 0
    }

    // Apply pagination
    start := (page - 1) * pageSize
    end := start + pageSize

    if start >= len(ds.events) {
        return []UsageEvent{}, len(ds.events)
    }

    if end > len(ds.events) {
        end = len(ds.events)
    }

    return ds.events[start:end], len(ds.events)
}

func (ds *DataService) SearchEvents(req SearchRequest) SearchResponse {
    if !ds.loaded {
        return SearchResponse{
            Data:         []UsageEvent{},
            Pagination:   PaginationInfo{},
            Aggregations: SearchAggregations{},
        }
    }

    // Apply filters
    filtered := ds.applyFilters(ds.events, req.Filters)

    // Apply search query
    if req.SearchQuery != "" {
        filtered = ds.applySearch(filtered, req.SearchQuery)
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

    var paginated []UsageEvent
    if start < len(filtered) {
        if end > len(filtered) {
            end = len(filtered)
        }
        paginated = filtered[start:end]
    }

    // Enhance events with company names and user information
    enhancedEvents := ds.enhanceEvents(paginated)

    // Calculate aggregations
    aggregations := ds.calculateAggregations(filtered)

    // Calculate pagination info
    totalPages := (len(filtered) + pageSize - 1) / pageSize

    return SearchResponse{
        Data: enhancedEvents,
        Pagination: PaginationInfo{
            Page:       page,
            PageSize:   pageSize,
            Total:      len(filtered),
            TotalPages: totalPages,
        },
        Aggregations: aggregations,
    }
}
```

### Key Algorithms

#### Time Series Analytics Algorithm
```go
func (ds *DataStore) GetTimeSeriesAnalytics(timeframe string, startDate, endDate time.Time, companies, eventTypes []string) []TimeSeriesData {
    ds.mutex.RLock()
    defer ds.mutex.RUnlock()
    
    // Filter events
    var filtered []UsageEvent
    for _, event := range ds.events {
        if event.CreatedAt.Before(startDate) || event.CreatedAt.After(endDate) {
            continue
        }
        
        if len(companies) > 0 && !contains(companies, event.CompanyID) {
            continue
        }
        
        if len(eventTypes) > 0 && !contains(eventTypes, event.Type) {
            continue
        }
        
        filtered = append(filtered, event)
    }
    
    // Group by timeframe
    grouped := make(map[string]map[string]int64)
    for _, event := range filtered {
        timestamp := truncateTime(event.CreatedAt, timeframe)
        timestampStr := timestamp.Format("2006-01-02T15:04:05Z")
        
        if grouped[timestampStr] == nil {
            grouped[timestampStr] = make(map[string]int64)
        }
        grouped[timestampStr][event.Type]++
    }
    
    // Convert to TimeSeriesData
    var result []TimeSeriesData
    for timestamp, eventTypes := range grouped {
        for eventType, count := range eventTypes {
            result = append(result, TimeSeriesData{
                Timestamp: timestamp,
                Value:     count,
                EventType: eventType,
            })
        }
    }
    
    return result
}
```

#### Data Enrichment Algorithm
```go
func (ds *DataService) enhanceEvents(events []UsageEvent) []UsageEvent {
    enhanced := make([]UsageEvent, len(events))

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

    return enhanced
}

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
```
```sql
-- Full-text search with ranking
SELECT 
    ue.id,
    ue.created_at,
    ue.company_id,
    ue.type,
    ue.content,
    ts_rank(si.content_tsv, plainto_tsquery('english', $1)) as relevance
FROM usage_events ue
JOIN search_index si ON ue.id = si.event_id
WHERE si.content_tsv @@ plainto_tsquery('english', $1)
ORDER BY relevance DESC
LIMIT $2 OFFSET $3;
```

### Error Handling
- Database connection pooling
- Query timeout handling
- Deadlock detection and resolution
- Transaction rollback on errors
- Performance monitoring and alerting

---

## Component: Caching Layer (CACHE-001)

### Purpose
Redis-based caching system for improving performance of frequently accessed data and reducing database load.

### Data Structures

#### Cache Keys Structure
```go
type CacheKey struct {
    Prefix    string
    Resource  string
    Filters   map[string]string
    Timeframe string
}

// Example cache keys:
// analytics:trends:daily:2025-01-01:2025-01-31
// analytics:metrics:companies:1dace58b-24ab-4e2c-ad36-36676e67183d
// search:results:export:page:1:size:20
// session:user:12345
```

#### Cache Configuration
```go
type CacheConfig struct {
    DefaultTTL    time.Duration `json:"default_ttl"`
    MaxMemory     string        `json:"max_memory"`
    EvictionPolicy string       `json:"eviction_policy"`
    Compression   bool          `json:"compression"`
}

type CacheEntry struct {
    Data      interface{} `json:"data"`
    CreatedAt time.Time   `json:"created_at"`
    ExpiresAt time.Time   `json:"expires_at"`
    Version   int         `json:"version"`
}
```

### Key Algorithms

#### Cache Key Generation
```go
func GenerateCacheKey(prefix, resource string, filters map[string]string, timeframe string) string {
    var parts []string
    parts = append(parts, prefix, resource)
    
    if timeframe != "" {
        parts = append(parts, timeframe)
    }
    
    // Sort filters for consistent key generation
    keys := make([]string, 0, len(filters))
    for k := range filters {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    
    for _, key := range keys {
        parts = append(parts, key, filters[key])
    }
    
    return strings.Join(parts, ":")
}
```

#### Cache Invalidation Strategy
```go
func (c *CacheService) InvalidatePattern(pattern string) error {
    keys, err := c.redis.Keys(pattern).Result()
    if err != nil {
        return err
    }
    
    if len(keys) > 0 {
        _, err = c.redis.Del(keys...).Result()
        if err != nil {
            return err
        }
    }
    
    return nil
}

func (c *CacheService) InvalidateAnalyticsCache() error {
    patterns := []string{
        "analytics:trends:*",
        "analytics:metrics:*",
        "analytics:summary:*",
    }
    
    for _, pattern := range patterns {
        if err := c.InvalidatePattern(pattern); err != nil {
            return err
        }
    }
    
    return nil
}
```

#### Cache Warming Strategy
```go
func (c *CacheService) WarmCache() error {
    // Warm up frequently accessed analytics
    timeframes := []string{"daily", "weekly", "monthly"}
    endDate := time.Now()
    
    for _, timeframe := range timeframes {
        startDate := endDate.AddDate(0, 0, -30) // Last 30 days
        
        req := AnalyticsRequest{
            DateRange: DateRangeFilter{
                Start: startDate,
                End:   endDate,
            },
            Timeframe: timeframe,
        }
        
        // Pre-compute and cache trends
        trends, err := c.analyticsService.GetTrends(req)
        if err != nil {
            continue
        }
        
        cacheKey := GenerateCacheKey("analytics", "trends", nil, timeframe)
        c.Set(cacheKey, trends, 1*time.Hour)
    }
    
    return nil
}
```

### Error Handling
- Redis connection error handling
- Cache miss fallback to database
- Circuit breaker pattern for cache failures
- Cache corruption detection and recovery
- Memory usage monitoring and alerting

---

## Component: Search Engine (SEARCH-001)

### Purpose
Full-text search system for enabling freeform text search across usage data and metadata.

### Data Structures

#### Search Models
```go
type SearchIndex struct {
    ID        string                 `json:"id"`
    EventID   string                 `json:"event_id"`
    Content   string                 `json:"content"`
    Metadata  map[string]interface{} `json:"metadata"`
    CreatedAt time.Time              `json:"created_at"`
}

type SearchQuery struct {
    Text       string            `json:"text"`
    Filters    SearchFilters     `json:"filters"`
    SortBy     string            `json:"sort_by"`
    SortOrder  string            `json:"sort_order"`
    Page       int               `json:"page"`
    PageSize   int               `json:"page_size"`
    Highlight  bool              `json:"highlight"`
}

type SearchFilters struct {
    DateRange  DateRangeFilter `json:"date_range"`
    Companies  []string        `json:"companies"`
    EventTypes []string        `json:"event_types"`
    Users      []string        `json:"users"`
}

type SearchResult struct {
    ID          string                 `json:"id"`
    EventID     string                 `json:"event_id"`
    Content     string                 `json:"content"`
    Highlights  []string               `json:"highlights"`
    Metadata    map[string]interface{} `json:"metadata"`
    Relevance   float64                `json:"relevance"`
    CreatedAt   time.Time              `json:"created_at"`
}
```

### Key Algorithms

#### Text Processing Algorithm
```go
func (s *SearchService) ProcessText(text string) string {
    // Convert to lowercase
    text = strings.ToLower(text)
    
    // Remove special characters but keep spaces
    text = regexp.MustCompile(`[^a-z0-9\s]`).ReplaceAllString(text, " ")
    
    // Normalize whitespace
    text = regexp.MustCompile(`\s+`).ReplaceAllString(text, " ")
    
    // Trim leading/trailing whitespace
    text = strings.TrimSpace(text)
    
    return text
}
```

#### Search Algorithm
```go
func (s *SearchService) Search(query SearchQuery) (*SearchResponse, error) {
    // Build search query
    searchQuery := s.buildSearchQuery(query)
    
    // Execute search
    results, err := s.executeSearch(searchQuery, query)
    if err != nil {
        return nil, err
    }
    
    // Apply filters
    filteredResults := s.applyFilters(results, query.Filters)
    
    // Sort results
    sortedResults := s.sortResults(filteredResults, query.SortBy, query.SortOrder)
    
    // Paginate results
    paginatedResults := s.paginateResults(sortedResults, query.Page, query.PageSize)
    
    // Generate highlights if requested
    if query.Highlight {
        s.generateHighlights(paginatedResults, query.Text)
    }
    
    return &SearchResponse{
        Results:  paginatedResults,
        Total:    int64(len(sortedResults)),
        Page:     query.Page,
        PageSize: query.PageSize,
    }, nil
}
```

#### Relevance Scoring Algorithm
```go
func (s *SearchService) calculateRelevance(result SearchResult, query string) float64 {
    score := 0.0
    
    // Text match score
    textScore := s.calculateTextMatchScore(result.Content, query)
    score += textScore * 0.6
    
    // Metadata match score
    metadataScore := s.calculateMetadataMatchScore(result.Metadata, query)
    score += metadataScore * 0.3
    
    // Recency score (newer events get higher score)
    recencyScore := s.calculateRecencyScore(result.CreatedAt)
    score += recencyScore * 0.1
    
    return score
}

func (s *SearchService) calculateTextMatchScore(content, query string) float64 {
    contentLower := strings.ToLower(content)
    queryLower := strings.ToLower(query)
    
    // Exact phrase match
    if strings.Contains(contentLower, queryLower) {
        return 1.0
    }
    
    // Word match
    queryWords := strings.Fields(queryLower)
    matches := 0
    for _, word := range queryWords {
        if strings.Contains(contentLower, word) {
            matches++
        }
    }
    
    return float64(matches) / float64(len(queryWords))
}
```

### Error Handling
- Search query validation
- Index corruption detection and repair
- Search timeout handling
- Partial result return on errors
- Search performance monitoring

---

## Component: Analytics Engine (ANALYTICS-001) - FUTURE FEATURE

### Purpose
Advanced analytics processing system for generating insights, detecting anomalies, and providing predictive analytics. **This component is planned for future implementation and is not part of the current implementation.**

### Data Structures

#### Analytics Models
```go
type AnomalyDetection struct {
    ID          string    `json:"id"`
    EventID     string    `json:"event_id"`
    Type        string    `json:"type"`
    Severity    string    `json:"severity"`
    Description string    `json:"description"`
    DetectedAt  time.Time `json:"detected_at"`
    Confidence  float64   `json:"confidence"`
}

type UserBehavior struct {
    UserID      string                 `json:"user_id"`
    CompanyID   string                 `json:"company_id"`
    Activity    []UserActivity         `json:"activity"`
    Patterns    map[string]interface{} `json:"patterns"`
    LastSeen    time.Time              `json:"last_seen"`
    Engagement  float64                `json:"engagement"`
}

type UserActivity struct {
    EventType   string    `json:"event_type"`
    Timestamp   time.Time `json:"timestamp"`
    Frequency   int       `json:"frequency"`
    LastOccurrence time.Time `json:"last_occurrence"`
}

type UsageInsight struct {
    ID          string    `json:"id"`
    Type        string    `json:"type"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Data        interface{} `json:"data"`
    GeneratedAt time.Time `json:"generated_at"`
    Confidence  float64   `json:"confidence"`
}
```

### Key Algorithms

#### Anomaly Detection Algorithm (FUTURE IMPLEMENTATION)
```go
// NOTE: This algorithm is planned for future implementation (Future feature)
// It is not part of the current implementation and is provided for reference only.

func (a *AnalyticsEngine) DetectAnomalies(events []UsageEvent) ([]AnomalyDetection, error) {
    var anomalies []AnomalyDetection
    
    // Group events by company and time window
    groupedEvents := a.groupEventsByCompanyAndTime(events)
    
    for companyID, companyEvents := range groupedEvents {
        // Calculate baseline metrics
        baseline := a.calculateBaseline(companyEvents)
        
        // Detect volume anomalies
        volumeAnomalies := a.detectVolumeAnomalies(companyEvents, baseline)
        anomalies = append(anomalies, volumeAnomalies...)
        
        // Detect pattern anomalies
        patternAnomalies := a.detectPatternAnomalies(companyEvents, baseline)
        anomalies = append(anomalies, patternAnomalies...)
    }
    
    return anomalies, nil
}

func (a *AnalyticsEngine) detectVolumeAnomalies(events []UsageEvent, baseline BaselineMetrics) []AnomalyDetection {
    var anomalies []AnomalyDetection
    
    // Group events by hour
    hourlyEvents := a.groupEventsByHour(events)
    
    for hour, eventCount := range hourlyEvents {
        // Calculate z-score
        zScore := (float64(eventCount) - baseline.MeanHourlyEvents) / baseline.StdDevHourlyEvents
        
        // Flag as anomaly if z-score > 2 (95% confidence)
        if math.Abs(zScore) > 2.0 {
            severity := "low"
            if math.Abs(zScore) > 3.0 {
                severity = "high"
            } else if math.Abs(zScore) > 2.5 {
                severity = "medium"
            }
            
            anomalies = append(anomalies, AnomalyDetection{
                ID:          uuid.New().String(),
                EventID:     "", // Not applicable for volume anomalies
                Type:        "volume_anomaly",
                Severity:    severity,
                Description: fmt.Sprintf("Unusual event volume: %d events (z-score: %.2f)", eventCount, zScore),
                DetectedAt:  time.Now(),
                Confidence:  math.Min(math.Abs(zScore)/4.0, 1.0), // Normalize to 0-1
            })
        }
    }
    
    return anomalies
}
```

#### User Behavior Analysis Algorithm (FUTURE IMPLEMENTATION)
```go
// NOTE: This algorithm is planned for future implementation (Future feature)
// It is not part of the current implementation and is provided for reference only.

func (a *AnalyticsEngine) AnalyzeUserBehavior(events []UsageEvent) ([]UserBehavior, error) {
    // Group events by user
    userEvents := a.groupEventsByUser(events)
    
    var behaviors []UserBehavior
    
    for userID, userEventList := range userEvents {
        behavior := UserBehavior{
            UserID:    userID,
            CompanyID: userEventList[0].CompanyID,
            Activity:  a.analyzeUserActivity(userEventList),
            Patterns:  a.identifyUserPatterns(userEventList),
            LastSeen:  a.getLastSeenTime(userEventList),
            Engagement: a.calculateEngagementScore(userEventList),
        }
        
        behaviors = append(behaviors, behavior)
    }
    
    return behaviors, nil
}

func (a *AnalyticsEngine) calculateEngagementScore(events []UsageEvent) float64 {
    if len(events) == 0 {
        return 0.0
    }
    
    // Calculate engagement based on:
    // 1. Frequency of activity
    // 2. Recency of activity
    // 3. Diversity of event types
    // 4. Consistency of usage
    
    frequency := float64(len(events)) / 30.0 // Events per day over 30 days
    recency := a.calculateRecencyScore(events)
    diversity := a.calculateDiversityScore(events)
    consistency := a.calculateConsistencyScore(events)
    
    // Weighted average
    engagement := (frequency * 0.3) + (recency * 0.3) + (diversity * 0.2) + (consistency * 0.2)
    
    return math.Min(engagement, 1.0) // Normalize to 0-1
}
```

#### Usage Pattern Insights Algorithm (FUTURE IMPLEMENTATION)
```go
// NOTE: This algorithm is planned for future implementation (Future feature)
// It is not part of the current implementation and is provided for reference only.

func (a *AnalyticsEngine) GenerateInsights(events []UsageEvent) ([]UsageInsight, error) {
    var insights []UsageInsight
    
    // Peak usage time analysis
    peakTimeInsight := a.analyzePeakUsageTimes(events)
    insights = append(insights, peakTimeInsight)
    
    // Feature adoption analysis
    featureAdoptionInsight := a.analyzeFeatureAdoption(events)
    insights = append(insights, featureAdoptionInsight)
    
    // User retention analysis
    retentionInsight := a.analyzeUserRetention(events)
    insights = append(insights, retentionInsight)
    
    // Seasonal patterns
    seasonalInsight := a.analyzeSeasonalPatterns(events)
    insights = append(insights, seasonalInsight)
    
    return insights, nil
}

func (a *AnalyticsEngine) analyzePeakUsageTimes(events []UsageEvent) UsageInsight {
    // Group events by hour of day
    hourlyDistribution := make(map[int]int)
    for _, event := range events {
        hour := event.CreatedAt.Hour()
        hourlyDistribution[hour]++
    }
    
    // Find peak hours
    var peakHours []int
    maxCount := 0
    for hour, count := range hourlyDistribution {
        if count > maxCount {
            maxCount = count
            peakHours = []int{hour}
        } else if count == maxCount {
            peakHours = append(peakHours, hour)
        }
    }
    
    return UsageInsight{
        ID:          uuid.New().String(),
        Type:        "peak_usage_times",
        Title:       "Peak Usage Hours",
        Description: fmt.Sprintf("Peak usage occurs during hours: %v", peakHours),
        Data:        hourlyDistribution,
        GeneratedAt: time.Now(),
        Confidence:  0.85,
    }
}
```

### Error Handling
- Statistical analysis error handling
- Data quality validation
- Algorithm parameter validation
- Performance monitoring for heavy computations
- Graceful degradation for insufficient data

---

## Core Implementation Summary

### Core Components Implemented
1. **Frontend React Application**: Interactive dashboard with charts and filters
2. **Backend API Server**: Go-based REST API for analytics data
3. **Data Processing Engine**: CSV ingestion and transformation
4. **In-Memory Data Store**: Fast data access and querying

### Key Features
- CSV data loading at application startup
- Data transformation from CSV to structured JSON
- In-memory data storage for fast analytics
- Time-based trend analysis
- Multi-dimensional filtering
- Responsive dashboard interface

### Technical Approach
- **Data Ingestion**: Local CSV file reading with Go standard library
- **Data Storage**: In-memory data structures (slices, maps) with thread-safe access
- **API Design**: RESTful endpoints for analytics data
- **Frontend**: React with TypeScript and chart libraries
- **Performance**: In-memory queries for fast response times

### Excluded Components (Future Phases)
- Database integration (PostgreSQL)
- Authentication and authorization
- Caching layer (Redis)
- Search engine (Elasticsearch)
- Advanced analytics (anomaly detection, ML) - Future features
- Infrastructure deployment (Docker, cloud)
- Real-time data processing
