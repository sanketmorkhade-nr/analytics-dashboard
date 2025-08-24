# Story: Most Active Users Dashboard (STORY-022)

**File Path:** /docs/stories/STORY-022.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a product manager, I want to see the most active users on the dashboard, so that I can understand user engagement patterns and identify power users.

## Acceptance Criteria
1. **Active Users Chart Display**
   - Given I am viewing the dashboard
   - When I scroll down to the analytics section
   - Then I should see a "Most Active Users" chart

2. **User Activity Ranking**
   - Given the active users chart is displayed
   - When I view the chart
   - Then I should see users ranked by their event count in descending order

3. **Dual Metric Visualization**
   - Given the active users chart is displayed
   - When I view the chart
   - Then I should see both event count and companies count for each user

4. **Bar Chart Visualization**
   - Given the active users chart is displayed
   - When I view the chart
   - Then I should see a bar chart showing users and their activity metrics

5. **Data Filtering**
   - Given I have applied date filters to the dashboard
   - When I view the active users chart
   - Then the chart should reflect data from the selected date range

6. **Loading States**
   - Given the active users data is being fetched
   - When the data is loading
   - Then I should see a skeleton loading state for the chart

7. **Empty State**
   - Given there is no user data available
   - When I view the active users chart
   - Then I should see an appropriate empty state message

8. **Responsive Design**
   - Given I am viewing the dashboard on different screen sizes
   - When I view the active users chart
   - Then the chart should be responsive and properly sized

9. **Tooltip Information**
   - Given I hover over a bar in the chart
   - When I hover
   - Then I should see a tooltip with user name, event count, and companies count

10. **Chart Integration**
    - Given the active users chart is displayed
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
- [x] Create `GetMostActiveUsers` function in DataService
  - [x] Filter events by date range and companies
  - [x] Count events by user
  - [x] Track unique companies per user
  - [x] Track last activity timestamp
  - [x] Sort by event count in descending order
  - [x] Support limit parameter for result count

- [x] Add UserActivity model
  - [x] User field for user identification
  - [x] EventCount field for activity level
  - [x] Companies field for company count
  - [x] LastActivity field for recent activity

- [x] Add API endpoint `/api/v1/analytics/active-users`
  - [x] Support query parameters: startDate, endDate, companies, limit
  - [x] Return JSON response with data and total count
  - [x] Handle empty data scenarios

### Frontend Implementation ✅
- [x] Create `useActiveUsersData` custom hook
  - [x] Fetch data from API endpoint
  - [x] Handle loading and error states
  - [x] Support parameter updates

- [x] Create `ActiveUsersChart` component
  - [x] Bar chart visualization using Recharts
  - [x] Dual metric display (events and companies)
  - [x] Loading skeleton state
  - [x] Empty state handling
  - [x] Responsive design
  - [x] Tooltip functionality

- [x] Integrate with Dashboard
  - [x] Add chart to dashboard layout
  - [x] Connect with date range filters
  - [x] Position in analytics section

### Key Features Implemented ✅
- [x] Active Users Chart Display in dashboard
- [x] User Activity Ranking by event count
- [x] Dual Metric Visualization (events + companies)
- [x] Bar Chart Visualization
- [x] Data Filtering by date range
- [x] Loading States with skeleton
- [x] Empty State handling
- [x] Responsive Design
- [x] Tooltip Information
- [x] Chart Integration

### File Structure
```
backend/internal/
├── services/
│   └── data_service.go          # Added GetMostActiveUsers function
├── api/handlers/
│   └── event_handlers.go        # Added GetMostActiveUsers handler
└── models/
    └── usage_event.go           # Added UserActivity model

frontend/src/features/dashboard/
├── hooks/
│   └── useActiveUsersData.ts    # Custom hook for active users data
├── components/
│   └── ActiveUsersChart.tsx     # Chart component
└── services/
    └── dashboardService.ts      # Added getMostActiveUsers API call
```
