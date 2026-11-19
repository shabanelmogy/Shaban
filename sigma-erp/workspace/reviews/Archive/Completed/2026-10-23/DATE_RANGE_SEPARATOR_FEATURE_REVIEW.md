# Shared date-range separator correction

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Contract | DATE_RANGE_SEPARATOR_UI_CONTRACT_FREEZE.md |

Pre-edit conformance, behavior and execution boundaries are frozen in the contract. Scope: shared DatePickerDirective and owning UI17/skill guidance only; no feature-specific handler or business/API change.

## Owner-reported ES2018 compatibility follow-up — 2026-10-03

Owner supplied TS2550 for trimEnd/trimStart in normalizeRangeMarker. Pre-edit decision: keep tsconfig.json's lib=[es2018,dom] and replace only these two directional whitespace operations with String.replace using /\s+$/ and /^\s+/. This preserves the frozen delimiter and selection-offset contract; no new API or feature behavior. No compiler configuration or polyfill change.

| Concern | Owning block | Actual reference / shared owner | Pre-edit target and approved correction |
|---|---|---|---|
| Exact dash delimiter and caret | UI17 fixed delimiter | DatePickerDirective.normalizeRangeMarker; Customer Statement list p-calendar dateRange is range/two months/appDatePicker | Retain left trailing/right leading whitespace removal, exact ' - ' and existing position arithmetic; replace unavailable methods with anchored replace |
| Compiler-library compatibility | Master5 type safety; UI29 | tsconfig.json compilerOptions.lib=[es2018,dom]; installed TypeScript String.replace declaration | trimStart/trimEnd unavailable under configured lib; retain config and use existing String.replace |

Final reconciliation: only the two directional trim calls were replaced in this follow-up. Anchored trailing/leading whitespace removal returns the same left/right strings used by the existing delimiter and caret calculation. Installed TypeScript lib.es5.d.ts declares String.replace(string|RegExp, string); trimEnd/trimStart are declared in lib.es2019.string.d.ts, confirming the reported incompatibility with lib=es2018. Directive source parsing: zero syntax errors and no remaining trimStart/trimEnd call. Frontend repository root verified; complete scoped directive diff reviewed and git diff --check passed. All eight recipe checks passed. Existing earlier separator edits preserved; compiler configuration unchanged. This implementation detail adds no guide rule.

Status: Implemented — source-only; owner verification pending yes. Phases: reuse frozen discovery/contract and PHASE02 shared filter-control correction; no new grid/write/action/integration/backend work. Small sequential fix handled by root, no subagents. No backend/DTO/mapping/calculation/schema/migration changes. No prohibited commands run. Owner should recompile and repeat the separator manual-edit checks above; build/runtime acceptance remains pending. Suggested frontend commit: `fix(datepicker): keep whitespace normalization compatible with ES2018` (suggestion only).

## Final source reconciliation

DatePickerDirective.rangeMarker selects only selectionMode=range/rangeSeparator='-'. guardDateText now checks the real calendar input and disabled/read-only gates, captures a partial pre-edit value/selection except whole-selection/history, retains the existing numeric/single-mask guard and protects the canonical marker from overlapping deletions/replacements. Backspace/Delete that overlap it move the caret to the adjacent boundary; whole-field clear/replacement remains allowed.

normalizeRangeMarker runs in the existing capture input listener after illegal-character cleaning and before PrimeNG's onUserInput. Slash-based formats normalize the unique dash to one space on each side, adjusting both selection offsets using trimmed left/right lengths. Noncancelable partial marker destruction restores the pre-edit text/selection. Dash-punctuation date formats protect the existing marker without guessing compact pasted boundaries. Empty/single/multiple/custom-separator/history/disabled/picker-only paths keep their specified behavior. Existing PrimeNG isKeydown gating parses/updates once; no synthetic input or new updateModel call. Single-date mask/date validators/min/max/range-order and transport remain unchanged.

Source file: [DatePickerDirective](<F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/shared/directives/date-picker.directive.ts>). TypeScript source parsing reports0 syntax errors; complete scoped frontend diff reviewed and whitespace check passed. This is not runtime input verification. Owning UI17 rule, skill §3.3/history, UI preamble1.60 and CHANGELOG synchronized; all eight generated packets regenerated through their generator and checked. Existing unrelated modifications preserved.

Owner verification pending: in a shared dual-month range edit both dates, Backspace/Delete adjacent to each dash/space, partially select the marker, paste a slash-format range without spaces and with excess spaces, Ctrl+A replace/delete, clear/pick dates, undo/redo, blur and Search. Confirm partial/invalid/order/bound validation and no double update, in Arabic/English and desktop/mobile input. Verify single masked date/month fields and picker-only behavior remain. Compact pasted dash-date boundaries are deliberately not inferred.

Applied focused discovery/freeze, PHASE02 control behavior and final source reconciliation. No writes/domain/backend/API/grid/ListVM/DTO/mapping/calculation/schema/route/translation change, no migration. Root handled this tightly coupled shared behavior without subagents. No build/test/lint/browser/runtime/DB/migrations/commit/push/deployment/Graphify/Sigma MCP run. Suggested frontend commit: `fix(datepicker): preserve the date range separator while editing` (suggestion only).
