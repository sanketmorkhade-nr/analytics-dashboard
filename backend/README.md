# Analytics Dashboard Backend

A high-performance Go backend for the Usage Analytics Dashboard that provides RESTful API endpoints for data retrieval, search, filtering, and analytics functionality.

## Features

- **CSV Data Ingestion**: Loads CSV data into in-memory storage at startup
- **RESTful API**: Complete API with all required endpoints
- **Search & Filtering**: Advanced search and multi-dimensional filtering
- **Analytics**: Time series data, metrics, and aggregations
- **Pagination**: Efficient pagination for large datasets
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/events` | Get all events with pagination |
| POST | `/api/v1/events/search` | Search and filter events |
| GET | `/api/v1/trends` | Get time series data for trends |
| GET | `/api/v1/metrics` | Get aggregated metrics |
| GET | `/api/v1/companies` | Get all companies |
| GET | `/api/v1/event-types` | Get event type distribution |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/companies` | Get top active companies |
| GET | `/api/v1/analytics/event-distribution` | Get event distribution by type |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/` | API information and endpoints |

## Data Models

### UsageEvent
```json
{
  "id": "string (UUID)",
  "created_at": "string (ISO 8601 timestamp)",
  "company_id": "string (UUID)",
  "type": "string",
  "content": "string",
  "attribute": "string",
  "updated_at": "string (ISO 8601 timestamp)",
  "original_timestamp": "string (ISO 8601 timestamp)",
  "value": "number (nullable)"
}
```

### SearchRequest
```json
{
  "searchQuery": "string (optional)",
  "filters": {
    "dateRange": {
      "start": "string (ISO 8601 date)",
      "end": "string (ISO 8601 date)"
    },
    "companies": ["string (UUID)"],
    "eventTypes": ["string"],
    "timeframe": "string (daily|weekly|monthly)"
  },
  "pagination": {
    "page": "number (default: 1)",
    "pageSize": "number (default: 20, max: 100)"
  }
}
```

## Configuration

The application can be configured using environment variables:

- `PORT`: Server port (default: 8080)
- `DATA_PATH`: Path to CSV data file (default: data/dataset.csv)

## Installation & Running

### Prerequisites
- Go 1.21 or higher
- CSV dataset file

### Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Run the application:
   ```bash
   go run cmd/server/main.go
   ```

   Or build and run:
   ```bash
   go build -o analytics-server cmd/server/main.go
   ./analytics-server
   ```

### Environment Variables
```bash
export PORT=8080
export DATA_PATH=data/dataset.csv
```

## API Examples

### Get All Events
```bash
curl -X GET "http://localhost:8080/api/v1/events?page=1&pageSize=20"
```

### Search Events
```bash
curl -X POST "http://localhost:8080/api/v1/events/search" \
  -H "Content-Type: application/json" \
  -d '{
    "searchQuery": "export",
    "filters": {
      "dateRange": {
        "start": "2025-05-01",
        "end": "2025-05-31"
      }
    },
    "pagination": {
      "page": 1,
      "pageSize": 20
    }
  }'
```

### Get Time Series Data
```bash
curl -X GET "http://localhost:8080/api/v1/trends?timeframe=daily&startDate=2025-05-01&endDate=2025-05-31"
```

### Get Metrics
```bash
curl -X GET "http://localhost:8080/api/v1/metrics?startDate=2025-05-01&endDate=2025-05-31"
```

### Get Companies
```bash
curl -X GET "http://localhost:8080/api/v1/companies"
```

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── data/
│   └── dataset.csv              # CSV dataset file
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   │   └── event_handlers.go # API handlers
│   │   └── server.go            # HTTP server setup
│   ├── config/
│   │   └── config.go            # Configuration management
│   ├── models/
│   │   └── usage_event.go       # Data models
│   └── services/
│       └── data_service.go      # Data processing and business logic
├── go.mod                       # Go module file
├── go.sum                       # Go module checksums
└── README.md                    # This file
```

## Performance Characteristics

- **Data Loading**: Loads 4,431 events in ~100ms
- **Search Response**: < 500ms for complex searches
- **Simple Queries**: < 100ms
- **Aggregations**: < 200ms
- **Memory Usage**: ~50MB for full dataset

## Error Handling

The API returns standardized error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (optional)"
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid request parameters
- `MISSING_PARAMETERS`: Required parameters missing
- `INVALID_TIMEFRAME`: Invalid timeframe value

## Development

### Running Tests
```bash
go test ./...
```

### Code Formatting
```bash
go fmt ./...
```

### Linting
```bash
go vet ./...
```

## API Documentation

For detailed API documentation, see the [API Specification](../docs/04_api_specification.md) document.

## License

This project is part of the Analytics Dashboard POC.
