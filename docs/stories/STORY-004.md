# Story: Company-based Usage Insights (STORY-004)

**File Path:** /docs/stories/STORY-004.md  
**Last Updated:** 2025-08-23  
**Author:** AI-Agent  

## Description
As an internal teammate, I want to view usage insights by company, so that I can understand customer engagement across different organizations.

## Acceptance Criteria
1. **Company Selection**
   - Given I am on the dashboard page
   - When I select company-based view
   - Then I should see a dropdown or list of available companies

2. **Company Usage Overview**
   - Given I have selected a company
   - When I view the company insights
   - Then I should see:
     - Total events for that company
     - Most active event types for that company
     - Usage timeline for that company

3. **Company Comparison**
   - Given I am viewing company insights
   - When I select multiple companies
   - Then I should be able to compare their usage patterns side by side

4. **Company Activity Timeline**
   - Given I have selected a company
   - When I view the company timeline
   - Then I should see a chart showing:
     - Usage activity over time
     - Peak usage periods
     - Event type distribution

5. **Company Filter Integration**
   - Given I am viewing company insights
   - When I apply other filters (date range, event types)
   - Then the company data should be filtered accordingly

6. **Company Details**
   - Given I am viewing company insights
   - When I click on a company
   - Then I should see detailed information including:
     - Company name and ID
     - First and last activity dates
     - Total event count
     - Most frequent event types

7. **Empty Company State**
   - Given a company has no usage data
   - When I select that company
   - Then I should see an appropriate message indicating no activity

## Dependencies
- EPIC-001: Data Visualization and Analytics
- STORY-011: CSV Data Ingestion
- STORY-012: Data Transformation and Validation
- STORY-013: In-Memory Data Storage

## References
- HLD: [02_high_level_design.md](../02_high_level_design.md#module-backend-api-server-backend-001)
- LLD: [03_low_level_design.md](../03_low_level_design.md#component-backend-api-server-backend-001)

## Status
NOT IMPLEMENTED
