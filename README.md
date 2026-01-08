# Custom AI Function for Google Spreadsheet

Google Sheets custom function (Google Apps Script) that turns hearing notes (Input/Output/Remarks) into a **granular task list** with **man-hour estimates** using the Gemini API.

## Spreadsheet Layout
The sheet follows the same column layout as `Project.xlsx`:

- **Column A**: Hearing - Input
- **Column B**: Hearing - Output
- **Column C**: Hearing - Remarks
- **Column D**: Task List (AI-generated)
- **Column E**: Man Hour Estimation (AI-generated)

## What the Function Returns
`GENERATE_ESTIMATION(inputData, outputData, remarks)` returns a **2D array** of rows:

- Each row is: `[Task, Hours]`
- In Google Sheets, this will **spill** into cells:
  - Column D: Task (one task per row)
  - Column E: Hours (number)

Example output (conceptually):

```
Task (D)                      Hours (E)
--------------------------------------
Setup PostgreSQL schema       2.5
Develop Auth API              4.0
...
```

## Setup (Google Apps Script)

### 1) Add the script
- Open your Google Sheet
- Extensions → Apps Script
- Create a `.gs` file (or use an existing one)
- Paste the contents of `apps-script/GENERATE_ESTIMATION.gs`

### 2) Configure Script Properties
- Apps Script → Project Settings → Script Properties
- Add:
  - `GEMINI_API_KEY` = your Gemini API key

### 3) Authorization
The function uses `UrlFetchApp`, so Google will ask for authorization.
- Run the function once
- Accept the permission prompt

## Usage
In **D2** (Task List column), enter:

```
=GENERATE_ESTIMATION(A2,B2,C2)
```

Notes:
- Ensure the spill range below/right of the formula cell (D:E) is empty, otherwise you may see `#REF!`.
- If `remarks` is empty, the script uses a default: `Tidak ada catatan khusus`.

## Prompt Contract
The prompt requests a strict **JSON array of arrays**:

- Example: `[["Setup PostgreSQL Schema", 2.5], ["Develop Auth API", 4.0]]`
- Each item MUST be `[task(string), hours(number)]`
- Task must be plain text (no bullet prefix, no numbering)

## Reliability and Cost Controls
Implemented in the script:
- **Cache**: `CacheService.getScriptCache()` keyed by SHA-256 of inputs (TTL: 6 hours)
- **De-duplication**: `LockService.getScriptLock()` to avoid duplicate concurrent calls
- **Retry**: up to 3 attempts for transient HTTP errors (429 / 5xx)

## Security Notes
- Do not hardcode the API key in source.
- Use Script Properties (`GEMINI_API_KEY`).

## Troubleshooting
- **403 / permission issues**: ensure you authorized the Apps Script project.
- **`#REF!`**: the spill range is blocked by existing values.
- **"AI response is not a valid JSON array"**: the model returned extra text or non-JSON; try reducing temperature (already set to 0.2) or re-run.

## Repository Files
- `apps-script/GENERATE_ESTIMATION.gs` - main custom function
- `Project.xlsx` - source reference for sheet layout
- `TECHNICAL_PLAN.md`, `ROADMAP.md`, `BACKLOG.md`, `DEV_LOG.md` - project docs
