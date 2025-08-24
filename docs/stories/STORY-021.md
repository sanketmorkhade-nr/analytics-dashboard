# Story: Top Events by Volume Dashboard (STORY-021)

**File Path:** /docs/stories/STORY-021.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a product manager, I want to see the top events by volume on the dashboard, so that I can understand which event types are most frequently used and identify usage patterns.

## Acceptance Criteria
1. **Top Events Chart Display**
   - Given I am viewing the dashboard
   - When I scroll down to the analytics section
   - Then I should see a "Top Events by Volume" chart

2. **Event Type Ranking**
   - Given the top events chart is displayed
   - When I view the chart
   - Then I should see event types ranked by their event count in descending order

3. **Bar Chart Visualization**
   - Given the top events chart is displayed
   - When I view the chart
   - Then I should see a horizontal bar chart showing event types and their counts

4. **Data Filtering**
   - Given I have applied date filters to the dashboard
   - When I view the top events chart
   - Then the chart should reflect data from the selected date range

5. **Loading States**
   - Given the top events data is being fetched
   - When the data is loading
   - Then I should see a skeleton loading state for the chart

6. **Empty State**
   - Given there is no event data available
   - When I view the top events chart
   - Then I should see an appropriate empty state message

7. **Responsive Design**
   - Given I am viewing the dashboard on different screen sizes
   - When I view the top events chart
   - Then the chart should be responsive and properly sized

8. **Tooltip Information**
   - Given I hover over a bar in the chart
   - When I hover
   - Then I should see a tooltip with the event type name and exact count

9. **Chart Integration**
   - Given the top events chart is displayed
   - When I view the dashboard layout
   - Then the chart should be properly integrated with other dashboard components

10. **Performance**
    - Given the dashboard is loaded
    - When I view the top events chart
    - Then the chart should load within 2 seconds

## Dependencies
- EPIC-001: Data Visualization and Analytics
- STORY-001: Time-based Usage Trends
- STORY-002: Historical Metrics Dashboard

## References
- HLD: [02_high_level_design.md](../02_high_level_design.md#module-frontend-application-frontend-001)
- LLD: [03_low_level_design.md](../03_low_level_design.md#component-frontend-react-application-frontend-001)

## Status
IMPLEMENTED

## Technical Tasks

### Backend Implementation ✅
- [x] Create `GetTopEventsByVolume` function in DataService
  - [x] Filter events by date range and companies
  - [x] Count events by type
  - [x] Sort by count in descending order
  - [x] Support limit parameter for result count

- [x] Add API endpoint `/api/v1/analytics/top-events`
  - [x] Support query parameters: startDate, endDate, companies, limit
  - [x] Return JSON response with data and total count
  - [x] Handle empty data scenarios

### Frontend Implementation ✅
- [x] Create `useTopEventsData` custom hook
  - [x] Fetch data from API endpoint
  - [x] Handle loading and error states
  - [x] Support parameter updates

- [x] Create `TopEventsChart` component
  - [x] Bar chart visualization using Recharts
  - [x] Loading skeleton state
  - [x] Empty state handling
  - [x] Responsive design
  - [x] Tooltip functionality

- [x] Integrate with Dashboard
  - [x] Add chart to dashboard layout
  - [x] Connect with date range filters
  - [x] Position in analytics section

### Key Features Implemented ✅
- [x] Top Events Chart Display in dashboard
- [x] Event Type Ranking by volume
- [x] Bar Chart Visualization
- [x] Data Filtering by date range
- [x] Loading States with skeleton
- [x] Empty State handling
- [x] Responsive Design
- [x] Tooltip Information
- [x] Chart Integration
- [x] Performance optimization

### File Structure
```
backend/internal/
├── services/
│   └── data_service.go          # Added GetTopEventsByVolume function
├── api/handlers/
│   └── event_handlers.go        # Added GetTopEventsByVolume handler
└── models/
    └── usage_event.go           # EventTypeCount model

frontend/src/features/dashboard/
├── hooks/
│   └── useTopEventsData.ts      # Custom hook for top events data
├── components/
│   └── TopEventsChart.tsx       # Chart component
└── services/
    └── dashboardService.ts      # Added getTopEventsByVolume API call
```
