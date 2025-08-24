# Story: Historical Metrics Dashboard (STORY-002)

**File Path:** /docs/stories/STORY-002.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a data analyst, I want to see historical metrics and aggregates displayed in shadcn/ui Card components with Recharts visualizations, so that I can understand total usage and top events by volume at a glance.

## Acceptance Criteria
1. **Total Usage Display**
   - Given I am on the dashboard page
   - When I view the metrics section
   - Then I should see the total number of events for the current month

2. **Top Events by Volume**
   - Given I am viewing the metrics section
   - When the dashboard loads
   - Then I should see a list of top 10 event types ranked by volume

3. **Active Companies Count**
   - Given I am viewing the metrics section
   - When the dashboard loads
   - Then I should see the count of unique companies with activity

4. **Metrics Card Layout**
   - Given I am on the dashboard page
   - When I view the metrics section
   - Then I should see metrics displayed in shadcn/ui Card components with:
     - Clear labels using shadcn/ui Typography components
     - Large, prominent numbers using shadcn/ui Badge components
     - Appropriate units or context using shadcn/ui Text components

5. **Data Refresh**
   - Given I have applied filters to the dashboard
   - When I change the date range or other filters
   - Then the frontend sends a request to `/api/v1/metrics` with updated filters, and the metrics cards update to reflect the filtered data

6. **Empty State**
   - Given there is no data available
   - When I view the metrics section
   - Then I should see appropriate placeholder text or zero values

7. **Performance**
   - Given I am viewing the metrics section
   - When the dashboard loads
   - Then the metrics should display within 2 seconds of page load

## Dependencies
- EPIC-001: Data Visualization and Analytics
- STORY-011: CSV Data Ingestion
- STORY-012: Data Transformation and Validation
- STORY-013: In-Memory Data Storage

## References
- HLD: [02_high_level_design.md](../02_high_level_design.md#module-backend-api-server-backend-001)
- LLD: [03_low_level_design.md](../03_low_level_design.md#component-backend-api-server-backend-001)

## Status
IMPLEMENTED
