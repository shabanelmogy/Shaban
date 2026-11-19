# Sigma Maintenance / Evolution Plan: Job Estimation frontend and backend completion

This is the required pre-implementation plan. It records current source behavior
and the decisions needed to freeze a target contract. It does not authorize
implementation while its status is Blocked.

## Plan metadata

| Item | Value |
|---|---|
| Change/capability | Job Estimation frontend and backend completion |
| Requested outcome | Add the Job Estimation feature under the Workshop Angular modules and complete the required backend/UI behavior shown by the seven supplied screenshots |
| Plan date | 2026-09-24 |
| Plan owner | User/system owner decisions recorded 2026-09-24 |
| Status | Frozen |
| Master version | 1.6 |
| UI book version | 0.68 |
| Backend book version | 0.16 |
| PLAN packet check result | Pass. Generate-SigmaRecipes.ps1 -Check returned OK for PLAN-00 and PHASE-00 through PHASE-06 |
| Existing working-tree changes | Frontend repository clean on review-movements (ahead 1); backend repository clean on Test (ahead 1). Workspace root is not a Git repository. |

## Scope and boundaries

| Item | Decision/evidence |
|---|---|
| Business outcome | Provide a routed Job Estimation list with one shared controlled editor dialog for create/view/edit, estimate actions, and estimation log, using the existing backend aggregate where valid. |
| In scope | F:\My Work\Sigma\SiGmaAngularFrontEnd\src\app\modules\Workshop, its route/menu/i18n wiring, the existing JobEstimation backend files and directly required Workshop lookup/API files, feature review artifacts, and reusable Sigma screen-refactor skill guidance when this review establishes a verified cross-feature rule. |
| Explicit non-goals | Unrelated Workshop refactoring; changes to unrelated Job workflows; changes to shared visual patterns; database migration generation/application; builds, tests, lint, database commands, or browser verification. |
| Affected workflows/roles | Estimate listing/filtering, create/edit/view, print/report/export, approve/reject, and add/view log entries with attachments. Screenshot role and permission metadata are Unknown. |
| Known operational/data constraints | Root AGENTS.md prohibits creating or running migrations; schema changes require an owner-run Add-Migration. The project has no authorization mechanism beyond AuthGuard. |

## Evidence boundary

The screenshots are functional/content evidence only. Their layout, CSS, controls,
and spacing are not implementation authority.

| Evidence | Visible behavior/content | Classification |
|---|---|---|
| 1.PNG | Estimate list, filters, columns, report/export/search buttons, row actions | Explicit content; action visibility by status is a strong inference |
| 2.PNG | Estimate list with a restricted row action menu | Explicit menu state; state/action mapping is a strong inference |
| 3.PNG | Estimate list with a different restricted row action menu | Explicit menu state; state/action mapping is a strong inference |
| 4.PNG | Read-only estimate details with vehicle/customer data, grouped job type/service/detail, item/labour/misc rows, totals, tax and discount display | Explicit visible fields; missing API ownership remains unresolved |
| 5.PNG | Job Log list with date/time, user, detail, attachments, and Add New Entry | Explicit |
| 6.PNG | Add New Entry form with detail and attachments | Explicit |
| 7.PNG | Estimate create form with date/time, type, customer, vehicle, mileage, make/model, year, chassis, job groups, editable item/labour/misc rows, totals, and Add Another Job | Explicit visible fields; persistence contracts remain unresolved where source has no field |

Locale/version, current-versus-historical status, viewport, and user role were not supplied as separate metadata.

### Screenshot grid evidence

| Screenshot label | Existing source candidate | Current evidence/status |
|---|---|---|
| Actions | No ListVM action state | Screenshot shows state-varying menus; exact server rules are not frozen |
| Estimation No | EntityBase.No; current search projection instead returns Id.ToString() | Conflicting: document-number settings exist, but the JobEstimation case is absent from CodeCreateService and falls through to its generic ticks-based value |
| Vehicle | Vehicle.PlateNo, with ChassisNo fallback in current search | Confirmed |
| Customer | Partner.Name | Confirmed |
| Customer Code | Customer.Code | Confirmed in existing search projection |
| Creator User Name | EntityBase.CreatedBy | Stored audit value exists; whether it is the required display name is not verified |
| Total Charges | JobEstimation.TotalCharges | Confirmed; backend recalculates |
| Date & Time | JobEstimation.DateAndTime | Confirmed |
| Status | Derived from ApprovalStatus; current search maps NotApproved to Open and Approved/Rejected to Closed | Derived and already present in source |
| Insurance Company | Candidate: Vehicle.Documents where DocumentType is Insurance, using CustomerDocument.IssuedBy | Strong inference; current JobEstimation search does not project it |

Visible filters are Estimate No, Customer, Approval Status, Date Range,
Plate/Chassis No, Status, Type, Branch, Created By, and Insurance Company.
The existing search request supports all except Insurance Company and has no
PageNo/PageSize. Filterability, sorting, and export scope are not proven by the
screenshots.

## Existing-State Inventory

| Concern | Current owner/source | Current behavior | Consumers | Known debt/constraint | Evidence |
|---|---|---|---|---|---|
| Domain/entities/settings | SigmaBackend/SiGma.Helpers/Models/Workshops/JobEstimations/JobEstimation.cs and child models | Parent stores date, customer, vehicle, mileage, approval state, totals, and grouped jobs. Each group stores JobType and child item/labour/misc collections. | JobEstimationService and generic CRUD base | Group has no Service or Detail property. Parent has no direct Job link or log collection. | Existing entity source |
| Persistence/schema | SiGmaDbContext, JobEstimation*Config files, initial create-database migration | JobEstimation and its existing child types are registered and configured. | Backend API | Any new Service/Detail/log relationship changes the model and requires an owner-run migration. No migration was created or run. | Existing DbSet/configuration |
| Writers/mutations | SiGma.Business/Services/JobEstimationService.cs | Add validates Customer and Vehicle, recalculates children/parent totals, then saves. Update queries the graph with AsNoTracking before mutating. Approval status accepts any enum value and saves it without transition checks. | Generic controller and any API client | FK validation uses Exists rather than distinct-id count; there is no minimum-child validation; update does not load a tracked aggregate; actions have no state guard. | Existing service source |
| Readers/queries | JobEstimationService.SearchJobEstimationsAsync and GetAllWithNavigationsAsync | POST search applies date/customer/status/type/branch/creator/vehicle filters and returns a complete unpaged list. It returns Id as EstimationNo. GetAllWithNavigations loads the full aggregate. | No Angular JobEstimation consumer found | Custom unpaged search does not follow the standard GetManyAsync(ListSmBase) paged contract. Existing external API consumers are Unknown. | Existing interface/controller/service; scoped Angular search returned no JobEstimation module/service |
| Calculations/precision | JobEstimation.RecalculateTotals and child Recalculate methods | Item and labour discounts are stored as amounts; totals are recalculated server-side; tax rate currently uses 5%; the frozen update keeps this backend-owned rate and prepares for a future settings source. | Add/Update and detail response | Rounding rules beyond existing decimal/EF precision are not fully specified. The screenshot values are consistent with the current 5% calculation. | Existing model/configuration and screenshot 4 |
| API contracts | JobEstimationController, IJobEstimationService, JobEstimation*VM and search DTOs | Generic CRUD plus POST search and POST change-approval-status. Existing DTOs expose aggregate fields but omit Service/Detail and log data. | No matching Angular client found | No page metadata on search; no log endpoint; no explicit Job conversion endpoint; current approval request accepts a target enum. | Existing controller/interface/DTO source |
| Angular workflows | SiGmaAngularFrontEnd/src/app/modules/Workshop | Job, WorkOrder, and lookup modules exist; no JobEstimation module or route exists. Sidebar has the label but links to the misspelled /JobEstimatons path. | Sidebar navigation | Must add the requested module and route and correct the in-scope menu link. | Scoped file search and app routing |
| Reports/export/print | Shared report-print and file-upload services; common/document-number settings | Shared infrastructure exists. No JobEstimation report implementation was found. Common settings include dontAllowPrintForUnApprovedJobEstimation. | Unknown for this feature | The list Report action has no defined report content or output contract. Print policy should consume the existing setting. | Scoped service/settings search |
| Authorization/tenancy | Generic repository/service and AuthGuard | Repository applies tenant ownership for writes; EntityBase holds CreatedBy/CreatedAt; Angular routes use AuthGuard. | Generic service/controller | Project guidance says there is no authorization mechanism; do not invent role or permission checks. | Root AGENTS.md and scoped base/entity source |
| Integrations/runtime | Sidebar menu, pages/routing.ts, shared selects, shared Media upload | Menu label exists; route does not. Shared file upload uses Media and returns a path. | Workshop module | No existing estimation log/upload persistence contract or Job Estimation event wiring. | Scoped Angular and backend source |
| Migrations/historical data | Initial database migration and current model | Existing estimate tables are present in the model and initial migration. | Existing database consumers | Existing estimates have no confirmed Service/Detail/log backfill policy. Migration changes are owner-run only. | Existing model/configuration; migration boundary in AGENTS.md |
| Job relation | SigmaBackend/SiGma.Helpers/Models/Workshops/Jobs/Job.cs and JobService | Job has an EstimationNo string. No JobEstimationId relation or conversion method referencing JobEstimation was found. | Job workflow | The screenshot log contains “Job Created,” but its trigger, cardinality, and copy rules are missing. | Scoped Job and JobEstimation source search |
| Service lookup | WorkshopActivity and JobCategory models; LabourRate references WorkshopActivity | WorkshopActivity supplies named service/activity options and owns labour rates. JobCategory is a separate name-only entity. | LabourRate and Workshop screens | JobEstimationJob currently references neither lookup; screenshot says “Service” but does not identify its source. | Existing model/service source and screenshot 4/7 |
| Insurance source | Vehicle.Documents and CustomerDocument | Vehicle details accept CustomerDocument rows; documents include DocumentType, IssuedBy, and expiry dates. | Vehicle feature | Insurance-company derivation is plausible from Insurance document IssuedBy, but no estimate projection/filter currently uses it. | Existing Vehicle and CustomerDocument source |

## Logic Ambiguity Register

| Rule/question | Evidence | Status | Impact | Required decision/source | Owner | Resolution |
|---|---|---|---|---|---|---|
| What does each job-group Service field reference, and what is Detail? | Screenshot 4/7 show Service and Detail. JobEstimationJob currently has only JobType. WorkshopActivity is a named Workshop lookup used by LabourRate. | Resolved | Adds nullable lookup and text fields to the estimate group and Job detail group. | Use WorkshopActivity and optional free-text Detail. | User/system owner | Approved 2026-09-24 |
| What creates the operational Job, and what is copied? | Screenshot 5 includes a Job Created event. Job and JobEstimation child rows have matching item/labour/misc shapes; JobDetail currently lacks Service and Detail. | Resolved | Crosses aggregates, adds a one-to-one optional estimate link, and requires transaction/idempotency. | Separate explicit action on an approved estimate; create at most one linked Job. Copy customer, vehicle, mileage, estimate number/date, every job group and all item/labour/misc rows. Add Service/Detail to JobDetail. Initialize Job.EstimatedCompletionTime from estimate DateAndTime; use Job's existing NotApproved default. | User/system owner | Approved 2026-09-24 |
| Which approval transitions and edit/delete locks are legal? | ApprovalStatus has Approved, NotApproved, Rejected. Screens show state-varying action menus. Backend currently accepts any target state. | Resolved | Controls server transitions, row actions, and whether approved/rejected estimates can be changed or deleted. | Only NotApproved -> Approved or Rejected. Approved and Rejected are terminal, read-only, and undeletable. | User/system owner | Approved 2026-09-24 |
| What should the list Report action generate? | Screenshot 1 shows Report; no report contract or JobEstimation report source was found. | Resolved | Determines report route/content, filters, output, and backend read model. | Report all estimates matching the current filter, independent of current page. | User/system owner | Approved 2026-09-24 |
| What numbering contract should Job Estimation use? | SettingsDocumentNumberModel has JobEstimationsPrefix, IncludeYearMonth, NumericPartLength, regex, and example. CodeCreateService currently falls back to JOBESTIMATION-<ticks>; canonical Backend block 11 prohibits copying the legacy count generator. | Resolved | Requires tenant/document-type sequence state and unique business numbers. | Use configured Job Estimation prefix/date/length with a concurrency-safe per-tenant, per-document-type sequence and unique index. Preserve existing numbers; do not rewrite historical values. | User/system owner | Approved 2026-09-24 |
| How are manual/system log entries and attachments persisted, and can users append to terminal estimates? | Screenshots 5/6 show log rows, Add New Entry, Detail, and Attachments. No JobEstimation log model or endpoint exists; shared Media upload stores a path. | Resolved | Adds estimate log and attachment records plus owner-run migration; log append remains available after terminal approval states. | Dedicated JobEstimationLog and attachment child records; server owns CreatedAt/CreatedBy; record Created, Approved/Rejected, Job Created and manual detail entries; attachments reference shared Media paths and are tenant-scoped. Manual entries are append-only and allowed in every state. | User/system owner | Approved 2026-09-24
| How is Insurance Company read/filter populated? | Vehicle owns document rows; CustomerDocument stores DocumentType, IssuedBy, IssueDate, and ExpiryDate; Insurance is a supported document type. | Resolved | Adds a deterministic projection/filter and distinct option source. | Use IssuedBy from the latest non-expired Insurance document for the vehicle, ordered by IssueDate then CreatedAt and Id as stable tie-breakers; a missing ExpiryDate is non-expired. | User/system owner | Approved 2026-09-24 |

## Impact Map

| Area/contract | Producer/owner | Direct consumers | Persisted/calculation impact | Compatibility risk | Required phase |
|---|---|---|---|---|---|
| Estimate aggregate and child groups | JobEstimationService and JobEstimation entities | Add/Edit/View, list, print | Service/Detail and log child schema may change | Existing estimates need nullable/default behavior | PLAN-00, PHASE-01 |
| Filter and paged list response | JobEstimationService.GetManyAsync(ListSmBase) | New Angular list/table/export | Read-only projection; no data write | Existing POST search may have external consumers; retain until compatibility is known | PHASE-01, PHASE-02 |
| Approval lifecycle | JobEstimationService and Controller | Row action menu and status display | Status mutation; possible job conversion | Current endpoint permits any enum transition | PHASE-01, PHASE-04 |
| Job conversion/link | JobEstimation and Job services/entities | Job Estimation and Job workflows | Creates/copies a Job and needs idempotency/atomicity rules | High; downstream Job consumers may observe new records | PLAN-00, PHASE-01, PHASE-04 |
| Log and attachments | New JobEstimation log API using shared Media paths | Log view/add dialog | New log and attachment persistence | Requires migration; uploaded orphan cleanup contract | PHASE-01, PHASE-03, PHASE-05 |
| Numbering | CodeCreateService and SettingsDocumentNumberModel | Estimate display/search/print | No currently stored-estimate backfill rule | Shared numbering behavior and uniqueness | PLAN-00, PHASE-01 |
| Insurance company | Vehicle.Documents/CustomerDocument | Filter and grid column | Derived read value only if existing documents are authoritative | Multiple/current document selection rule | PHASE-01, PHASE-02 |
| Angular module/routes/menu | Workshop feature and pages/routing.ts | Sidebar navigation and deep links | None | Correct existing typo without changing desired URL unexpectedly | PHASE-05 |
| Report/print/export | Shared report/print infrastructure | List/report/estimate print | Read-only output | Report format/content missing | PHASE-02, PHASE-05 |
| English/Arabic labels | i18n vocabs | Every new screen/dialog/action | None | Duplicate keys and parity | PHASE-05 |

## Gap Decision Table

| Area | Current state | Decision | Target responsibility | Reason/evidence |
|---|---|---|---|---|
| Workshop Angular feature | No JobEstimation module/route; sidebar entry exists with misspelled path | Create | New Workshop feature module using the current standalone/routed conventions | Direct user request and screenshot evidence |
| List/read API | Existing unpaged POST search and a broad generic list VM | Refactor/extend | Standard paged GetManyAsync(ListSmBase), scoped filters, narrow ListVM, authoritative Results metadata | Root AGENTS and backend/UI canonical list contracts |
| Estimate detail | Existing parent/child aggregate but missing Service/Detail display data | Extend after contract freeze | Existing aggregate owns details and server-calculated totals | Screenshot content and current JobEstimation model |
| Add/update | Existing service has FK and tracking gaps | Refactor | Validate distinct child FKs, load tracked graph, reconcile children, recalculate once, save one graph | Canonical Backend Pattern 3 shape; no journal/allocation write occurs for this aggregate |
| Approval | Existing blind enum update | Refactor after transition contract freeze | Explicit server-validated state transition methods and truthful row action state | Screenshot states plus backend action rules |
| Logs | No JobEstimation history owner | Create after log contract freeze | Dedicated log child with attachments using shared upload storage | Screenshot 5/6; no existing suitable JobEstimation history |
| Job conversion | No conversion/link endpoint | Add explicit action | One idempotent Job creation action from an approved estimate, with direct matching-field and child-row copy | Owner-approved lifecycle/mapping 2026-09-24 |
| Insurance display/filter | Vehicle document source exists | Extend as derived projection | Read the latest non-expired Insurance document IssuedBy; no new insurer field | Owner-approved source rule 2026-09-24 |
| Numbering | Generic service assigns fallback; specific settings unused | Replace for new estimates | Use a concurrency-safe per-tenant/document-type counter and unique business number; preserve old values | Owner-approved strategy; canonical Backend block 11 |
| Report action | Button visible; no report contract | Implement | Report all filtered estimates, independent of page, via shared report/export patterns | Owner-approved report contract 2026-09-24 |

## Option / Decision Matrix

| Option | Correctness | Ownership/maintainability | Compatibility/migration | Future extension | Complexity/risk | Decision/reason |
|---|---|---|---|---|---|---|
| Service uses WorkshopActivity; Detail is text on each estimate and Job detail group | Fits current workshop activity/labour-rate model and screenshot grouping | Reuses existing lookup | Adds nullable relationship and text columns; requires owner migration | Preserves the same service/detail when converted to a Job | Medium | Approved by user on 2026-09-24 |
| Service uses JobCategory or free text | Could fit a different business meaning | JobCategory is currently name-only; free text duplicates a lookup | JobCategory may need relation; free text avoids lookup but loses validation | Weaker pricing/lookup reuse | Medium | Not selected without owner decision |
| Approval automatically creates Job | Matches a possible reading of the Job Created log row | Couples approval to Job creation | New aggregate write and transaction/idempotency behavior | Tighter one-click workflow | High risk if approval is not customer acceptance | Not selected; approval and execution are separate |
| Separate Create Job action after approval | Separates approval from execution | Clear state ownership | Nullable unique link, direct mapping and idempotency; owner migration required | Supports later review before dispatch | Medium/high | Approved by user on 2026-09-24; copy matching parent fields and every group/item/labour/misc row, preserve Service/Detail, set completion from estimate date/time |
| Use existing CodeCreateService output | Requires no new number implementation | Reuses current generic helper | Produces fallback ticks format instead of configured JE format | None | Low change effort, high screenshot/config mismatch | Not selected without explicit acceptance |
| Add a JobEstimation case to the current count-based generator | Uses configured prefix/date/length | Extends shared helper but copies a Legacy algorithm | Count-based collisions/concurrency risk; may affect numbering behavior | Limited | High correctness risk | Prohibited by canonical block 11 |
| Build a safe shared numbering mechanism for configured document types | Supports configured numbering and concurrent writes | Correct shared owner | May require counter/sequence and unique-index migration | Strong | High; broadens scope beyond this feature | Requires owner authorization and a frozen shared-numbering plan |
| Dedicated estimate log child and attachment child | Persists screenshot-visible manual/system history | Log belongs to its estimate | New tables and owner-run migration | Supports more event types later | Medium | Recommended once event ownership and attachment retention are frozen |
| Reuse another feature's log table | Avoids a new table superficially | Wrong aggregate ownership | Cross-feature coupling and data contamination | Poor | High | Rejected; existing logs are agreement-specific |

## Decision Review

| Decision requiring owner input | Options presented | Trade-offs explained | Owner decision | Evidence/date | Remaining condition |
|---|---|---|---|---|---|
| Service and Detail data contract | WorkshopActivity + optional text | Reuses the existing named Workshop lookup and preserves group detail | Approved: use WorkshopActivity and optional Detail | Screenshot 4/7; WorkshopActivity/LabourRate source; owner decision 2026-09-24 | Add fields to JobEstimationJob and JobDetail |
| Approval and Job creation lifecycle | Only pending approve/reject; separate one-time conversion action | Approval does not implicitly start workshop execution | Approved: terminal states read-only/undeletable; Job action is separate and limited to one per estimate | Screenshots 1-5; existing Job/JobEstimation shapes; owner decision 2026-09-24 | Enforce transitions, unique link, direct-copy mapping and idempotency |
| Job conversion mapping | Matching parent fields and grouped children | Job model already has compatible customer/vehicle/mileage and item/labour/misc values; Service/Detail need fields on JobDetail | Approved: copy all matching fields and rows; Job.EstimatedCompletionTime equals estimate DateAndTime; Job status uses existing NotApproved default | Job.cs, JobDetail.cs, matching estimate entities/VMs; owner decision 2026-09-24 | Implement as transaction and log Job Created |
| Report output | Filtered-list report | Report all matching records independent of current page | Approved 2026-09-24 | Screenshot 1; owner decision 2026-09-24 | Reuse shared report/export flow |
| Numbering | Safe configured JE numbering | Prevent tenant collisions and concurrent duplicate numbers while using existing settings | Approved: per-tenant/document-type concurrency-safe sequence plus unique index | SettingsDocumentNumberModel, CodeCreateService, Backend block 11; owner decision 2026-09-24 | Add counter/unique schema; preserve existing No values |
| Insurance source/selection | Latest non-expired vehicle Insurance document IssuedBy | Use IssueDate, then CreatedAt and Id as deterministic tie-breakers; null expiry is non-expired | Approved 2026-09-24 | Vehicle.Documents, CustomerDocument; owner decision 2026-09-24 | Project/filter the derived insurer consistently |
| Estimate logs and attachments | Dedicated estimate log and attachment child records | Server audit identity/time; shared Media path references | Approved 2026-09-24; append-only in every state | Screenshots 5/6; shared Media; owner decision 2026-09-24 | Persist manual/system events through owning transactions; manual entries remain allowed in every estimate state |

## Frozen Target Contract

| Contract | Target owner | Exact rule/shape | Consumers affected | Status/evidence |
|---|---|---|---|---|
| Domain/invariants | JobEstimationService | Parent owns grouped estimate jobs/items/labours/miscs; server recalculates totals. Only NotApproved -> Approved/Rejected is legal; terminal estimates cannot be edited/deleted. An explicit action on Approved creates at most one linked Job and records a log entry. | UI, Job workflow | Frozen by user decision 2026-09-24 |
| Persistence/data | JobEstimation/Job entities, JobDetail, log and numbering configurations | Nullable ServiceId and Detail on both grouped detail models; dedicated log/attachment child tables; nullable unique Job.JobEstimationId relationship; per-tenant/document-type numbering counter and unique index on business No. | Backend, existing database | Frozen; owner-run migration required |
| Calculations/precision/rounding | JobEstimation aggregate | Keep child discounts and tax backend-owned. Preserve the current 5% rate; expose it through GET /JobEstimation/options so future settings resolution stays backend-owned. | Detail, list, print | Confirmed by existing model and screenshot values |
| API/request/response | JobEstimationController/service | New list uses ListSmBase filters and paged Results; list DTO contains only visible fields plus real row-action state; Add/Update excludes No, approval status, and calculated totals. The report route reuses the paged list query to load all filter matches and does not call transitional QueryReport. | Angular list/editor/report | Frozen to canonical contracts; fields/actions are enumerated in the Phase 0/1 artifacts |
| Failure behavior | JobEstimationService and Angular feature | Preserve standard Result/Results wrappers; handle both isSuccess=false and transport errors. | All feature interactions | Confirmed project contract |
| Authorization/tenancy | Repository/AuthGuard | Use repository tenant scoping and AuthGuard; do not add a permission API. | API and routes | Confirmed by project guidance |
| UI/workflow | Workshop feature | Canonical feature page/grid; one `app-editor-dialog` for create/view/edit with shared editable child collections; small shared dialog for log entry; date-range picker with current-month default. | New Workshop module | Canonical shape selected; append-only logs are available in every state |
| Reports/export | Shared table/report/print owners | Report uses the canonical report page and prints all current filter matches; Excel export gathers all current filter matches across pages; individual estimate print honors the existing unapproved-print setting. | New feature | Frozen to canonical UI blocks 8, 20, 21 and owner decision 2026-09-24 |
| Integration/runtime | pages/routing.ts, Workshop sidebar, i18n | Add lazy `JobEstimation` route to the feature under Workshop, correct the existing menu typo, register both language keys, preserve shared HTTP/interceptor path. | Navigation and feature | Confirmed in scope; route contract to freeze in PHASE-05 |

## Migration and Compatibility Plan

| Change | Existing data/consumers | Migration/backfill/default | Rollout order | Recovery/rollback | Owner action |
|---|---|---|---|---|---|
| Add Service reference and Detail to estimate and Job detail groups | Existing groups have neither field | Nullable ServiceId and nullable Detail preserve old estimates/jobs; no inferred backfill | Backend model/API, owner migration, then Angular editor | Nullable fields permit old records to remain readable | Owner runs Add-Migration and reviews generated schema |
| Add estimate log and attachment persistence | Existing estimates have no JobEstimation log rows | No historical log backfill is possible from current aggregate fields | Backend persistence/API and owner migration, then log UI | New rows can be removed without deleting estimates if relation is optional | Owner runs Add-Migration and verifies storage/retention |
| Add unique estimate-to-Job relation | Existing Jobs may contain EstimationNo strings only | Nullable Job.JobEstimationId with unique index; do not infer/backfill links from strings | Backend model/API, owner migration, then conversion action | Existing Jobs remain unlinked and readable | Owner runs Add-Migration; duplicate conversion requests return the existing linked Job |
| Standard paged list endpoint | No Angular JobEstimation consumer found; external clients Unknown | Add canonical GET list; retain POST search during compatibility window unless owner confirms no external consumers | Backend route then Angular client | Legacy endpoint remains available | Owner confirms external API compatibility before any deprecation |
| Numbering behavior | Existing EntityBase.No values may be fallback-generated | New records use configured prefix/date/numeric length and a tenant-scoped document-type counter; no rewrite of old numbers | Add counter/unique schema, then number generation and list query | Preserve old numbers; surface collisions instead of silently renumbering | Owner runs Add-Migration and validates concurrent creates |
| Job conversion | Existing Jobs may contain EstimationNo strings | Do not infer historical links; new conversion copies approved estimate and its groups/children | Contract, backend conversion, UI action, then reconciliation | Transaction plus unique optional relation makes retries idempotent | Owner runs Add-Migration; direct mapping is frozen above |

## Dependency-Ordered Implementation Plan

| Slice | Outcome | Depends on | PHASE packets | Main source areas | Completion evidence |
|---|---|---|---|---|---|
| 0 | Freeze plan decisions and source-backed contracts | User decisions above | PLAN-00 | reviews artifact | Plan status Frozen |
| 1 | Freeze screenshot manifest and backend/API contract | Slice 0 | PHASE-00, PHASE-01 | JobEstimation domain/service/controller/DTOs | Phase 0 and Phase 1 handoffs Frozen |
| 2 | Implement paged read path, exact filters, list DTO, export | Slice 1 | PHASE-02 | Backend JobEstimation service; new Workshop list/service/models | Filter-to-query-to-grid reconciliation |
| 3 | Implement create/view/edit dialog, child groups, log and attachments | Slice 1 | PHASE-03, PHASE-05 | New Workshop details/models/templates; backend aggregate/log APIs | Detail/write/upload contract reconciliation |
| 4 | Implement approve/reject and optional Job conversion | Slices 1 and 3; lifecycle decisions | PHASE-04 | Backend action methods/controller; action menu | Every supported action has a complete vertical slice |
| 5 | Complete route/provider/menu/translations and refresh wiring | Slices 2-4 | PHASE-05 | Workshop route, pages/routing.ts, sidebar, en.ts, ar.ts | Deep-link and response wiring review |
| 6 | Reconcile all scoped code and decisions | Slices 1-5 | PHASE-06 | Both affected repositories | Complete scoped diff and contract comparison |

## Verification Matrix

| Behavior/risk | Source verification | Automated verification | Runtime/browser/data verification | Owner | Gate |
|---|---|---|---|---|---|
| List filters, pagination, DTO/columns | Compare exact filter keys and ListVM to grid columns; inspect query ordering/count/page metadata | Not run under current AGENTS restrictions | Owner may build and exercise filter/paging/export | User/repo owner | Phase 6 source reconciliation |
| Aggregate Add/Update and totals | Check distinct FK counts, tracked reconciliation, server-owned values, single-save transaction | Not run | Owner validates persisted graph and displayed totals | User/repo owner | Phase 1/3 contracts |
| Approval and Job creation | Verify legal source/target state, all dependencies, idempotency, and UI state | Not run | Owner exercises each transition and duplicate/retry case | User/system owner | Contract must be Frozen |
| Log and attachments | Verify path validation, tenant ownership, delete/orphan behavior, and relation scope | Not run | Owner runs migration and tests upload, discard, and log retrieval | User/repo owner | Migration and storage contract |
| Numbering | Verify selected safe generator, uniqueness, settings use, and API display consistency | Not run | Owner validates concurrent creates and existing values | User/system owner | Numbering decision required |
| Routes/i18n/errors | Inspect route, menu path, both languages, declared and transport failure handling | Not run | Owner builds and checks Arabic/English routes and RTL | User/repo owner | Phase 5/6 |

## Open Decisions

| Decision | Status | Blocks slice | Required evidence/owner | Next action |
|---|---|---|---|---|
| External consumers of legacy POST search | Unknown | 1-2 | API integration owner | Preserve the existing POST endpoint; add the canonical paged GET route additively and defer deprecation until consumers are inventoried |

## Freeze decision

| Gate | Result/evidence |
|---|---|
| Existing state audited end to end | Yes for the directly related JobEstimation, Job, Vehicle/document, Workshop lookup, API, route, settings, and shared upload source |
| Required ambiguities resolved | Yes; append-only manual log entries are allowed in every estimate state |
| Impact/direct consumers understood | No Angular consumer found; external API consumers remain Unknown, so the legacy POST endpoint stays additive/compatible |
| Gap decisions explicit | Yes |
| Viable options compared | Yes for service, conversion, logs, and numbering |
| Target contracts frozen | Yes; domain, persistence, list/report, numbering, insurer, job conversion, all-state append-only logs, and backend-owned 5% tax preview with future settings resolution are recorded |
| Migration/compatibility defined | Yes; nullable fields and optional relations preserve existing records, historical numbers/links are not rewritten, and schema changes require owner-run Add-Migration |
| Implementation dependency order defined | Yes |
| Verification defined before coding | Yes; build/test/database/browser verification remain owner-only |
| Final plan status | Frozen after user decisions on 2026-09-24. Application implementation may proceed under the contracts above; schema changes require owner-run Add-Migration. |

## User-directed UI amendment — 2026-09-24

After the plan was frozen, the user explicitly changed the Job Estimation
editor from the planned modal to a full-page routed form, then clarified its
layout. This addendum updates the frozen UI/workflow contract while preserving
the plan's prior decision as history. No backend or persistence contract is
changed.

| Area | Amended decision | Evidence |
|---|---|---|
| Editor routes | Add `/JobEstimation/create`, `/edit/:id`, and `/view/:id`. Carry current list filters, page, page size, and sort through the editor round trip. | User instruction: make the editor full page; route behavior follows the canonical routed full-page form variant. |
| Form layout | First row: full-width Estimate Details. Second row: Jobs master list on the left and selected Job Details on the right, including type/service/detail and the existing item/labour/misc collections. | User's row-by-row layout clarification and screenshot-visible content in E4/E7. |
| Ownership | Preserve one typed aggregate form and existing `FormArray`; group selection does not move or copy form state. The footer owns Cancel/Save; print expands every group. | Canonical routed form and child collection guidance; existing frozen Add/Update aggregate contract. |
