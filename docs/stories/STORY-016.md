# Story: Multi-Company Trends Visualization with Stacked Bar Chart (STORY-016)

**File Path:** /docs/stories/STORY-016.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As a data analyst, I want to compare usage trends across multiple companies through interactive line/stacked bar charts, so that I can identify patterns, correlations, and competitive insights between different companies while also seeing the total volume distribution.

## Acceptance Criteria
1. **Multi-Company Line Chart**
   - Given I am on the Event Explorer page
   - When I select multiple companies from the filter
   - Then I should see a Recharts LineChart with separate lines for each company
   - And each line should have a distinct color for easy identification
   - **IMPLEMENTED**: LineChart component with company-specific lines and colors

2. **Multi-Company Stacked Bar Chart**
   - Given I am on the Event Explorer page
   - When I select multiple companies from the filter and choose stacked bar chart
   - Then I should see a Recharts ComposedChart with stacked bars for each company
   - And each company's data should be stacked on top of each other showing total volume
   - And each company should have a distinct color for easy identification
   - **IMPLEMENTED**: ComposedChart component with stacked bars using stackId="stack"

3. **Company Selection Interface**
   - Given I am viewing the multi-company trends
   - When I use the company filter
   - Then I should be able to select multiple companies using a multi-select component
   - And the selection should support both individual and bulk selection
   - **IMPLEMENTED**: AdvancedFilters component with company multi-select dropdown

4. **Data Aggregation**
   - Given I have selected multiple companies
   - When the chart loads
   - Then the frontend should call `/api/v1/trends/multi-company` with selected companies
   - And the response should contain time series data for each company
   - **IMPLEMENTED**: useChartData hook calls getMultiCompanyTrends API

5. **Interactive Legend**
   - Given I am viewing the multi-company chart
   - When I click on a company name in the legend
   - Then that company's line should toggle visibility
   - And the legend should show/hide accordingly
   - **IMPLEMENTED**: Recharts Legend component with interactive toggles

6. **Tooltip Information**
   - Given I hover over a data point
   - When I see the tooltip
   - Then it should display company name, timestamp, and event count
   - And it should be clearly formatted for readability
   - **IMPLEMENTED**: Custom tooltip with formatted date and value information

7. **Chart Type Toggle**
   - Given I am viewing the multi-company chart
   - When I click the chart type buttons
   - Then I should be able to switch between line, stacked bar, and pie chart views
   - And each chart type should display the same multi-company data appropriately
   - **IMPLEMENTED**: Chart type toggle buttons with LineChart, ComposedChart (stacked bars), and PieChart support

8. **Empty State Handling**
   - Given no companies are selected
   - When I view the multi-company chart
   - Then I should see a message prompting me to select companies
   - And the chart should show all available companies by default
   - **IMPLEMENTED**: Empty state message when no data is available

9. **Performance Optimization**
   - Given I have selected many companies
   - When the chart renders
   - Then it should handle up to 10 companies efficiently
   - And the UI should remain responsive
   - **IMPLEMENTED**: ResponsiveContainer and optimized data transformation

## Dependencies
- EPIC-001: Data Visualization and Analytics
- STORY-001: Time-based Usage Trends
- STORY-005: Multi-dimensional Filters
- STORY-011: CSV Data Ingestion
- STORY-012: Data Transformation and Validation
- STORY-013: In-Memory Data Storage

## References
- HLD: [02_high_level_design.md](../02_high_level_design.md#module-frontend-application-frontend-001)
- LLD: [03_low_level_design.md](../03_low_level_design.md#component-frontend-react-application-frontend-001)

## Status
IMPLEMENTED

## Technical Tasks

### Frontend Tasks (IMPLEMENTED)
1. ✅ Create MultiCompanyTrendsChart component using Recharts LineChart
2. ✅ Implement company multi-select filter component (AdvancedFilters)
3. ✅ Add interactive legend with toggle functionality (Recharts Legend)
4. ✅ Create enhanced tooltips with company information (Custom tooltips)
5. ✅ Integrate with `/api/v1/trends/multi-company` endpoint (useChartData hook)
6. ✅ Add chart type toggle (Line/Stacked Bar/Pie chart support)
7. ✅ Implement empty state handling (No data message)
8. ✅ Add performance optimization for multiple companies (ResponsiveContainer)
9. ✅ Replace BarChart with ComposedChart for stacked bar visualization

### Backend Tasks (IMPLEMENTED)
1. ✅ Ensure `/api/v1/trends/multi-company` endpoint is properly implemented
2. ✅ Verify multi-company data aggregation logic
3. ✅ Add proper error handling for invalid company selections
4. ✅ Optimize query performance for multiple companies
5. ✅ Add validation for company parameter parsing

## Implementation Notes
- This feature extends STORY-001 with multi-company comparison capabilities
- The backend endpoint `/api/v1/trends/multi-company` is already implemented
- Supports line, stacked bar, and pie chart visualizations
- Includes automatic company color assignment for visual distinction
- Stacked bar chart shows total volume distribution across companies over time
