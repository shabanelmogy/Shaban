# Shared date-range manual editing

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and evidence (2026-10-14)

Owner reports that manually editing the From year moves the caret to To in any date picker. Written workflow evidence only; no screenshots. Implement the shared range-input correction, preserving unrelated working-tree changes. Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. The directive is initially clean; shared-screen-guidance.ts already contains owner changes and will receive only a bilingual addition.

Shape: existing shared `appDatePicker` range control (UI17), used by list filters and reports, not a new screen. Backend shape: not applicable. Approved control reference: UI17 shared directive and Individual editor; actual range consumer reference: Workshop Job list `job-date-range` (range, two months, current directive). No API, DTO, validation, date transport, calculation, permissions or persistence change.

## Frozen decision and conformance

| Concern | Book | Reference/symbol | Shared owner | Target comparison |
|---|---|---|---|---|
| Range input | UI17 | Job list `job-date-range` | DatePickerDirective | Keep one range picker, two-month panel, text editing and partial values |
| Input pipeline | UI17 | installed Calendar.onUserInput/updateModel/updateInputfield and native `[value]` binding | DatePickerDirective.guardDateInput | Normalize text first, let PrimeNG parse once; retain edited range text in the widget display binding |
| Caret | UI17/27; Master5 | DatePickerDirective.normalizeRangeMarker | DatePickerDirective | Snapshot post-normalization selection; restore an unintended collapse at the end after rendering only if the same text and input remain active |
| Single-date mask | UI17 | Individual details `individual-birthDate` | DatePickerDirective | Leave existing mask/parser/partial-date handling intact |

The source proves that Calendar.updateInputfield writes the whole native input without selection preservation and onUserInput does not synchronize inputFieldValue. It does not prove which runtime callback caused the reported jump. Correct the missing shared display/caret preservation; owner reproduction remains required. Do not add local focus handlers, synthetic input, an extra form write or another date parser. Use installed Angular afterNextRender/Injector/AfterRenderRef declarations, cancel superseded registrations and dispose on destroy. Do not move focus or override a deliberate selection elsewhere.

Phases: focused discovery/contract freeze (0/1), shared input repair (3), final source reconciliation (6). Phase2 server/grid, Phase4 domain actions and Phase5 route/API wiring are not applicable. Recipe -Check passed for all eight packets before use; applicable discovery/detail/reconciliation packets agree with the shared control ownership. No Maintenance/Evolution Plan: this is a bounded existing defect with no ambiguous business or architecture change.

## Verification and handoff

Review scoped Git diff and whitespace/merge markers. Update existing common EN/AR guide, UI17, skill digest and changelog; regenerate affected derivative packets and recheck. No subagents: small sequential fix fails the delegation gate. No build/test/lint/browser/database/migration/commit/push/deploy commands authorized.

Owner checks: select From year within a populated range, replace it digit by digit and with paste; repeat in To; Backspace/Delete beside the separator; clear/select-all, partial/invalid years and reversed ranges; calendar selection; Tab/arrow/click navigation; single date/month fields; Arabic/English, desktop/mobile and themes. Confirm no extra change event or Search/Save.

Suggested frontend commit: `fix(date-picker): preserve caret during range text editing`. No backend change or migration.

## Final reconciliation

The frozen decision above was implemented without changing its scope. DatePickerDirective.preserveRangeCaret snapshots the normalized native selection, synchronizes the range display binding, cancels any prior AfterRenderRef and restores only a collapse at the unchanged value's end in the same focused editable input. The capture listener remains the only shared text guard; Calendar.onUserInput/updateModel retain their existing parsing/model event ownership. Single/date-month branches and business validation are unchanged. No reference screen source was edited.

| Path | Source evidence | Result |
|---|---|---|
| Range typing and display | guardDateInput → normalizeRangeMarker → preserveRangeCaret → existing PrimeNG handler | Source conformance; owner reproduction pending |
| Lifecycle/API compatibility | installed @angular/core/index.d.ts exports afterNextRender, AfterRenderRef and injector option; Calendar.calendar.d.ts exposes inputFieldValue as nullable string | Source checked; compilation pending |
| Selection/clear/navigation | callback requires identical text, focused input, enabled/typeable state and an end collapse; superseded/destroyed registrations removed | Source checked; interaction pending |
| Common user guide | UserGuide/content/shared-screen-guidance.ts adds EN/AR range-editing guidance; GuideReader.sharedScreenGuidance renders it in existing module overviews | `/UserGuide/:sectionId` and current module sidebar links retained; reading/RTL/print pending |
| Complete scoped diffs | frontend directive and shared guide; documentation UI17, changelog and generated Phase02/03 | Reviewed; existing sidebar guide entry and unrelated backend-history/fingerprint edits preserved |
| Whitespace/merge markers | scoped git diff --check and marker search | Passed (only Git line-ending notices) |
| Shared extraction | existing shared directive owns the correction, no feature copy or opt-in | Matched |
| Documentation | UI17, skill §3.3/history and changelog synchronized | Phase02/03 regenerated through generator; all eight recipe checks pass |
| Book reference checker | Check-BookReferences.ps1 read-only audit | Reports nine unresolved paths outside the changed UI17/skill rule: SidebarLogoComponent; SettingsCommonModel/GetMySetting; MockDataFormComponent; BranchTariffSettingsComponent; Customer/GetSelect; ClauseType/GetSelect; StockReportPage; @angular/core/index.d.ts; NonnegativeStoredDecimalAttribute. No reference in this task's addition was reported; unrelated documentation repair remains outside scope. |

Packet semantic review: regenerated Phase02/03 change UI17 provenance and preserve existing numeric/typeable single-range and shared picker requirements/reference roles. The other backend provenance differences against HEAD were already present at task entry; initial -Check was clean. No template/manifest change or new reference designation was needed. Documentation repository `F:/My Work/Shaban Documents/Shaban` owns the book/packets; skill and review remain in the coordination workspace under the owner's existing ownership arrangement.

Changed files: shared directive, shared bilingual guide, UI17, canonical changelog, skill digest, generated PHASE-02-read-grid.md and PHASE-03-detail-write.md, and this review. Backend/API/AutoMapper/domain calculations/schema: not applicable; no migration. Suggested docs commit: `docs(ui-book): document date range caret preservation` (stage only this task's additions; preserve existing unrelated history). Final source conformance does not establish runtime success or identify the exact runtime callback that originally moved the caret. No blocking business contract; manual verification remains pending.

Subagents were not used because this was one small sequential shared-control repair. No prohibited build, tests, lint, browser/app, database, migrations, commits, pushes or deployment commands were run.

## Owner rejection and revised frozen repair (2026-10-14)

Owner confirms the previous repair did not resolve the problem and specifies selecting the From year before typing. This supersedes the first caret-render decision above; it remains a historical record, not current acceptance evidence.

Source cause: protectRangeMarker treats any selection overlapping ` - ` as forbidden, prevents the native replacement, then selects markerEnd for insertion (since insertText does not end with Backward). A selected From year plus its trailing space therefore moves to the start of To before any input event. The previous capture-input/render correction cannot run when beforeinput was prevented.

Frozen revision: remove the unsupported render workaround/imports/display mutation. For a selected endpoint overlapping the delimiter, narrow the native selection to the endpoint before the browser performs replacement/deletion; keep the delimiter intact and allow the existing input/parser path. Marker-only or cross-endpoint insertions stay prevented with selection retained; intentional collapsed Backspace/Delete boundary skips remain. Select-all, normal endpoint selection, history, disabled/readonly/custom separator and noncancelable fallback keep their existing handling. No second parser, extra model update or synthetic input.

Conformance: UI17 `protectRangeMarker` is the shared owner; only boundary selection handling changes. Existing Job range/Individual single-date references remain unchanged. Source trace for `01/10/2026 - 31/10/2026`, selection [6,11) (year plus trailing space): narrow to [6,10), replacement first digit naturally ends at 7 within From. Existing branch instead prevents replacement and moves to 13 (To start). Exact runtime browser selection remains owner-pending. Apply the focused 0/1/3/6 continuation; no backend/grid/domain/route change. All eight initial packet checks pass.

### Revised final reconciliation

Owner clarification received during the continuation: the jump occurs **after typing the first digit**, not merely when selecting. This agrees with the beforeinput prevention path; adjacent-space inclusion remains a source-supported explanation requiring browser confirmation.

| Scenario | Revised source result | Acceptance |
|---|---|---|
| From year only [6,10) | No marker overlap; ordinary native replacement | Source reviewed; runtime pending |
| From year + trailing space [6,11) | Selection narrowed to [6,10); first digit replaces From year without prevented input/To jump | Source reviewed; runtime pending |
| To endpoint + leading marker space | Selection starts at markerEnd; replacement stays within To | Source reviewed; runtime pending |
| Selected marker or both endpoints (not select-all) + digit/paste | Prevent insertion while retaining selection; no forced endpoint switch | Source reviewed; runtime pending |
| Collapsed Backspace/Delete at marker | Existing deliberate skip unchanged | Source reviewed; runtime pending |
| Select-all/history/noncancelable input | Original exclusions/snapshot fallback unchanged | Source reviewed; runtime pending |
| Shared handler lifecycle | Removed afterNextRender/Injector/AfterRenderRef and display mutation; original capture listener/destroy cleanup retained | Source reviewed |
| Common guide | Updated existing EN/AR paragraph to explain selecting/replacing From/To year; same reader/module links | Source reviewed; reading/RTL/print pending |
| Complete diffs | Frontend directive/common guide, canonical UI17/changelog, Phase02/03 fingerprints | Reviewed; whitespace checks pass; no markers/stale render symbols |
| Derivative documentation | Phase02/03 regenerated from corrected UI17; references and typeable/range recipes unchanged | Semantic review complete; all eight checks pass |

Current changed file inventory and repository ownership remain as recorded above. The revised shared repair is 17 added lines in protectRangeMarker; it introduces no model/parser/display callback or asynchronous lifecycle. No backend/API/mapping/calculation/schema work, migration, subagents or prohibited commands. Suggested frontend commit remains `fix(date-picker): preserve caret during range text editing`; suggested docs commit remains as above. Runtime verification was not performed under the standing source-only boundary. The original render workaround is removed and must not be described as the final solution.

Continuation book-reference audit completed: same nine unrelated unresolved paths as the first audit; no new finding in the revised UI17/skill rule. Existing source/docs changes preserved.
