# Data Import maintenance plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-14 |

The first implementation slice is frozen by DATA_IMPORT_FRONTEND_CONTRACT_FREEZE.md. Unsupported mutations remain excluded/Blocked, without preventing confirmed frontend repair.

| Existing owner / impact | Classification | Target and evidence |
|---|---|---|
| Eleven ImportData endpoints and pipeline | Keep | ImportDataController/IImportDataService/ImportResult and owning import VMs define transport and partial commits |
| Fifteen Angular import screens | Refactor | Shared bounded import workspace; explicit local preview/import; same existing routes |
| Per-screen repeated sanitizers/result toasts | Replace | CsvRowReader and shared workspace; typed builders and persistent server feedback |
| Existing ImportCsv parser | Extend | Typed CsvRecord[] output and empty-file rejection; retain existing aliases and consumers |
| Four obsolete endpoint consumers | Remove mutation use | Local preview with unavailable advisory; no invented business/API |
| Administration guide and EN/AR keys | Extend | Fifteen import topics, validation, partial saves, recovery, unavailable flows |
| LayoutModule duplicate root providers | Remove in scope | Import services already providedIn root; preserve single global HTTP chain |
| Database/history/calculations/integrations | Keep | No backend/EF/schema changes; no migration/backfill |

Options compared: (1) repair fifteen independent legacy implementations—preserves duplication and future drift; (2) compose existing shared owners with typed feature-owned payloads—selected by Master5 extraction gate; (3) new universal CRUD/import API—rejected, lacks business evidence and expands scope.

Ambiguities: Customers/Salik/Darb/Fines endpoint/body/result/business contract is Missing and requires authoritative backend source/owner contract before mutation implementation. No decision on data destruction, access restrictions or accounting is introduced. Existing batch partial-save and potential network-unknown outcomes are Confirmed by ExecuteImportAsync/ImportResult; never auto-retry or claim full success.

Order: root freezes contracts; isolated supported-screen workers adopt the frozen shared API; root owns shared component/parser, unavailable screens, wiring, guide, documentation and final integration. Source verification includes full scoped frontend diff, exact routes/body keys/DTOs, standalone imports, translations, aliases/casing, local pager, feedback/loading/cancel path and responsive shell. Owner verifies build, valid/invalid files, partial/full/declared/HTTP/network failures, Arabic/dark/narrow layout and actual writes in an appropriate test environment.

## Presentation evolution — 2026-10-14

Status: Frozen. Owner requests a more attractive template-download card and the remaining Import Data components. Extend the existing shared ImportCsvComponent and CsvImportWorkspaceComponent; preserve the historical API/CSV/partial-save contracts above. Options: fifteen independent feature cards (rejected duplication); new file-upload/storage flow (rejected incompatible CSV contract); shared token-based template/file cards and bounded workspace composition (selected). No third-party visual library or generated image is required.

Impact: fifteen Administration consumers of the workspace and the three existing direct CSV consumers (ChequesPayables, ChequesReceivables, Overtime process) inherit shared presentation. Their owning actions, payloads and busy/cancellation rules remain. Root owns shared components, layout and final review. An isolated worker owns EN/AR additions, import guide and book/skill synchronization; no overlapping edits.

Create no new endpoint, parser rule, mutation, drag-and-drop promise, file-storage integration or permission. Add selected-file-name metadata only after valid parsing; failed parse/reset clears it. Use shared PrimaryActionButton and theme tokens. Two cards fit side by side when the component has room and stack below 580px of component width. In the Administration workspace, cards and feedback share one bounded controls scroll owner (maximum45% of panel height); the action toolbar, preview heading and table pager stay fixed. Table rows keep their existing scroll owner. Read file columns in a native details disclosure; do not overwhelm long templates with permanently rendered fields.

Verification: source-only template/input/output preservation, exact translation keys, selected-name reset/failure, container breakpoint580px on both sides/intermediate widths, long Arabic/filenames, short-height scrolling and each direct-dialog composition. Runtime/visual/browser/build/test remain owner-run. No backend/schema/migration work; update existing guide topics instead of adding a reader/menu.
