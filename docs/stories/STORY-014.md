# Story: Overall Insights Dashboard (STORY-014)

**File Path:** /docs/stories/STORY-014.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a data analyst, I want to view an overall insights dashboard with comprehensive metrics and trends, so that I can get a complete overview of usage patterns and key performance indicators.

## Acceptance Criteria
1. **Metrics Overview Display**
   - Given I am on the overall insights dashboard
   - When the page loads
   - Then I should see MetricCard components displaying:
     - Total Events (from /api/v1/metrics)
     - Total Value (from /api/v1/metrics)
     - Unique Companies (from /api/v1/metrics)
     - Unique Users (from /api/v1/metrics)
     - Average Value per Event (from /api/v1/metrics)

2. **Trends Overview Chart**
   - Given I am viewing the trends overview
   - When I select a timeframe (daily/weekly/monthly)
   - Then the frontend sends a request to `/api/v1/trends` and displays a Recharts LineChart

3. **Top Companies Widget**
   - Given I am viewing the top companies section
   - When the component loads
   - Then I should see data from `/api/v1/analytics/companies` displayed in a shadcn/ui Card component

4. **Event Distribution Chart**
   - Given I am viewing the event distribution section
   - When the component loads
   - Then I should see data from `/api/v1/analytics/event-distribution` displayed as a Recharts PieChart

5. **Filter Integration**
   - Given I have applied filters to the dashboard
   - When I change date range or company filters
   - Then all components should update to reflect the filtered data

6. **Loading States**
   - Given I am waiting for data to load
   - When components are loading
   - Then I should see shadcn/ui Skeleton components

7. **Error Handling**
   - Given there is an error loading data
   - When an error occurs
   - Then I should see appropriate error messages using shadcn/ui Alert components

8. **Responsive Layout**
   - Given I am viewing the dashboard on different screen sizes
   - When I resize the browser
   - Then the layout should adapt responsively using Tailwind CSS grid classes

## Dependencies
- EPIC-001: Data Visualization and Analytics
- STORY-011: CSV Data Ingestion
- STORY-012: Data Transformation and Validation
- STORY-013: In-Memory Data Storage

## References
- HLD: [02_high_level_design.md](../02_high_level_design.md#module-frontend-application-frontend-001)
- LLD: [03_low_level_design.md](../03_low_level_design.md#component-frontend-react-application-frontend-001)

## Status
IMPLEMENTED

## Technical Tasks

### Frontend Tasks
1. Create OverallInsights component with shadcn/ui layout
2. Implement MetricsOverview component with MetricCard components
3. Create TrendsOverview component using Recharts LineChart
4. Implement TopCompaniesWidget with data from /api/v1/analytics/companies
5. Create EventDistributionChart using Recharts PieChart
6. Add filter integration for all components
7. Implement loading states using shadcn/ui Skeleton components
8. Add error handling with shadcn/ui Alert components

### Backend Tasks
1. Ensure /api/v1/metrics endpoint returns all required metrics
2. Verify /api/v1/trends endpoint supports timeframe filtering
3. Implement /api/v1/analytics/companies endpoint for top companies
4. Implement /api/v1/analytics/event-distribution endpoint
5. Add proper error handling and validation
