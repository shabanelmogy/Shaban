# Depreciation Summary review and implementation

| Item | Value |
|---|---|
| Status | Blocked |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Contract | DEPRECIATION_SUMMARY_REPORT_CONTRACT_FREEZE.md — Frozen read/UI handoff |

## Scope and findings

User requested review and documented fixes for src/app/modules/Assets/depreciationSummary; screenshot 6.PNG classified in the frozen contract. Tier M, UI07 Report / BE5 Report. Legacy ms-lib table, untyped column filters, wrong typeId key, purchase/depreciation column dates misused as report boundaries, UTC date-only serialization, navigation-based lookups, missing error/finalize handling and frontend total were confirmed. These are scoped instances of UI backlog5/22/39 and UI6/17/20/22, not new application-wide discoveries.

Frontend adopts shared ReportPage/ReportActions/FeatureTitle/DataTable/SummaryCards/DatePicker/FieldError/StateMessage/PrimaryActionButton. Current-month typed range validates ordered dates; IDs remain optional positive selectors; no generic table search or sortable contract is invented. New dedicated service expects Result<DepreciationSummaryReport>, complete rows and backend period/cumulative totals. Form changes invalidate output and reset local first offset, retaining size. Busy guards and disabled form reject overlapping Search/Refresh; teardown and filter invalidation cancel requests. Lookup loading is local; report loading uses global start/finalize. Both Result-false and HTTP failures have one inline owner with skip-interceptor header. Retry reloads lookups. Print uses shared session, full unpaged rows, scroll release and restored local offset; Excel uses all rows plus both backend totals with click-time translated headers. Branch is visibly unavailable with explanation: no source-supported Asset branch relation exists.

## Files owned by this task

Frontend root: F:/My Work/Sigma/SiGmaAngularFrontEnd.

- Assets/depreciationSummary/components/list/list.component.ts and .html: report replacement.
- Same folder/list.component.scss: empty stylesheet removed.
- Same folder/list.component.spec.ts: existing stale ListComponent import corrected; no tests run or coverage claim.
- Assets/depreciationSummary/models/list.ts: typed filter and response.
- Assets/depreciationSummary/services/depreciation-summary.service.ts: real report read service.
- Assets/depreciationSummary/depreciation-summary.routes.ts: Routes type.
- modules/i18n/vocabs/en.ts and ar.ts: matching depreciationSummaryReport block only.
- pages/routing.ts: summary lazy import folder case only.
- _metronic/layout/components/toolbar/toolbar.component.ts: summary title suppression only.

Pre-existing and concurrent Asset/AssetType/LoanEMI/DepreciationDetail/FY work is not this task's change. Shared routing/toolbar/vocabulary diffs contain peer edits; preserve them and stage only the listed summary hunks. No frontend AssetService edits.

## Execution ownership note

At backend discovery Git status was clean. Before the backend write phase, Git status revealed concurrent modifications to IAssetService, AssetService, AssetController and GeneralMessage resources, alongside DepreciationDetail/FY and posting-related files. AGENTS.md Master6/G18 requires stopping the overlapping slice. Owner clarification requested asynchronously; backend writes are currently held. Frontend is prepared for the frozen dedicated endpoint, so runtime use requires completing that backend slice. No claim of end-to-end completion while held.

## Conformance and reconciliation (source only)

| Comparison | Evidence / result |
|---|---|
| Screenshot ↔ content | E1/2/4/5 matched; existing extra TypeName retained; E6 period/cumulative totals explicitly labelled; E3 unsupported branch reported |
| Grid ↔ response row | assetName/typeName/depreciationStart/purchaseDate/assetCostPrice/residualValue/prevDepreciation/depreciation/totalDepreciation/bookValue; only extra identity assetId. Existing DepreciationSummaryItem has exact fields; no ListVM |
| UI filters ↔ query | dateRange → startDate/endDate using parseDateRange; assetTypeId/assetId exact keys; omitted null IDs; flat query contract explicitly recorded |
| Shared UI reference ↔ target | StatementOfAccount form lifecycle and strip, TrailBalance typed money columns and authoritative cards; sigma-report-page--fill/panel/route host carry container fill; DataTable owns rows and local pager; no feature SCSS |
| Paging/output | lazy=false complete rows, default15, resolveListPaging, full-array export; print disables paginator/scrollable and retains first/size |
| Error/lifecycle | Result-false/HTTP covered; finalize/destroy balanced; no duplicated interceptor notification |
| Translations | Equal new block keys EN/AR; use existing assets/general/validationMessages; currentPageReport uses {totalRecords} |
| Route/provider | One existing child route; corrected Assets folder case; dedicated root service uses existing BaseService HttpClient/environment |
| Backend/API | Held for concurrent-owner decision; new endpoint not yet delivered |

No new shared extraction qualified: all reusable controls/parsers/output/error/paging owners already exist. Remaining mapping/query/formula is feature-specific. No reusable new rule or skill/book amendment is required. AutoMapper is not needed for the projected report. Entity/schema changes and Add-Migration are not required by this contract. No editor, write payload, transaction, transition, destructive action or confirmation is applicable. Authorization candidates are report read/export; central permission system remains deferred.

## Verification and owner handoff

Phases0/1/2 implemented/reviewed; phase5 frontend wiring checked; phase6 frontend diff reviewed, backend reconciliation pending. Phases3/4 skipped (read-only report). Generated recipe check has documented drift; packets need owner regeneration/semantic review. Source searches confirm no feature any/ms-lib/ListCol/ColType/toISOString/typeId/frontend reduce/window.print/stale stylesheet reference or merge markers. Scoped git diff --check passes (line-ending advisories only). Runtime/compile/test/visual acceptance remains pending. No build, test, lint, migration, database, browser, commit, push or deployment command was run.

Owner checks after backend completion: compile both applications; validate complete/manual/partial/reversed/same-day ranges; compare asset and type filtering individually/together; check empty and error/retry states; verify all rows and backend totals through local paging, print/cancel, Excel after language switch; inspect no outer-page scrolling, card edges, narrow/RTL/dark display. Review existing month-based straight-line/opening/method/disposal policy separately if business changes are desired; this task does not approve accounting effects.

Suggested frontend commit (only task hunks): `refactor(depreciation-summary): adopt shared report controls`.

Agent utilization: bounded backend work was assigned to sol_worker (gpt-5.6-sol) after contract freeze, but initialization remained pending and was interrupted before any work. Root completed frontend and owns integration. No subagent source changes were produced.
