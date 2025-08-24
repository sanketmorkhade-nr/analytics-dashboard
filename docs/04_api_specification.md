# API Specification - Usage Analytics Dashboard

**File Path:** /docs/04_api_specification.md  
**Last Updated:** 2025-01-27  
**Author:** AI-Agent  

---

## Overview

This document defines the RESTful API specification for the Usage Analytics Dashboard POC. The API provides endpoints for data retrieval, search, filtering, and analytics functionality.

---

## Base URL
```
http://localhost:8080/api/v1
```

---

## Authentication
**Note:** This POC does not implement authentication. All endpoints are publicly accessible.

---

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

### SearchResponse
```json
{
  "data": [
    {
      "id": "string",
      "created_at": "string",
      "company_id": "string",
      "type": "string",
      "content": "string",
      "attribute": "string",
      "updated_at": "string",
      "original_timestamp": "string",
      "value": "number"
    }
  ],
  "pagination": {
    "page": "number",
    "pageSize": "number",
    "total": "number",
    "totalPages": "number"
  },
  "aggregations": {
    "totalEvents": "number",
    "uniqueCompanies": "number",
    "eventTypes": [
      {
        "type": "string",
        "count": "number"
      }
    ]
  }
}
```

### TimeSeriesResponse
```json
{
  "data": [
    {
      "timestamp": "string (ISO 8601 timestamp)",
      "value": "number",
      "eventType": "string"
    }
  ],
  "timeframe": "string",
  "totalPoints": "number"
}
```

### MetricsResponse
```json
{
  "totalEvents": "number",
  "totalValue": "number",
  "uniqueCompanies": "number",
  "uniqueUsers": "number",
  "avgValuePerEvent": "number",
  "topEventTypes": [
    {
      "type": "string",
      "count": "number",
      "percentage": "number"
    }
  ],
  "timeRange": {
    "start": "string",
    "end": "string"
  }
}
```

---

## API Endpoints

### 1. Get All Data
**GET** `/api/v1/events`

Retrieves all usage events with optional pagination.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20, max: 100)

#### Response
```json
{
  "data": [UsageEvent],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 4431,
    "totalPages": 222
  }
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/events?page=1&pageSize=20"
```

---

### 2. Search and Filter Data
**POST** `/api/v1/events/search`

Performs complex search and filtering operations on usage data.

#### Request Body
```json
{
  "searchQuery": "export",
  "filters": {
    "dateRange": {
      "start": "2025-05-01",
      "end": "2025-05-31"
    },
    "companies": ["1dace58b-24ab-4e2c-ad36-36676e67183d"],
    "eventTypes": ["Action"],
    "timeframe": "daily"
  },
  "pagination": {
    "page": 1,
    "pageSize": 20
  }
}
```

#### Response
```json
{
  "data": [UsageEvent],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  },
  "aggregations": {
    "totalEvents": 150,
    "uniqueCompanies": 3,
    "eventTypes": [
      {
        "type": "Action",
        "count": 150
      }
    ]
  }
}
```

#### Example Request
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

---

### 3. Get Time Series Data
**GET** `/api/v1/trends`

Retrieves time series data for trend analysis.

#### Query Parameters
- `timeframe` (required): Aggregation timeframe (daily|weekly|monthly)
- `startDate` (required): Start date (ISO 8601)
- `endDate` (required): End date (ISO 8601)
- `companies` (optional): Comma-separated company IDs
- `eventTypes` (optional): Comma-separated event types

#### Response
```json
{
  "data": [
    {
      "timestamp": "2025-05-01T00:00:00Z",
      "value": 45,
      "eventType": "Action"
    },
    {
      "timestamp": "2025-05-02T00:00:00Z",
      "value": 52,
      "eventType": "Action"
    }
  ],
  "timeframe": "daily",
  "totalPoints": 31
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/trends?timeframe=daily&startDate=2025-05-01&endDate=2025-05-31"
```

---

### 4. Get Metrics
**GET** `/api/v1/metrics`

Retrieves aggregated metrics for dashboard display.

#### Query Parameters
- `startDate` (optional): Start date for metrics calculation
- `endDate` (optional): End date for metrics calculation
- `companies` (optional): Comma-separated company IDs
- `eventTypes` (optional): Comma-separated event types

#### Response
```json
{
  "totalEvents": 4431,
  "activeCompanies": 4,
  "topEventTypes": [
    {
      "type": "Action",
      "count": 4431,
      "percentage": 100.0
    }
  ],
  "timeRange": {
    "start": "2025-05-30T00:00:00Z",
    "end": "2025-07-22T00:00:00Z"
  }
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/metrics?startDate=2025-05-01&endDate=2025-05-31"
```

---

### 5. Get Companies
**GET** `/api/v1/companies`

Retrieves list of all companies in the dataset.

#### Response
```json
{
  "data": [
    {
      "id": "1dace58b-24ab-4e2c-ad36-36676e67183d",
      "name": "Sample Company",
      "eventCount": 2500
    },
    {
      "id": "081e763c-822b-41ed-b1a1-e23a9e2e8c7a",
      "name": "Facebook",
      "eventCount": 1200
    }
  ],
  "total": 4
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/companies"
```

---

### 6. Get Event Types
**GET** `/api/v1/events`

Retrieves list of all event types in the dataset.

#### Response
```json
{
  "data": [
    {
      "type": "Action",
      "count": 4431,
      "percentage": 100.0
    }
  ],
  "total": 1
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/events"
```

---

### 7. Get Top Active Companies
**GET** `/api/v1/analytics/companies`

Retrieves data for the top 5 most active companies.

#### Response
```json
{
  "data": [
    {
      "company_id": "1dace58b-24ab-4e2c-ad36-36676e67183d",
      "name": "Sample Company",
      "event_count": 2500,
      "percentage": 56.4,
      "last_activity": "2025-07-22T00:00:00Z"
    },
    {
      "company_id": "081e763c-822b-41ed-b1a1-e23a9e2e8c7a",
      "name": "Facebook",
      "event_count": 1200,
      "percentage": 27.1,
      "last_activity": "2025-07-21T00:00:00Z"
    }
  ],
  "total": 4
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/analytics/companies"
```

---

### 8. Get Event Distribution
**GET** `/api/v1/analytics/event-distribution`

Retrieves usage distribution by event type.

#### Response
```json
{
  "data": [
    {
      "type": "Action",
      "count": 4431,
      "percentage": 100.0,
      "companies": 4
    }
  ],
  "total": 1
}
```

#### Example Request
```bash
curl -X GET "http://localhost:8080/api/v1/analytics/event-distribution"
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Common Error Codes
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Resource not found
- `422`: Unprocessable Entity - Validation error
- `500`: Internal Server Error - Server error

### Example Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date range: end date must be after start date",
    "details": {
      "field": "dateRange",
      "value": {
        "start": "2025-05-31",
        "end": "2025-05-01"
      }
    }
  }
}
```

---

## Data Flow

### 1. Application Startup
```
CSV File → Data Processor → In-Memory Store → API Ready
```

### 2. User Interaction Flow
```
User Action → Frontend Component → API Call → In-Memory Query → Response → UI Update
```

### 3. Search and Filter Flow
```
Search Request → Filter Validation → In-Memory Filtering → Aggregation → Pagination → Response
```

---

## Performance Requirements

### Response Times
- **Simple Queries**: < 100ms
- **Complex Searches**: < 500ms
- **Aggregations**: < 200ms
- **Large Datasets**: < 1000ms

### Throughput
- **Concurrent Requests**: 100+ requests/second
- **Data Size**: Support for 50,000+ records in memory

---

## Implementation Notes

### Backend Implementation
1. **Data Loading**: Load CSV at startup into in-memory data structures
2. **Search Logic**: Implement in-memory filtering and search
3. **Pagination**: Handle pagination in memory
4. **Caching**: No external caching required (in-memory only)
5. **Validation**: Input validation for all parameters

### Frontend Integration
1. **API Service**: Create service functions for all endpoints
2. **State Management**: Handle API responses in React state
3. **Error Handling**: Display appropriate error messages
4. **Loading States**: Show loading indicators during API calls
5. **Data Transformation**: Transform API responses for UI components

---

## Testing Strategy

### API Testing
1. **Unit Tests**: Test individual endpoint logic
2. **Integration Tests**: Test full request/response cycle
3. **Performance Tests**: Verify response time requirements
4. **Error Tests**: Test error handling scenarios

### Frontend Testing
1. **Component Tests**: Test UI components with mock data
2. **Integration Tests**: Test API integration
3. **User Flow Tests**: Test complete user journeys
4. **Error Handling Tests**: Test error scenarios
