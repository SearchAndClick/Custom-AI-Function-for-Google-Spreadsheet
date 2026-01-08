# Copilot Instructions

## **CRITICAL: Documentation Discipline is MANDATORY**
**You MUST read, understand, and update ALL documentation with absolute consistency. No exceptions. No shortcuts. This is not optional.**

## Required Reading Before Starting Any Task
1. `TECHNICAL_PLAN.md` – overall architecture, AI stack, UX, data pipelines.
2. `ROADMAP.md` – phase goals and timelines.
3. `BACKLOG.md` – current priorities and pending items.
4. `DEV_LOG.md` – latest progress notes and decisions.

**Before writing ANY code:**
- **READ** all four documents above to understand context
- **UNDERSTAND** existing architecture and decisions
- **VERIFY** what has already been implemented

**After completing ANY work:**
- **UPDATE** `BACKLOG.md` - move task to "Done" with date prefix
- **UPDATE** `DEV_LOG.md` - append entry with implementation details
- **UPDATE** `TECHNICAL_PLAN.md` - if architecture/design changed

## Documentation Workflow Principles

### BACKLOG.md – Single Source of Truth for All Tasks
- **Purpose**: Comprehensive inventory of ALL project tasks (completed and pending).
- **Structure**:
  - **In Progress**: Tasks currently being worked on (limit to active work).
  - **Next Up (High Priority)**: Tasks ready to start immediately; highest priority items.
  - **Upcoming (Medium Priority)**: Tasks scheduled for next phase; medium priority.
  - **Backlog (Future Consideration)**: Tasks deferred to later phases; documented but not prioritized.
  - **Done**: Completed tasks with date prefix (most recent first); serves as completion log.
- **Task Lifecycle**: Tasks must move through sections as work progresses:
  1. New task added to appropriate priority section (Next Up/Upcoming/Backlog).
  2. When work begins: Move from "Next Up" → "In Progress".
  3. When completed: Move from "In Progress" → "Done" with date prefix (YYYY-MM-DD format).
- **Critical Rule**: If you are asked "what are the pending tasks?", consult BACKLOG.md sections 1-3 (In Progress, Next Up, Upcoming). This is the authoritative source.
- **When to Update**:
  - Before starting any multi-step work: Add tasks to appropriate section if missing.
  - When beginning work: Move task to "In Progress".
  - Immediately after completing work: Move task to "Done" with date prefix.
  - During planning/scope changes: Re-prioritize tasks between sections as needed.

### DEV_LOG.md – Historical Record (Append-Only)
- **Purpose**: Chronological log of what was accomplished, decisions made, and blockers encountered.
- **Format**: Date-stamped entries (newest at top) with bullet-point summaries.
- **Content**: Actions taken, technical decisions, blockers, commit references, test results.
- **Critical Rule**: DEV_LOG.md is NOT for task tracking or planning; it records history only.
- **When to Update**:
  - After completing significant work (end of session, major feature completion).
  - When making important technical decisions (architecture changes, library choices).
  - When encountering blockers or pivoting approach.

### TECHNICAL_PLAN.md – Architecture & Design Reference
- **Purpose**: System architecture, API specifications, data schemas, design decisions.
- **Content**: Technical specifications, configuration reference, data flow diagrams, integration contracts.
- **When to Update**:
  - When architectural decisions change (new endpoints, schema changes).
  - When adding new system components or configuration options.
  - When documenting technical constraints or design rationale.

### ROADMAP.md – High-Level Milestones & Timeline
- **Purpose**: Phase goals, delivery timelines, major feature milestones.
- **When to Update**:
  - When milestone dates shift due to scope or priority changes.
  - When adding/removing major features from phase planning.
  - When documenting blockers that affect timeline.

## Update Checklist After Completing Work
**EXCEPTION**: If the task involved NO source code changes and NO logic changes (e.g., only `clean`, `build`, `install`, or simple queries), DO NOT update documentation unless explicitly requested. This is to conserve usage costs.

1. **Always (if code/logic changed)**: Move completed task from "In Progress" → "Done" in `BACKLOG.md` with date prefix.
2. **Always (if code/logic changed)**: Append dated entry to `DEV_LOG.md` summarizing actions, decisions, blockers.
3. **If architecture changed**: Reflect scope/architecture changes in `TECHNICAL_PLAN.md`.
4. **If timeline affected**: Update `ROADMAP.md` if milestone timing or scope shifts.

## Additional Guidelines
- Keep all markdown files in ASCII and preserve their existing structure.
- Ensure every markdown document is written entirely in English.
- Record unresolved questions or blockers in `BACKLOG.md` (Next Up or Upcoming).
- Document external data/licensing updates in `ROADMAP.md` or `DEV_LOG.md` as appropriate.
- Ensure ingredient reconciliation thresholds and Gemini schema changes remain consistent across documents.
- When finishing any task, move the status in `BACKLOG.md`, record the same snapshot in `DEV_LOG.md`, and touch `TECHNICAL_PLAN.md` or `ROADMAP.md` only if architecture or timelines change.
- Immediately log new risks/issues in `DEV_LOG.md` and reflect action items in `BACKLOG.md` before proceeding to the next command.
- The user is the sole programmer on this project. Do not request or suggest other developers; assume the user will handle all implementation personally.
- All chat responses must be written in Bahasa Indonesia. Expand any abbreviations first and avoid slang.
- Use English only when editing markdown that is already written in English.
- **Localization Rule**: When adding or modifying localization keys, you MUST update ALL supported language files, not just English and Indonesian. Do not leave any language file with missing keys.
- All Python commands must use the local virtual environment paths: `".venv/Scripts/python.exe"` for `python` and `".venv/Scripts/pip.exe"` for `pip`.
- All Flutter commands must use the full local SDK path: `".flutter/bin/flutter.bat" <command>`.
- **CRITICAL: DO NOT build or install Flutter APK unless explicitly requested by the user**. Building takes time and should only be done when the user asks to test on device or deploy. Focus on code changes and commit them; let the user decide when to build.
- **CRITICAL: Always build Flutter APK from clean state**. Before every `flutter build apk`, run `flutter clean` first to avoid cache issues and ensure latest code is included.
- **CRITICAL: Always install APK using `adb install --user 0`**. Do not use `flutter install` for physical devices, as it may fail on multi-user devices (e.g. Second Space). Use `adb install --user 0 -r <apk_path>` to ensure installation for the main user.
