# Roadmap

Dates are indicative and should be updated once priorities are confirmed.

## Phase 0 - Project Setup (Week 1)
- Initialize repository and baseline documentation.
- Confirm Google Workspace / Spreadsheet access and constraints.
- Confirm AI provider (API), quotas, and security requirements.

## Phase 1 - MVP Custom Functions (Weeks 1-2)
- Define the canonical input schema for hearing notes (Input/Output/Remarks). [DONE]
- Implement `GENERATE_ESTIMATION(inputData, outputData, remarks)` to generate task list + man-hour estimates. [DONE]
- Add caching, de-duplication lock, retry logic, and user-friendly error messages. [DONE]

## Phase 2 - Quality and Stability (Weeks 2-3)
- Add response validation and strict formatting.
- Add a test harness and sample fixtures.
- Document operational guidance (API key setup, quotas, troubleshooting).

## Phase 3 - FS Sheet Definition (Weeks 3-4)
- Define competitor analysis fields and expected outputs.
- Define profitability inputs/outputs and calculations.
- Implement formulas or custom functions if AI is required.

## Phase 4 - Handover and Maintenance (Ongoing)
- Create a small playbook for changes (prompt edits, new columns, rollout).
- Monitor usage and adjust caching/quotas.
