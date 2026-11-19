# Ledger filter layout — bounded shared extension

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner authorizes moving the Ledger checkbox below the main fields and widening
the account selector. No screenshot or business-rule/API change. Source-only
execution under AGENTS.md and sigma-screen-refactor. Recipe Check all8 OK.
UI screen07/UI20/4, existing Accounts report family over ReportPage/ReportActions
is the owner. Backend report pattern17 unchanged. This small shared descriptor
extension uses a proportional tierL plan; no independent workstreams justify
subagents. Owner implementation request authorizes continuing after this freeze.

## Existing state, impact and target

| Concern / owner | Classification | Source and frozen decision |
|---|---|---|
| LedgerComponent.config | Extend | Five regular fields plus showOriginalCurrency checkbox; set accountId wide=true and checkbox separateRow=true. All existing controls, values, query mapping and actions stay. |
| AccountReportFilterDefinition | Extend | Existing wide flag; add optional separateRow boolean for checkbox row placement. Omission retains current placement. No request/response change. |
| AccountReportPage template | Extend | Bind existing checkbox label to shared separate-row class; no extra checkbox/form instance. |
| Global report CSS | Extend | Existing sigma-report-filter-field--wide also supports normal flex strips above640px: basis340px/grow2/max600px versus ordinary170px/grow1/max300px. Mobile retains full width. Shared separate checkbox row occupies full flex row or all grid columns. |
| AccountReportPage.filterColumns | Refactor | Inline wide fields count two tracks as existing UI20 specifies; non-wide consumers retain counts. No existing wide Accounts consumer found; direct class search only found shared owner. |
| Reader/guide | Extend | Existing ACCOUNTS_GUIDE gets a typed bilingual Ledger topic with required notes field. Existing registration and module route reused. |
| API/domain/filter values/output | Keep | Same filter serialization, typed controls, validation, busy/loading/error/search/print/export owners; presentation only. |

Alternative rejected: private Ledger CSS or config.id selectors would bypass the
shared report owner. A new screen/form is unnecessary. Optional descriptor and
existing wide modifier keep request explicitly scoped to Ledger, while shared
mechanics remain reusable. No unresolved material decisions, schema, mapping,
permissions, writes or migration. No canonical reference module changes.

## Conformance and verification contract

| Concern | Book / reference | Expected target |
|---|---|---|
| Filters | UI4/20, existing AccountReportPage template/global styles | Same full-width strip, native shared sizes; account gets two field units, checkbox its own row |
| Responsive/RTL/theme | UI1/20/25, existing report flex/grid/mobile cascade | No feature CSS, logical properties, no page scroll; below640px fields full-width |
| Read/output | UI20/21, existing Ledger config and shared report session | No filter keys/amounts/summary/table/print changes |
| Guide | Master7, existing GuideReader/GuideTopic | EN/AR task steps, real /Ledger route and required fields |

Apply phases0/1 as existing contract+this bounded freeze, phase2 layout,
phase5 consumer integration and phase6 reconciliation. No editor/action/backend
phases. Root owns all edits because files tightly coupled. Source-only diff,
descriptor/template matching, sibling default and breakpoint cascade review;
build/test/lint/browser/runtime/DB/migrations/commits remain prohibited. Owner
checks desktop, intermediate and mobile widths, RTL/themes, selector labels,
checkbox focus and unchanged search/reset/print behavior. Canonical UI20 and
skill will document new reusable descriptor mechanics; regenerate affected
packets, review semantic parity and Check before handoff.

## Owner steering before handoff — checkbox shares the action row

Owner now explicitly places the checkbox on the SAME row as buttons. This
supersedes separateRow above; that unshipped descriptor/class is removed rather
than retained unused. Use optional checkbox withActions metadata: render the
same typed control once inside the existing shared action toolbar, which spans
the normal flex strip and wraps responsively. Other checkboxes stay in place.
Ledger account wide behavior remains. No control duplication/reset or request
change. Update current book/skill/guide to final behavior and regenerate packets.
