| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-07 |
| Scope | CollectionMovement, DeliveryMovement, CustodyMovement and directly consumed shared declarations |
| Repository | F:/My Work/Sigma/SiGmaAngularFrontEnd; frontend HEAD 3886cdef |
| Ownership | Bounded audit and authorized follow-up fixes; overall reconciliation remains root-owned |

# Focused audit and repair evidence

Read against Sigma AGENTS, sigma-screen-refactor skill, Frozen MOVEMENTS_FRONTEND_CONTRACT_FREEZE, MOVEMENTS_FEATURE_REVIEW and DELIVERY_CUSTODY_DISCOVERY. Selected UI01 fields-only modal/list composition, approved Job list shell, shared EditorDialog controlled composition and UI10/17/22/28 owning rules. Recipe drift remains as recorded by root (canonical rules prevail). Backend remains read-only. No screenshots supplied to this bounded workstream.

## Confirmed defects repaired

| Finding | Trigger and previous result | Final source evidence |
|---|---|---|
| P2 route parameter hydration | Navigating details/1 to details/2 reused the same list instance; ngOnInit-only snapshot retained record1 while the URL named record2. | All three lists subscribe activatedRoute.paramMap with takeUntilDestroyed, assign current selectedId/mode/visibility and reject invalid record IDs. Collection list.ts93; Delivery list.ts139; Custody list.ts143. Child ngOnChanges cancels previous reads and hydrates the new identity. Custody additionally clears prior printRequested on route identity changes. |
| P2 malformed Collection route date silently changed query | An absent/invalid endpoint became currentMonthRange even when a saved range was supplied. | Collection restoreState retains a malformed/incomplete saved range as text at list.ts219; dateRangeValidator and onSearch block the request and leave the original URL intact. A wholly absent range still uses current month; explicit cleared state remains null. |
| P2 malformed initial range retry queried all records | Delivery/Custody constructed appliedFilters before validating restored dates. Retry called loadList directly with null parsed date bounds, resulting in an unfiltered GET and URL overwrite. Collection's initial lazy path could similarly use its empty snapshot. | All three use filtersApplied=false until a valid form is applied. Collection requestList and refresh gate on it (list.ts194/199); Delivery loadList gates at184; Custody at207. All three export methods explicitly gate on it as well. After a valid Search, paging/action refresh/export retain that applied snapshot even if a draft control is edited. |
| P3 simultaneous input IDs broke labels/focus | Delivery type and Custody branchId filters shared actual input IDs with their open editors. Custody first-invalid-field focusField(document.getElementById) therefore found the background filter. | Delivery/Custody filter IDs have distinct feature-filter prefixes in list HTML. Editor IDs and save focus targets stay together. Source inspection found zero list/editor ID intersections for all3. |
| P2 Collection missing child failed open | editorVisible=true without its conditional ViewChild could permit leaving/replacing the editor before its dirty gate existed. | Collection canDeactivate returns false when the visible child is absent (list.ts310); openEditor refuses a replacement without the child; beforeunload guards the same interval. |

Route finding clarification: Angular17.3.12 already runs canDeactivate for changed path params in a reused route. Installed router.mjs getRouteGuards3232/3250 plus default paramsChange3285 prove this. Its default shouldReuseRoute4895 compares routeConfig, proving reuse. The repair hydrates only after accepted param emission and adds no redundant discard confirmation. Query-only changes retain the same record and applied route snapshot behavior.

## Reconciled conformance

| Concern | Actual final owners and comparison | Result |
|---|---|---|
| List layout/filter/table | sigma-route-host; shared page/panel/title; appFilterPanel stableLayout=true; appDataTable fill=true; retained page-report keys and Reset | Source match. Private shell/filter/widget styles removed or emptied; deleted SCSS content inspected. |
| Query/columns | Displayed Collection13, Delivery12, Custody9 columns retain their frozen fields. Row models carry matching columns plus minimum identity/localization fields. toListParams preserves Filters keys; unsupported sorting absent; real server count/page read | Source match. Backend sparse TotalPages/tie-breaker observations remain discovery report-only. |
| Applied export | getAllList uses fetchAllPages; exports use dataTableExportRows and translated column values; failure goes to composedReadErrorMessage | Source match; actual exported workbook and >100row behavior pending owner. |
| Modal/dirty/save | Controlled EditorDialog visibility; save guards prevent duplicates; form disabled for submitted snapshot; saved close marks pristine; Result failure and HTTP error preserve form; existing ConfirmationDialogService presets; stale decisions check identity | Source match; close/route/beforeunload acceptance pending owner. |
| Loader ownership | Editor details and save plus list/export/delete pair global loading with finalize. General option lists and dependent agreement context lookups use local flags/finalizers | Source match to UI22: auxiliary lookups explicitly do not drive global spinner. Collection bindLookupRequests and bindAgreementRequests are auxiliary field context; no global counts added. |
| API/write values | Local wall-clock toApiDateTime; dateRange parseDateRange yyyy-MM-dd; Collection/Delivery KMs remain text including0; Custody uses signed int32ValueValidator; RentalAgreement branch context remains scalar with absent FK null | Source match to Frozen contract; no new business requirement or transport field. |
| Fuel/options | Shared numeric FuelLevelEnum IDs; Delivery/Collection all9; Custody subset0/2/4/6/8; enumOptions/translateOptions | Source match; translations are root-owned. |
| Custody Print | Selected row opens loaded View detail; ReportPrintService.createSession; ready identity/detail state and printing gate; shared print isolation and flow classes | Source match; actual print pagination/RTL/theme remains owner-pending. |
| Deleted/renamed contracts | Deleted Delivery customerDetails/driverDetails inspected; retained delivery detail scalar fields needed by Logs; shared service select endpoints still Driver/Branch/Vehicle/RentalAgreement through actual baseControl | Source match; no inferred endpoint or different rental subtype. |

No further concrete defect confirmed in this bounded source inspection. This is not whole-feature closure. Root owns remaining module/shared/i18n integration and final reconciliation.

## Verification boundaries

Scoped git diff --check passed after the final repairs. Inspected modified current source, scoped diff/removals and directly consumed public declarations. Source scans found no merge markers, any, toISOString, bare window.print, styleUrl references to removed sheets, or silent error handlers in these three folders. List/editor literal input IDs have zero collisions. These are source inspections, not compilation or runtime tests.

Owner acceptance: compile frontend; restore valid/cleared/partial/reversed URL dates and retry malformed state; navigate details1→details2 while a request/dirty decision is pending; verify Create/View Cancel/X/Escape and browser unload; exercise lookup/detail/save failure channels; export more than100 matching rows and compare columns/counts in EN/AR; print selected Custody detail; inspect narrow layout, keyboard focus, RTL and dark theme. No migration required for frontend-only repairs.

No builds, tests, lint, browser/runtime, database, migrations/snapshots, commits/pushes/deployment, Graphify or Sigma MCP performed. Suggested frontend commit belongs to root's aggregate report, not a separate commit from this bounded workstream.

## Reviewed-file manifest

Continuation addendum (2026-10-07, root): a later focused reread corrected the earlier all-editor discard-freeze claim. Delivery/Custody now defer confirmation until subscription, recheck visibility/identity/busy state, disable editable controls, and restore the same editor in finalize. Collection adds the fresh deferred visibility/identity/pending/save check. Root reread all three final guards and parsed the three files without syntax diagnostics; scoped whitespace checks passed. See MOVEMENTS_FEATURE_REVIEW.md continuation and CONTINUATION_SOURCE_VERIFICATION.json. Runtime/compilation/interaction verification remains pending.

Paths below are repository-relative under F:/My Work/Sigma/SiGmaAngularFrontEnd. M/D denote tracked scoped diff; A denotes new untracked source inspected. Shared source was read without edits in this workstream: shared utils list-query/list-route-state/date-utils/enum-options/api-error/scalar-validators/focus-field, BaseService, ReportPrintService, DriverService, CompanyDriverService, RentalAgreement service/detail contracts and installed Angular router declarations. Root remains owner of shared diff and dictionaries.

- M: src/app/modules/Movements/CustodyMovement/components/details/details.component.html
- D: src/app/modules/Movements/CustodyMovement/components/details/details.component.scss
- M: src/app/modules/Movements/CustodyMovement/components/details/details.component.ts
- M: src/app/modules/Movements/CustodyMovement/components/list/list.component.html
- D: src/app/modules/Movements/CustodyMovement/components/list/list.component.scss
- M: src/app/modules/Movements/CustodyMovement/components/list/list.component.ts
- M: src/app/modules/Movements/CustodyMovement/custodymovement.routes.ts
- M: src/app/modules/Movements/CustodyMovement/models/create.ts
- M: src/app/modules/Movements/CustodyMovement/models/details.ts
- M: src/app/modules/Movements/CustodyMovement/models/list.ts
- M: src/app/modules/Movements/CustodyMovement/services/custodymovement.service.ts
- M: src/app/modules/Movements/DeliveryMovement/components/details/details.component.html
- D: src/app/modules/Movements/DeliveryMovement/components/details/details.component.scss
- M: src/app/modules/Movements/DeliveryMovement/components/details/details.component.ts
- M: src/app/modules/Movements/DeliveryMovement/components/list/list.component.html
- D: src/app/modules/Movements/DeliveryMovement/components/list/list.component.scss
- M: src/app/modules/Movements/DeliveryMovement/components/list/list.component.ts
- M: src/app/modules/Movements/DeliveryMovement/deliverymovement.routes.ts
- M: src/app/modules/Movements/DeliveryMovement/models/create.ts
- D: src/app/modules/Movements/DeliveryMovement/models/customerDetails.ts
- M: src/app/modules/Movements/DeliveryMovement/models/details.ts
- D: src/app/modules/Movements/DeliveryMovement/models/driverDetails.ts
- M: src/app/modules/Movements/DeliveryMovement/models/list.ts
- M: src/app/modules/Movements/DeliveryMovement/services/deliverymovement.service.ts
- M: src/app/modules/Movements/collectionMovement/collection-movement.routes.ts
- M: src/app/modules/Movements/collectionMovement/components/details/details.component.html
- M: src/app/modules/Movements/collectionMovement/components/details/details.component.scss
- M: src/app/modules/Movements/collectionMovement/components/details/details.component.ts
- M: src/app/modules/Movements/collectionMovement/components/list/list.component.html
- M: src/app/modules/Movements/collectionMovement/components/list/list.component.scss
- M: src/app/modules/Movements/collectionMovement/components/list/list.component.ts
- M: src/app/modules/Movements/collectionMovement/models/create.ts
- M: src/app/modules/Movements/collectionMovement/models/details.ts
- M: src/app/modules/Movements/collectionMovement/models/list.ts
- M: src/app/modules/Movements/collectionMovement/services/collection-movement.service.ts
- A: src/app/modules/Movements/DeliveryMovement/models/agreement-context.ts
