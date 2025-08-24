# 📑 Markdown Formatting Rules

**File Path:** /docs/00_formatting_rules.md  
**Last Updated:** 2025-08-22  
**Author:** AI-Agent

These formatting rules **must be followed strictly** in all project documentation (`.md` files).  

---

## 1. General
- Use **ATX-style headings** (`#`, `##`, `###`) only.  
- Always start files with an **H1 heading** for the title.  
- Use **ordered lists** (`1.`, `2.`) for sequences, **unordered lists** (`-`) for bullets.  
- Keep line width ≤ 100 chars for readability.  
- Use **fenced code blocks** with language tags for code:  

```markdown
```json
{ "example": true }

- Use `TODO | IN-PROGRESS | DONE` consistently for statuses.  

---

## 2. File Title & Metadata
Each file must begin with:  
```markdown
# <File Title>

**File Path:** /docs/<filename>.md  
**Last Updated:** YYYY-MM-DD  
**Author:** AI-Agent 

---

## 3. Epic: <Epic Name> (EPIC-001)

### Description
Short business-focused explanation.

### Stories
- [STORY-001](./stories/STORY-001.md): <Title>
- [STORY-002](./stories/STORY-002.md): <Title>

---

## 4. Story: <Story Title> (STORY-001)

**File Path:** /docs/stories/STORY-001.md  
**Last Updated:** YYYY-MM-DD  
**Author:** AI-Agent  

## Description
As a <user>, I want <goal>, so that <benefit>.

## Acceptance Criteria
1. <Given / When / Then>
2. <Given / When / Then>

## Dependencies
- EPIC-001
- STORY-000 (if any)

## References
- HLD: [02_high_level_design.md](../02_high_level_design.md#related-section)
- LLD: [03_low_level_design.md](../03_low_level_design.md#related-section)

## Status
TODO | IN-PROGRESS | DONE

---

## 5. High-Level Design

**File Path:** /docs/02_high_level_design.md  
**Last Updated:** YYYY-MM-DD  
**Author:** AI-Agent  

## Module: <Module Name>
### Overview
High-level description.

### Responsibilities
- <Responsibility 1>
- <Responsibility 2>

### Interfaces
- API: `GET /endpoint`
- Input/Output data models

### Related Stories
- STORY-001
- STORY-002

---

## 6. Low-Level Design

**File Path:** /docs/03_low_level_design.md  
**Last Updated:** YYYY-MM-DD  
**Author:** AI-Agent  

## Component: <Component Name>
### Purpose
Detailed explanation.

### Data Structures
```json
{
  "id": "string",
  "createdAt": "date",
  "status": "enum"
}

---

## 7. Development Charter
```markdown
# Development Charter

**File Path:** /docs/04_development_charter.md  
**Last Updated:** YYYY-MM-DD  
**Author:** AI-Agent  

## Coding Standards
- Language: <define>  
- Style Guide: <define>  
- Linting: <define>  

## Testing
- Unit Test: required  
- Integration Test: required  

## Documentation
- All public functions must be documented.  
- Update relevant `.md` story file after completion.
