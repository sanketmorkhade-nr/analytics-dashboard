# Story: Top Endpoints Insights Dashboard (STORY-023)

**File Path:** /docs/stories/STORY-023.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a product manager, I want to see the most used endpoints on the dashboard, so that I can understand which API endpoints are most frequently accessed and identify usage patterns.

## Acceptance Criteria
1. **Top Endpoints Insights Display**
   - Given I am viewing the dashboard
   - When I scroll down to the insights section
   - Then I should see a "Most Used Endpoints" insights card

2. **Endpoint Ranking**
   - Given the top endpoints insights card is displayed
   - When I view the card
   - Then I should see endpoints ranked by their event count in descending order

3. **Endpoint Information Display**
   - Given the top endpoints insights card is displayed
   - When I view each endpoint entry
   - Then I should see endpoint name, event count, user count, and company count

4. **Progress Bar Visualization**
   - Given the top endpoints insights card is displayed
   - When I view each endpoint entry
   - Then I should see a progress bar showing the percentage of total usage

5. **Data Filtering**
   - Given I have applied date filters to the dashboard
   - When I view the top endpoints insights card
   - Then the card should reflect data from the selected date range

6. **Loading States**
   - Given the top endpoints data is being fetched
   - When the data is loading
   - Then I should see a skeleton loading state for the card

7. **Empty State**
   - Given there is no endpoint data available
   - When I view the top endpoints insights card
   - Then I should see an appropriate empty state message

8. **Responsive Design**
   - Given I am viewing the dashboard on different screen sizes
   - When I view the top endpoints insights card
   - Then the card should be responsive and properly sized

9. **Visual Hierarchy**
   - Given the top endpoints insights card is displayed
   - When I view the card
   - Then I should see clear visual hierarchy with proper typography and spacing

10. **Card Integration**
    - Given the top endpoints insights card is displayed
    - When I view the dashboard layout
    - Then the card should be properly integrated with other dashboard components

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
- [x] Create `GetTopEndpointsByUsage` function in DataService
  - [x] Filter events by date range and companies
  - [x] Count events by endpoint
  - [x] Track unique users and companies per endpoint
  - [x] Calculate percentage of total usage
  - [x] Sort by event count in descending order
  - [x] Support limit parameter for result count

- [x] Add EndpointActivity model
  - [x] Endpoint field for endpoint identification
  - [x] EventCount field for usage level
  - [x] UserCount field for unique users
  - [x] CompanyCount field for unique companies
  - [x] Percentage field for usage percentage

- [x] Add API endpoint `/api/v1/analytics/top-endpoints`
  - [x] Support query parameters: startDate, endDate, companies, limit
  - [x] Return JSON response with data and total count
  - [x] Handle empty data scenarios

### Frontend Implementation ✅
- [x] Create `useEndpointsData` custom hook
  - [x] Fetch data from API endpoint
  - [x] Handle loading and error states
  - [x] Support parameter updates

- [x] Create `TopEndpointsInsights` component
  - [x] Card-based layout with proper spacing
  - [x] Endpoint ranking with purple badges
  - [x] Event count display with trending icon
  - [x] User and company count details
  - [x] Progress bar for usage percentage
  - [x] Loading skeleton state
  - [x] Empty state handling
  - [x] Responsive design
  - [x] Hover effects and transitions

- [x] Integrate with Dashboard
  - [x] Add component to dashboard layout
  - [x] Connect with date range filters
  - [x] Position in insights section

### Key Features Implemented ✅
- [x] Top Endpoints Insights Display in dashboard
- [x] Endpoint Ranking by event count
- [x] Comprehensive Endpoint Information (events, users, companies)
- [x] Progress Bar Visualization for usage percentage
- [x] Data Filtering by date range
- [x] Loading States with skeleton
- [x] Empty State handling
- [x] Responsive Design
- [x] Visual Hierarchy with proper typography
- [x] Card Integration with dashboard layout

### File Structure
```
backend/internal/
├── services/
│   └── data_service.go          # Added GetTopEndpointsByUsage function
├── api/handlers/
│   └── event_handlers.go        # Added GetTopEndpointsByUsage handler
└── models/
    └── usage_event.go           # Added EndpointActivity model

frontend/src/features/dashboard/
├── hooks/
│   └── useEndpointsData.ts      # Custom hook for endpoints data
├── components/
│   └── TopEndpointsInsights.tsx # Insights component
└── services/
    └── dashboardService.ts      # Added getTopEndpointsByUsage API call
```
