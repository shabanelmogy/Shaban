# Data Reset — feature review (frontend redesign)

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |
| Scope | Administration → Data Reset screen (`/DataReset`), its service, translations and in-app guide topic. Backend (DatabaseResetController/Service, TenantResetPlanner) was implemented earlier under authorization review C2 and is not changed here. |
| Authorization | Direct owner request: separate data-reset screen by modules; redesign to follow the documented UI rules; delete old Settings files. |

## Sources read

- Workspace `AGENTS.md`, `.agents/SIGMA_WORKFLOW_RULES.md` (complete), `.agents/skills/sigma-screen-refactor/SKILL.md` (complete).
- `SIGMA_UI_PATTERNS.md` index; `ui/screens/00-catalog.md`, `06-tabbed-settings-workspace.md`, `09-action-dialog.md`.
- UI1 (shell, container-fill, no page scroll, editor shell, settings options), UI3, UI9, UI22 (loading gate, error/success owners), UI23, UI24 (button roles), UI25, UI27 (dialog/focus check), UI28 (cancellation check), Master7 (user-guide gate).
- Shared owners: FeatureTitle, FormSection, SummaryCards, PrimaryActionButton, StateMessage, ConfirmationDialog(+Service), LoadingService, BaseComponentService, `api-error.ts`, `src/styles.scss` (sigma-editor-*, sigma-settings-option*, sigma-alert*, sigma-danger-button, sigma-status-badge).
- References: `Administration/auditTrail/list` (pButton/pInputText/LoadingService pairing), `Administration/ErrorLogs/details` (FormSection + sigma-field read values), `shared/components/csv-import-workspace` (title + summary cards + alerts in a workspace).
- Speed/Odoo analysis: not applicable — data reset is an internal administrative tool with no reference-product screen.

## Screen type

No catalog type covers a routed destructive administrative action. Closest documented composition used: routed one-pane editor shell (UI1 *Shared editor page shell*) with `sigma-editor-panel--workspace`, one scroll owner and fixed footer. Recorded here as a justified exception, not a new pattern.

## Conformance table

| Concern | Block | Reference / shared owner | Result |
|---|---|---|---|
| Route host / fill / no page scroll | UI1 | `host: sigma-route-host`, `section.sigma-editor-page > div.sigma-editor-panel--workspace`, `form.sigma-editor-form > .sigma-editor-body > .sigma-editor-scroll` | Match |
| No Bootstrap/Metronic classes | UI1 *Complete style retirement*, UI24 | — | Match (previous `card/btn/alert/row` markup removed) |
| Title | UI3 | `app-feature-title` inside the panel | Match |
| Reset-type choice | UI24 accents | `app-summary-cards` selectable (records value, tables hint) | Match |
| Grouping | UI1 settings composition | `app-form-section` compact; modules as `sigma-settings-options-grid` / `sigma-settings-option` checkbox rows | Match |
| Read values | UI1 editor shell | `sigma-editor-grid` + `sigma-field` + `sigma-field__read` | Match |
| Text input | UI24 | native `input pInputText` in `sigma-field` | Match |
| Destructive action | UI24 button roles | `button pButton severity="danger" .sigma-button.sigma-secondary-button.sigma-danger-button` in `sigma-editor-footer` | Match |
| Confirmation | UI9 | `ConfirmationDialogService.confirm` danger, record = database, meta = company/tables/records; mutation only inside `if (confirmed)` | Match |
| Alerts | UI1/UI22 | `sigma-alert`, `sigma-alert--warning` with Retry `sigma-secondary-button` | Match |
| Empty/disabled states | UI22 | `app-state-message` | Match |
| Translations | UI23 | `databaseReset.*` in en and ar; scope keys written in full in `DATA_RESET_SCOPE_TEXT` (no built keys) | Match |
| RTL / theme | UI25 | only shared tokens/classes; technical values `dir="ltr"` | Match (visual pending) |
| Focus | UI27 | shared confirmation dialog; decorative icons `aria-hidden` | Match |
| Cancellation | UI28 | page reads through `Subject` + `switchMap`; all subscriptions `takeUntilDestroyed`; Reset disabled while running | Match |
| User guide | Master7 | `UserGuide/content/data-reset-topic.ts`, added to the Administration guide topics | Match |

## Loading (UI22 gate)

| Request / operation | Visible owner | Start / finalize | Busy, error, Retry | Evidence |
|---|---|---|---|---|
| Availability → Preview + Counts (initial load, Retry, refresh after reset) | Global page (`LoadingService`) | one `startLoading` in `defer`, one `endLoading` in `finalize`; replaced by `switchMap` | Inline `sigma-alert` + Retry (reads send `X-Skip-Error-Interceptor`, UI22 in-screen exception); Counts failure is non-blocking (`rows = null`) | Source match; runtime pending |
| Reset (Modules / OpeningBalances / GoLive / All) | Global page | `startLoading` before POST, `endLoading` in `finalize` | `running` disables controls and the action, `aria-busy`; success toast and error dialog owned by the global interceptor (no feature toast) | Source match; runtime pending |

Route `DataReset` uses default `showPageLoading` / `requiresBranchContext` (company-wide read; branch readiness wait is harmless).

## Cache (UI2 gate)

All four reads are direct operational/administrative reads (availability, preview, counts); no reference cache opt-in. Correct: values change after every reset and must not be cached.

## Performance

Counts executes one `COUNT_BIG(*)` per resettable table for this company in one request; acceptable for an occasional admin screen. Reset runs in one transaction with a 10-minute command timeout. No index proposal (predicates are `SubscriptionId` / PK links already used by tenant filters). Timing pending owner measurement.

## Files

- `src/app/modules/Administration/DataReset/data-reset.component.ts|html` — redesigned.
- `src/app/modules/Administration/DataReset/data-reset.service.ts` — resets no longer skip the global interceptor.
- `src/app/modules/Administration/DataReset/data-reset.models.ts` — `DATA_RESET_SCOPE_TEXT`.
- `src/app/modules/i18n/vocabs/database-reset.ts` — section, confirmation keys (en/ar).
- `src/app/modules/UserGuide/content/data-reset-topic.ts` (new), `administration-guide.ts` (topic registered).

## Pending

- Owner: build, browser visual check (light/dark, LTR/RTL, narrow widths), reset run on a test company.
- Owner: delete the retired Settings files (the session tool cannot delete files): `Administration/Settings/database-reset/`, `Administration/Settings/services/database-reset.service.ts`, `Administration/Settings/models/database-reset.ts`. Their Settings route was removed; search for `database-reset` imports before deleting.
- Translation parity check: `recipe-system/Check-Translations.ps1 -Block databaseReset` (not run; source-only boundary).

Suggested commit message (frontend): `feat(admin): redesign Data Reset screen on shared Sigma shell and add user guide topic`
