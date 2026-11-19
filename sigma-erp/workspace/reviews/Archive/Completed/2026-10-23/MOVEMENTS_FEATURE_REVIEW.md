# Movements frontend review and implementation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | src/app/modules/Movements, directly related shared owners, routing and EN/AR translations |
| Baseline | Frontend HEAD 3886cdef; clean tree at discovery. Backend read-only, clean. |
| Authority | Sigma AGENTS; sigma-screen-refactor; Master4/5/7; canonical UI and BE blocks |

## Manifest and evidence

Seven screens: CollectionMovement, DeliveryMovement, CustodyMovement, Workshop, WorkshopMovement, NRM use UI01 list with controlled modal editor (WorkshopMovement has one existing small document collection). LogsMovement is an operational read/report exception with an existing six-tab viewer, atomic supporting-document upload and Check Card. BE1 contracts are inspected only; no business/persistence changes are authorized by this frontend path request. No supplied screenshots; source evidence only.

Recipe Check: all phases except Phase01 stale. Canonical blocks prevail; owner regeneration and semantic review pending. No generated packet edited. Existing Frozen LOGS_MOVEMENT_* contracts dated2026-10-03 remain authoritative for document grouping, source adapters, five-source Check Card and intentional blank unsupported checklist/signature data.

Phase0/1 discovery/freeze; Phase2 grids/filter/paging/export; Phase3 typed detail/write/documents; Phase4 existing action gates only; Phase5 route/provider/interceptor and direct-consumer integration; Phase6 source reconciliation. No new lifecycle, accounting, permissions or persisted fields.

## Conformance reference before implementation

| Concern | Owning blocks | Actual approved reference / shared owner | Target decision |
|---|---|---|---|
| List bounds/title/filter | UI1/3/4 | Workshop/Job list metadata and template; styles.scss; FeatureTitle; FilterPanel/FilterActions | Match container-fill chain, panel title, stable shared filters, Reset/actions gap; no private shell CSS |
| Grid/exports | UI5/6/8 | DataTable public inputs/columns; data-table-export; list-query | Match displayed column order, real paging metadata, full applied-snapshot export; omit unsupported sorting |
| Controlled editor | UI13/15 | EditorDialog current public events; FormSection; StateMessage; FieldError | Bind saveRequested/closeRequested/escapeRequested, translated subtitle, contentPadded, view text, typed forms and busy/dirty gates |
| Dates/lookups/enums | UI16/17/19 | date-utils/date-picker directives; translateOptions/enumOptions; owning select services | Strict manual dates, calendar filters yyyy-MM-dd, local date-time transport; no UTC shifts or fabricated branch IDs |
| Lifecycle/cancellation | UI10/22/28 | ConfirmationDialogService; DestroyRef/switchMap; apiErrorMessage/composedReadErrorMessage | Both failure channels, retry, latest request, loading finalizers, route/close guards, no stale identity patches |
| Documents | UI14/18 | CompanyPartner app-documents, document form factory/upload tracker | Reuse existing upload and document contract, preserve stored paths, track cleanup; no filename-as-path |
| Print | UI21 | ReportPrintService.createSession; shared print isolation and DataTable printAllRows | Loaded selected detail for record actions, full applied snapshot for Logs report, cancellable cleanup |
| Existing Logs ownership | Frozen2026-10-03 artifacts | MovementCheckCardComponent and check-card-report | Preserve six tabs, identity documents/read-only source, eligible atomic Agreement upload and blank unavailable report fields |

## Execution ownership

Root owns Collection/logs contracts, Logs implementation, shared integration, translations, canonical learning and reconciliation. Delivery/Custody worker exclusively owns those two folders. Workshop/WM/NRM worker exclusively owns those three folders. Collection worker exclusively owns collectionMovement. Workers submit vocabulary additions as review JSON; they do not edit shared/i18n or each other's files. Backend and references remain read-only.

Detailed API/property/range evidence: Movements/DELIVERY_CUSTODY_DISCOVERY.md and Movements/WORKSHOP_NRM_DISCOVERY.md; root contract freeze below. Runtime, compilation, browser, RTL/theme/visual and database verification pending owner. Prohibited commands stay prohibited.

## Implementation and reconciliation — 2026-10-07

All seven screens have been implemented against the Frozen frontend contract. Root integrated the separate workers, reviewed their source and the bounded final audits, and owns final closure. This is source conformance; compiler/runtime/visual acceptance remains pending.

| Phase | Applied work / boundary |
|---|---|
| 0–1 | Actual producer/controller/DTO/enum/shared-reference evidence and frozen contract; no screenshots supplied or unresolved frontend business decision invented. |
| 2 | Shared list/filter/table composition, real paging metadata, supported filters/order, complete applied-snapshot Excel through fetchAllPages. |
| 3 | Controlled typed modal editors, exact lengths/enums, local date-time transport, signed Int32 versus string mileage, failure/retry, save/discard freezes and existing Workshop document/upload cleanup. |
| 4 | Existing Collection Delete confirmation and selected Custody/WM/NRM Print gates. No new lifecycle, privilege or accounting action; backend implementation skipped for this frontend path request. |
| 5 | Compatibility create/details routes, accepted path-param hydration, route/unload/dirty/upload guards, owning lookup services and retained outer route exports. |
| 6 | Scoped source/diff/removals, contract/export/metadata/member/type comparisons, vocabulary and whitespace reconciliation; no runtime verification. |

### Decisions and column/property match

Columns are in displayed/Excel order; matching frontend properties sit beside their source decisions. Backend ListVM over-scope remains report-only.

| Screen | Columns / matching consumed row properties | Minimum other state and decision |
|---|---|---|
| Collection | collectionMovementNo, typeName, agreementNo, plateNo, driverName, collectionLocation, dateOut, fuelLevelOutName, kmOut, dateIn, fuelLevelInName, kmIn, status | id/type for identity/localization. Null type means Agreement Collection; status is producer constant Delivered. |
| Delivery | no, typeName, agreementNo, plateNo, location, dateOut, fuelLevelOutName, kmOut, dateIn, fuelLevelInName, kmIn, status | id/type/fuelLevel for actions/localization; null inbound aliases remain null. No return state inferred. |
| Custody | custodyMovementNo, movementDate, branchName, plateNo, makeAndModel, agreementNo, fuelLevelName, kMs, notes | id/fuelLevel for actions/localization; existing fuel subset0/2/4/6/8 retained. |
| Workshop | name, no, createdBy, createdAt | id. Fictional sku/categoryName removed; actual Create250/Edit50 name limits retained. |
| Workshop Movement | no, plateNo, makeAndModel, workshopName, workshopCode, dateOut, dateIn | id. WorkshopId is Supplier; internal Workshop master is independent. Both dates alias DateOf. |
| NRM | no, localized type, plateNo, makeAndModel, staffName, staffCode, dateOut, dateIn | id/type; numeric type produces translated text rather than redundant raw typeName. Both dates alias DateAndTime. |
| Logs | movementNo, movementType, refNo, plateNo, makeAndModel, contact, contactCode, dateTimeOut, dateTimeIn, kmOut, kmIn, kmDifference, fuelLevelOut, fuelLevelIn, branchOut, branchIn, notes, isClosed, createdAt, createdBy | movementId/movementKey/source/hasNewDamages; five-source View/Check Card. Custom GetMovements parameters are top-level; calculations/closure/damage flags remain server-owned. |

Reference conformance: Job owns the actual sigma-route-host/list-page/panel/header/table chain, FeatureTitle, stable FilterPanel with projected actions and fill DataTable. Editors consume the actual EditorDialog/FormSection declarations and UI13 controlled composition; current Fleet editors are routed, so they were not claimed as modal references. Standalone registration, exact exports/events/inputs, library declarations and inherited members were compared. Nonexistent sigma-editor-fields was replaced with sigma-editor-grid; Logs date range occupies one filter column. Auto-height WM/NRM/Workshop scroll regions use flex-fill; Logs viewer/preview has one bounded shared scroll region, with the print hint outside it. Private shell/button/table/viewport styles were removed; frozen document-group/vehicle-diagram geometry remains feature-owned.

Queries/dates: current-month defaults/reset, with the existing Logs today/today exception. Filters use inclusive calendar yyyy-MM-dd and editors use local date-time without Z. Invalid/partial/reversed restored ranges remain invalid; initial retry/paging/export/print require a valid applied snapshot. Subsequent draft edits do not silently alter exported filters. WM/NRM ineffective status/sort claims were removed; server page metadata remains authoritative. Unique filter/editor input IDs repair label/focus targeting. Installed Angular17.3.12 already guards changed path params while reusing routeConfig, so paramMap hydration follows that guard without another discard dialog.

Writes: minimal editable DTOs omit tenant/audit/GUID/number/derived fields. Collection/Delivery/NRM mileage remains text including zero; Custody/WM mileage and Logs threshold use optional signed Int32 validation. WM/NRM writes use kMs; readers normalize actual kMs/nrmNO to compatibility aliases consumed by Logs. Nullable/zero/historical labels remain intact. RentalAgreement supplies scalar branch text but no branch FK, so that FK remains null. Optional fields and required UI selections follow the Frozen contract.

Async/actions: one switchMap list stream; cancellable identity-bound reads; global loader pairs for screen/detail/save/export/delete and local auxiliary lookup flags. Inline errors have skip-error headers and handle business/HTTP failure channels. Editors freeze fields during save/discard, retain entered values on failure and check identity before patch/close. Existing Collection destructive action uses shared confirmation and pending/latest-state guards. No new Edit/Delete/activation/return action was inferred from an inherited API.

Documents/output: Workshop reuses CustomerDocumentAddVM rules, app-documents, documentPayload, actual stored paths and upload tracker cleanup/retry; View uses typed DataTable/FileLink and shared saved-date hydration. DataTable supports both implicit and explicit row context, so its explicit row binding is clarity, not an undefined-context defect. Logs preserves six tabs, read-only stored identity groups, eligible atomic Agreement upload and child pending/dirty navigation gates. Unsupported checklist answers, signatures and geolocation remain blank. Selected-record print uses loaded View and ReportPrintService isolation; Logs report/Excel collect all applied-filter pages and preserve all 20 columns and screen paging. Existing Check Card paper report is unchanged.

Vocabulary: EN/AR errors, retry/discard, enums, document label and Workshop master additions; existing Arabic Collection title corrected from English. Neutral fuelLevelNames retains exact numeric enum IDs without copied fuel arithmetic. Dictionary edits preserve unrelated values/formatting. Literal-key and generated-enum source comparisons found no missing EN/AR key.

### Backend, learning and verification boundary

This task changed no backend entity/service/controller/AutoMapper/schema file. No Add-Migration required. Calculations remain server-owned. Existing missing FK/ownership validation in add overrides, max-ID numbering race, differing Workshop name limits, deep/redundant DTO mappings, sparse TotalPages/missing timestamp ties, constant statuses/duplicate date aliases and in-memory Logs aggregation remain producer findings in discovery. They do not authorize a new frontend lifecycle or financial rule.

Reusable learning promoted together: UI19 signed Int32 validation, existing scalar-validators owner, required skill §6.2/revision row and UI preamble/history1.92. Requiredness/narrower business bounds remain feature-owned. Documentation Git root is F:/My Work/Shaban Documents/Shaban; older task changes were already present and preserved. This task adds1.92 content to ui/19-validation-messages.md, ui/00-preamble.md and CHANGELOG.md, plus the Sigma-local skill update.

Final read-only recipe Check: PLAN00/Phase00/02/03/04/05/06 stale; Phase01 current. Canonical split blocks prevailed; generated files were not edited. Owner regeneration and semantic comparison remain pending.

The initial full source parser/declaration pass inspected 53 runtime TypeScript files, 15 Angular templates, 518 named local imports, 384 shared public bindings and 2308 declared/inherited member references without reported problems. Literal key inspection covered 624 in-scope strings with no missing EN/AR key; unused NRM imports removed. The continuation below records the later three-file guard repair separately. These checks do not perform Angular/TypeScript type compilation or certify runtime/visual behavior. Scoped frontend diff --check passed. Backend was clean at discovery; final status contains concurrent unrelated LimoQuotation changes. No in-scope backend change belongs to this task. Those backend and Limousine frontend edits were preserved without investigation or mutation. Bounded audit artifacts and FINAL_CHANGED_FILES.txt carry reviewed-file evidence.

### Owner acceptance

1. Compile frontend; open all seven screens in EN/AR, light/dark, RTL and narrow widths. Check scroll bounds, action gaps, keyboard focus, overlays and valid/cleared/invalid dates.
2. Exercise Create/View and Workshop Edit, required/length/enum limits, zero/text mileage and signed Int32 endpoints. Fail lookup/detail/save through both failure channels, then Retry; inputs must survive failure and freeze during save.
3. Navigate details/1→details/2, close by X/Cancel/Escape and leave/unload during dirty/save/upload/confirmation work. Confirm identity isolation; malformed URL dates must not yield an unfiltered initial request.
4. Export more than 100 matching rows per list, comparing counts/order/localized grid values and applied versus draft filters. Print selected Custody/WM/NRM details and full Logs/Check Card; inspect pagination and restored screen state.
5. Add/upload/remove Workshop documents, validate date ordering/lengths and retry cleanup failures. Inspect saved links and Logs identity/supporting groups, atomic upload and child gates; unsupported answer/signature fields stay blank.
6. Review producer findings before separately authorizing backend changes; regenerate stale recipes and semantically review them.

Suggested frontend commit: `refactor(movements): align lists and editors with canonical UI contracts`.
Suggested documentation commit: `docs(sigma): document signed Int32 movement validation`.
No backend commit suggested; no commit made.

Agent utilization: discovery and disjoint workers owned Delivery/Custody, Workshop/WM/NRM and Collection; root owned Logs, freeze, shared validator, translations and integration. Final bounded audits covered Delivery/Custody/Collection (with approved repairs) and Workshop/WM/NRM/Logs (read-only). Session models inherited; no model override. Separate ownership reduced serial work without shared-file writes; root retained decisions/closure and checked on-disk worker outputs after earlier agents ended.

No builds, tests, lint, browser/runtime, database, migrations/snapshots, commits/pushes/deployment, Graphify or Sigma MCP were run. Owner compiler/runtime/visual/output acceptance stays explicit.

Changed application files: 81 (80 tracked changes and 1 new agreement-context model), listed in [FINAL_CHANGED_FILES.txt](<../../../Movements/FINAL_CHANGED_FILES.txt>). Shared non-feature edits are limited to scalar-validators.ts and EN/AR dictionaries. Evidence: [SOURCE_VERIFICATION.json](<../../../Movements/SOURCE_VERIFICATION.json>), [Delivery/Custody/Collection audit](<Movements/DELIVERY_CUSTODY_COLLECTION_FINAL_AUDIT.md>), and [Workshop/NRM/Logs audit](<Movements/WORKSHOP_NRM_LOGS_FINAL_AUDIT.md>).

## Continuation reconciliation — 2026-10-07

The owner's continuation prompted a focused reread of discard gates. Delivery/Custody blocked close/save while confirmation was pending but did not disable their editable controls, contrary to this report's earlier all-editor freeze claim. Root completed those two freezes, with unchanged values/dirty state and same-identity restoration in finalize. Their confirmation now opens inside defer, after a fresh visibility/identity/busy check; an unsubscribed guard no longer opens a dialog or sets pending state. Collection already deferred and froze controls, but now rechecks its captured identity and pending/save state at subscription to reject stale or duplicate guard observables. Existing confirmation service, route guards, contracts and APIs are retained.

Changed continuation application files: the three details.component.ts files under CustodyMovement, DeliveryMovement and collectionMovement. All were already in the 81-file manifest. The three complete final canDeactivate methods were reread; source parsing found no syntax diagnostics, and installed RxJS declarations export the existing defer/of operators. Scoped whitespace checks passed. [CONTINUATION_SOURCE_VERIFICATION.json](<../../../Movements/CONTINUATION_SOURCE_VERIFICATION.json>) supplements the earlier full-pass evidence; no compilation/tests/runtime run. Verify Cancel preserves values/dirty state, accepted discard closes once, duplicate navigation/close does not replace the active confirmation, and an obsolete captured guard cannot affect a newer editor.

Reusable guidance promoted into UI10, UI preamble/history1.93 and required skill §7/revision history: deferred confirmation, fresh identity/busy checks and pending-control freeze/restore. Generated recipes still require regeneration and semantic review. No subagents used for this continuation: the three repairs are one tightly related guard workstream with root-owned documentation and no useful independent delegation. Unrelated concurrent Limousine/frontend/backend changes remain preserved. Status remains Implemented — source-only; owner compiler/runtime/visual acceptance is pending.
