# HandLend Progress

This file is the visible progress board for implementation driven by `SDD Handlend.md`.

## Update Rules

- Update this file whenever a slice changes implementation or verification status.
- Keep each entry aligned with actor, screen IDs, and the corresponding `openspec` artifact.
- Do not move a new slice to `in progress` while another slice is waiting for a `PASS` `verify-report`.
- For UI and actor-flow work, include brief Playwright evidence.

## Status Legend

- `pending`: not started
- `in progress`: implementation active
- `verified`: implementation complete and latest `verify-report` verdict is `PASS`
- `blocked`: waiting on missing dependency, failed verification, or unresolved decision

## Active Slices

| Slice | Actor | Screens | Status | Openspec artifact | Last verification | Evidence |
|------|-------|---------|--------|-------------------|-------------------|----------|
| mission-funding-and-proof | Donor, Operator | D-01, D-02, D-03, D-04, D-05, O-01, O-02 | in progress | `openspec/changes/mission-funding-and-proof/` | not run | Frontend: `apps/frontend/src/app/donor/` + `apps/frontend/src/app/operator/`. Backend: `apps/backend/` (FastAPI + SQLite). Awaiting Playwright verification. |
| logistics-operations | Coordinator | C-01, C-02, C-03, C-04 | in progress | `openspec/changes/logistics-operations/` | not run | Frontend: `apps/frontend/src/app/coordinator/`. Backend: coordinator endpoints in `apps/backend/main.py`. Awaiting Playwright verification. |
| reporting-timeline | Donor, Operator | D-05, O-02 | pending | `openspec/changes/reporting-timeline/` | not run | Awaiting slice 1 PASS. Timeline UI partially covered in D-05 and O-02. |

## Current Gate

- No slice may advance to a new feature until the active slice records a `PASS` verdict in `openspec/changes/{change-name}/verify-report.md`.
