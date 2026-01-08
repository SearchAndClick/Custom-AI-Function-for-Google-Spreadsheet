# Technical Plan

## Overview
This project defines a set of Google Sheets custom functions (implemented in Google Apps Script) that transform "hearing" notes into structured outputs.

The source of truth for the initial scope is `Project.xlsx`, which defines:
- A worksheet that captures hearing notes split into **Input**, **Output**, and **Remarks**.
- The expected AI-assisted transformations:
  - Generate a **Task List** from hearing notes.
  - Generate a **Man Hour Estimation** from hearing notes.

## Goals
- Convert unstructured hearing notes into actionable tasks.
- Provide a consistent man-hour estimate per task and total.
- Keep usage simple for spreadsheet users (single-cell formulas).
- Ensure secure handling of API keys and safe, deterministic outputs where possible.

## Non-Goals (Initial Phase)
- A full web application.
- Workflow automation beyond spreadsheet formulas.
- Multi-user authentication (beyond Google Workspace access controls).

## Spreadsheet Model (from Project.xlsx)

### Worksheet: Initial
Columns defined on row 2:
- Hearing
  - Input
  - Output
  - Remarks
- Task List
- Man Hour Estimation

Expected behavior:
- Users write hearing notes under Hearing -> Input/Output/Remarks.
- AI fills the columns:
  - Task List
  - Man Hour Estimation

Confirmed sheet layout (matches Project.xlsx columns):
- Column A: Hearing - Input
- Column B: Hearing - Output
- Column C: Hearing - Remarks
- Column D: Task List (AI-generated)
- Column E: Man Hour Estimation (AI-generated)

### Worksheet: FS
- Comparison Study (competitor analysis)
- Profitability

Notes:
- This sheet is currently a placeholder in the source Excel.
- Implementation should begin with documenting the intended metrics and calculations before coding.

## Proposed Google Sheets Custom Functions

The following function has been implemented:

- `GENERATE_ESTIMATION(inputData, outputData, remarks)`
  - Combines task list generation and man-hour estimation in a single function.
  - Returns a 2D array that spills into Task List (column D) and Man Hour Estimation (column E).

## Current Apps Script Implementation (as of 2026-01-08)

### Custom Function
- `GENERATE_ESTIMATION(inputData, outputData, remarks)`
  - Purpose: Generate a granular technical task list with man-hour estimates.
  - Inputs:
    - `inputData` (required)
    - `outputData` (required)
    - `remarks` (optional; defaults to "Tidak ada catatan khusus")
  - Output: A 2D array of rows `[Task, Hours]` that spills down the sheet:
    - Column D: Task (one task per row/cell)
    - Column E: Estimated Hours (number)

### AI Provider and Endpoint
- Provider: Google Gemini API
- Endpoint pattern: `https://generativelanguage.googleapis.com/v1beta/models/<MODEL_NAME>:generateContent?key=<API_KEY>`
- Current model string in code: `gemini-2.5-flash`
- Generation config:
  - `temperature: 0.2`

### Script Properties (Secrets and Config)
- `GEMINI_API_KEY` (required)

Note: Model is hardcoded as `gemini-2.5-flash` in the source. To change, edit the `modelName` constant.

### Prompt Contract
- Role: "Senior Technical Project Manager & Solutions Architect"
- Strict output contract: raw JSON array only (no markdown fences, no commentary)
- Granularity rule: do not output sequential micro-steps as separate tasks; merge consecutive small setup steps into one task when a single person can complete them in <= 1 hour.

### Known Gaps / Risks
- Custom function constraints: external API calls in custom functions may require explicit authorization and can be fragile; document operational expectations.
- Heavy usage may still hit Gemini quota depending on input diversity (caching only helps with repeated identical inputs).

### Function Output Formats
The current implementation returns a 2D array that spills into the sheet:
- Each row is `[Task Description, Estimated Hours]`
- Task descriptions are plain text (no bullet prefix)
- Hours are numeric values
- The array spills down starting from the cell containing the formula (e.g., D2:E...)

## AI Integration

### Provider
- Provider is not specified by `Project.xlsx`.
- The integration should be isolated behind a small client module so provider changes are low-impact.

### Prompting Strategy
- Use a fixed system instruction and a structured user payload.
- Include explicit rules:
  - Do not invent requirements not present in the hearing.
  - Prefer short, action-oriented task names.
  - If information is missing, add a short "Open Questions" section.

### Rate Limiting and Caching
- Cache: Results are cached in `CacheService.getScriptCache()` keyed by SHA-256 hash of inputs; TTL is 6 hours.
- De-duplication: `LockService.getScriptLock()` prevents concurrent API calls for the same input.
- Retry: `fetchWithRetry_()` retries up to 3 times for HTTP 429 and 5xx errors with incremental backoff.

## Security
- Return safe error messages to users (no stack traces in cells).

## Testing and Validation
- Add a small test harness in Apps Script for:
  - Prompt construction.
  - Response parsing.
  - Error handling (timeouts, empty inputs).

## Deployment
- Use a reproducible workflow (e.g., `clasp`) to sync Apps Script code.
- Document steps in the repository once confirmed.

## Open Questions
- What is the final target Gemini model (confirm `gemini-2.5-flash` vs `gemini-2.5-pro`)?
- What is the expected output language (Indonesian, English, or mixed)?
- Should man-hour estimation follow a fixed rubric (junior/mid/senior), or a single estimate?
- How should the FS sheet be defined (competitor fields and profitability formula)?
