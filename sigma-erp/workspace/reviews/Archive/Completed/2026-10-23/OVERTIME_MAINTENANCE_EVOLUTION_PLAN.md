| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Overtime maintenance and evolution plan

Consolidated on 2026-10-10 from the continuation decisions already recorded before implementation in OVERTIME_FRONTEND_CONTRACT_FREEZE.md. This file records their impact map and alternatives; it does not replace the historical freeze or introduce further scope.

## Authority and scope

The owner requests review and implementation of HRM/Overtimes according to the documents and screenshots, and authorizes filling missing business with the closest source-supported option for review at the end. The canonical Master, UI/backend books, PLAN-00 and phases 00–06 govern execution. Source-only implementation is authorized; builds, runtime, database, migrations and commits remain owner-only.

## Existing state and impact map

| Area | Existing owner | Target and impact |
|---|---|---|
| Daily source | Overtime entity, generic OvertimeService, StaffService overtime methods | Extend the same daily records; no parallel daily entity. One staff/calendar-day key. |
| Calculation | StaffService effective salary/date/holiday rules | Extract StaffOvertimePolicy and consume it from both writers. Keep the existing staff screen save behavior. Daily CRUD preserves historical rates for unchanged staff/day. |
| Readers | StaffService monthly detail and PayrollRunService overtime reader | Continue reading stored daily hours/amounts. New monthly history is not a payroll input or disbursement. |
| Monthly processing | Screenshots show month/action/history, no original producer | Create immutable OvertimeProcessRun summaries from valid existing daily records. Explicit repeated runs append history. |
| Import | Shared ImportCsvComponent parser/template | Extend parser lifecycle compatibly; create preview and atomic new-only command. Source-specific file feeds remain undefined. |
| Persistence | OvertimeConfig, DbContext | Increase hour fraction precision preserving integer range, add computed day/deletion keys and matching uniqueness, configure the new history table. Owner migration required. |
| APIs | Existing Overtime CRUD | Retain routes/wrappers; add process-runs, process and import on the same controller. Lean DTOs and server-owned calculations. |
| Angular | Existing /Overtime list/details | Shared list with monthly and daily tabs; explicit routed daily Create/View/Edit; shared month action dialog. Preserve applied queries and dirty-exit guards. |
| Reports | Existing shared grid/export owner | Export every matching row of the active tab, using the applied filter and click-time language. |
| Access | AuthGuard and authenticated API base | Preserve authentication. No permission API or invented approver authority. |
| Existing data | Live/deleted daily rows, saved payroll snapshots | No bulk reprice, rewrite, deletion, cleanup or posting. Existing duplicates can block processing/index creation and require an owner decision. |
| Guide | Existing HRM_GUIDE /UserGuide/hrm | Update only Overtime explanation, in English and Arabic, without a new reader/menu. |

## Alternatives and decision

| Alternative | Decision and reasoning |
|---|---|
| Keep only daily CRUD and substitute StaffOverTime navigation for Process | Superseded by owner continuation: does not complete the screenshot month dialog and history. |
| Extend daily source with monthly summaries and new-only CSV | Selected. Uses existing persisted amounts and calculation source, supplies visible workflows, and avoids automatic changes to historical payroll inputs. |
| Attendance-generated overtime, mass repricing, overtime approvals/payroll posting | Deferred. No source-supported business contract establishes these effects; review the complete business cycle with the owner. |

## Keep / Extend / Refactor / Create / Remove

| Classification | Item |
|---|---|
| Keep | Daily Overtime entity, existing StaffOverTime route/business, payroll daily-amount reader, authenticated root client, shared UI owners. |
| Extend | Overtime service/controller, EF day key/precision, shared CSV lifecycle, HRM guide. |
| Refactor | Typed list/editor/contracts, one calculation helper, error/dirty/loading/query ownership. |
| Create | Monthly run entity/config/DTO, process/import commands, monthly tab and month/preview dialog. |
| Remove | Unused FullListVM and write/reverse maps, incorrect legacy grid fields, client totals/audit inputs, duplicate Overtime service providers. |
| Replace | No business owner or financial cycle replaced. |

## Contract gates

Use the changed Frozen handoff and persistence clarification in OVERTIME_FRONTEND_CONTRACT_FREEZE.md. Process appends a snapshot; import validates 1–1000 rows and adds new keys in one save; daily rates/amounts are server-owned. All participating overtime writes use the existing Staff tenant write guard. The month snapshot has Processed status and no approver. Approval authority, import integration source and attendance automation remain owner cycle-review questions, not promised features.

## Owner follow-up

Review existing live staff/day duplicates, then create Add-Migration AddOvertimeProcessingAndDayUniqueness and inspect its interaction with the unrelated pending migrations. No migration was generated or applied here. Build/API/database/RTL/theme/dialog/CSV acceptance remains pending. Current implementation and detailed reconciliation are appended to OVERTIME_FEATURE_REVIEW.md.
