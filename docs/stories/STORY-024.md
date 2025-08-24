# Story: Top Companies Chart Dashboard (STORY-024)

**File Path:** /docs/stories/STORY-024.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a product manager, I want to see the most active companies on the dashboard in a chart format, so that I can understand which companies are generating the most activity and identify usage patterns across different organizations.

## Acceptance Criteria
1. **Top Companies Chart Display**
   - Given I am viewing the dashboard
   - When I scroll down to the charts section
   - Then I should see a "Top 5 Most Active Companies" chart

2. **Company Ranking**
   - Given the top companies chart is displayed
   - When I view the chart
   - Then I should see companies ranked by their event count in descending order

3. **Multi-Metric Visualization**
   - Given the top companies chart is displayed
   - When I view the chart
   - Then I should see bars representing events, users, and endpoints for each company

4. **Chart Interactivity**
   - Given the top companies chart is displayed
   - When I hover over chart elements
   - Then I should see tooltips with detailed information

5. **Data Filtering**
   - Given I have applied date filters to the dashboard
   - When I view the top companies chart
   - Then the chart should reflect data from the selected date range

6. **Loading States**
   - Given the top companies data is being fetched
   - When the data is loading
   - Then I should see a skeleton loading state for the chart

7. **Empty State**
   - Given there is no company data available
   - When I view the top companies chart
   - Then I should see an appropriate empty state message

8. **Responsive Design**
   - Given I am viewing the dashboard on different screen sizes
   - When I view the top companies chart
   - Then the chart should be responsive and properly sized

9. **Visual Hierarchy**
   - Given the top companies chart is displayed
   - When I view the chart
   - Then I should see clear visual hierarchy with proper colors and legends

10. **Chart Integration**
    - Given the top companies chart is displayed
    - When I view the dashboard layout
    - Then the chart should be properly integrated with other dashboard components

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
- [x] Create `GetTopActiveCompaniesWithFiltering` function in DataService
  - [x] Filter events by date range and companies
  - [x] Count events by company
  - [x] Track unique users and endpoints per company
  - [x] Calculate last activity per company
  - [x] Sort by event count in descending order
  - [x] Support limit parameter for result count

- [x] Add CompanyActivity model
  - [x] CompanyName field for company identification
  - [x] EventCount field for usage level
  - [x] UserCount field for unique users
  - [x] EndpointCount field for unique endpoints
  - [x] LastActivity field for recent activity

- [x] Add API endpoint `/api/v1/analytics/top-companies`
  - [x] Support query parameters: startDate, endDate, companies, limit
  - [x] Return JSON response with data and total count
  - [x] Handle empty data scenarios

### Frontend Implementation ✅
- [x] Create `useCompaniesData` custom hook
  - [x] Fetch data from API endpoint
  - [x] Handle loading and error states
  - [x] Support parameter updates

- [x] Create `TopCompaniesChart` component
  - [x] Bar chart layout with proper spacing
  - [x] Multi-metric visualization (events, users, endpoints)
  - [x] Interactive tooltips with detailed information
  - [x] Color-coded bars for different metrics
  - [x] Loading skeleton state
  - [x] Empty state handling
  - [x] Responsive design
  - [x] Proper legends and labels

- [x] Integrate with Dashboard
  - [x] Add component to dashboard layout
  - [x] Connect with date range filters
  - [x] Position side by side with Top Events Chart

### Key Features Implemented ✅
- [x] Top Companies Chart Display in dashboard
- [x] Company Ranking by event count
- [x] Multi-Metric Visualization (events, users, endpoints)
- [x] Chart Interactivity with tooltips
- [x] Data Filtering by date range
- [x] Loading States with skeleton
- [x] Empty State handling
- [x] Responsive Design
- [x] Visual Hierarchy with proper colors
- [x] Chart Integration with dashboard layout

### File Structure
```
backend/internal/
├── services/
│   └── data_service.go          # Added GetTopActiveCompaniesWithFiltering function
├── api/handlers/
│   └── event_handlers.go        # Added GetTopActiveCompaniesWithFiltering handler
└── models/
    └── usage_event.go           # Added CompanyActivity model

frontend/src/features/dashboard/
├── hooks/
│   └── useCompaniesData.ts      # Custom hook for companies data
├── components/
│   └── TopCompaniesChart.tsx    # Chart component
└── services/
    └── dashboardService.ts      # Added getTopActiveCompanies API call
```
