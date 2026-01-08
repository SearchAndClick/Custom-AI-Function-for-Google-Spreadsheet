# Backlog

## In Progress
- (none)

## Next Up (High Priority)
- (none)

## Upcoming (Medium Priority)
- Implement Google Apps Script project skeleton and local workflow (e.g., clasp) for version control.
- Add test harness for prompt construction, response parsing, and error handling.
- Document operational guidance (API key setup, quotas, troubleshooting).

## Backlog (Future Consideration)
- Add structured JSON outputs and helper extractor functions.
- Add multi-language output configuration.
- Define and implement FS sheet logic:
  - competitor analysis schema
  - profitability calculations
- Add monitoring/logging dashboard or usage reporting.

## Done
- 2026-01-08 - Initialize git repository.
- 2026-01-08 - Create baseline project documentation (TECHNICAL_PLAN.md, ROADMAP.md, BACKLOG.md, DEV_LOG.md) based on Project.xlsx.
- 2026-01-08 - Confirmed Google Sheet layout matches Project.xlsx (Hearing: Input/Output/Remarks; AI fills Task List and Man Hour Estimation).
- 2026-01-08 - Initial Apps Script custom function created in Google Sheets extension: `GENERATE_ESTIMATION(...)` calling Gemini and returning a 2D array.
- 2026-01-08 - Added hardened Apps Script sample in-repo using Script Properties + safer parsing: `apps-script/GENERATE_ESTIMATION.gs`.
- 2026-01-08 - API key moved to Script Properties; response parsing hardened; typo fixed; model set to `gemini-2.5-flash`.
- 2026-01-08 - Implemented caching + de-duplication lock + retry logic to reduce Gemini calls and handle transient failures.
- 2026-01-08 - Confirmed output spills as rows `[Task, Hours]` to fill Task List and Man Hour Estimation columns.
