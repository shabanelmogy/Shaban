# Equipment Rental documentation conformance follow-up — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Review `src/app/modules/Equipment Rental` and implement documentation-supported changes |
| Scope | Frontend module, directly required guide/reader/menu integration; backend producer evidence read-only |

## Manifest and contract gate

The historical `EQUIPMENT_RENTAL_FRONTEND_CONTRACT_FREEZE.md` and 2026-10-07 review remain intact. Current frontend source retains their API, field, state and shape contracts. This continuation changes only confirmed source conformance and adds Master7's required user guide. No new business behavior, API, permission, accounting flow or persistence contract is authorized or introduced. A new maintenance/evolution plan is unnecessary for these bounded repairs.

Recipe `-Check` passed all eight packets before use, including phases00–06. Prior reports' stale-packet statements are historical; the current packets are usable. No screenshot/video was supplied. Evidence is current source and canonical rules. Existing working-tree changes span unrelated Fleet/Rental/Lease/Sales plus guide reader/menu, translations and shared utilities; preserve them. Equipment Rental files are initially clean.

Shapes: Equipment redirects to Fleet's existing owner; DeliveryNote operational read list/view; Quotation and Master routed type02 (backend pattern2); Invoice and TimeSheet type01 field-only editors consuming the existing generic producer slice (pattern1). The exposed invoice slice does not authorize financial expansion.

Frozen deltas: guard observables open discard decisions on subscription, recheck record/version/mode and busy state; use shared `freezeFormState` for temporary controls, preserve intentionally disabled customer controls; visible collection confirmations opt into `EditableRows.freezeParentOnConfirmation`; screen titles/record identifiers use existing shared subtitle inputs. Keep unchanged payloads, full child snapshots, approval tuples and endpoint methods. No changes to backend source or generated packets.

## Before-edit conformance evidence

| Concern | Canonical owner | Actual reference/shared owner | Target evidence and decision |
|---|---|---|---|
| Shell/filter/grid | UI1/3/4/6 | Workshop/Job list; shared FilterPanel/DataTable | Existing five lists use container-fill host, internal fill grid and applied query; retain and audit |
| Routed/editor/dialog shape | UI13/catalog01/02 | Workshop/Job editor; shared EditorDialog | Keep current route modes; do not use routed Fleet as a modal reference |
| Pending discard | UI10 | Movements Collection and Lease editors; form-state.freezeFormState | Existing Equipment guard methods open eager confirmations; repair to defer with current identity and prior-disabled-state restoration |
| Child removal | UI14 | EditableRows current optional freezeParentOnConfirmation | Quotation lineRows and Master salesOrders retain canMutate/full snapshots; adopt temporary parent freeze |
| Date/filter/output | UI17/8/21/28 | date-utils; fetchAllPages; ReportPrintSession | Retain calendar-only transport, complete applied-scope Excel/TimeSheet print; audit current source |
| User guidance | Master7/UI23/29 | UserGuide reader/model/topic/journey and existing guides | No Equipment Rental guide/reader entry/menu link exists; create bilingual module guide after final-source reconciliation |

## Execution ownership

Root owns DeliveryNote/Equipment read review, shared integration, new guide, complete scoped diff and reconciliation. Independent bounded workers may own Quotation/Master and Invoice/TimeSheet only after this gate; no shared-file edits by workers. Existing API handoff is Frozen; conflicts must be reported before implementation.

## Final reconciliation

The frozen delta above was implemented without changing the historical handoff. Complete scoped frontend diffs were reviewed, including the existing unrelated hunks in directly touched shared integration files. The new guide was read in full. Backend producer evidence remains read-only; scoped producer diffs are empty. Git roots were independently confirmed as `F:/My Work/Sigma/SiGmaAngularFrontEnd` and `F:/My Work/Sigma/SigmaBackend`.

| Concern | Final evidence | Result |
|---|---|---|
| Pending discard | Quotation/Master routed editors, Master Sales Orders, embedded PO list integration, Invoice/TimeSheet modal editors | Subscription-deferred single-use decisions; captured identity and busy rechecks; shared temporary freeze retaining prior disabled state |
| Embedded PO close ordering | Quotation list `purchaseOrderDiscardOwner` | Accepted close may hide the editor before finalize. Each subscribed decision releases only its own pending lock; result acceptance and form restoration separately require current editor/surface/ids |
| Child confirmation | Quotation `lineRows`, Master `editableRows` | Existing shared `freezeParentOnConfirmation` opt-in; no snapshot or row ownership changes |
| Obsolete requests | Quotation/Master `lookupVersion`, Master SO `requestVersion` | Stale lookup or save callbacks cannot populate a newer record or release its loading/saving state |
| Scalar forms | Invoice/TimeSheet details effects; TimeSheet print filter effect | Reuse `freezeFormState`; no blanket enable that loses intentionally disabled controls |
| Scalar transport | Eight TimeSheet integer editor/filter controls | Existing shared `int32ValueValidator`; positive reference inputs and signed time values retain their contracts; number feedback reserved in filters |
| Saved selections | TimeSheet `retainSavedOptions` | Existing `mergeSelectOptions`, with unchanged saved `#id` fallback |
| Delivery read lifecycle | Delivery list `bindDetail` | Actual detail requests balance global loading through finalize; switchMap keeps cancellation semantics |
| Dialog header | Delivery shared EditorDialog | Screen title retained; record number now in a bilingual translated subtitle |
| Guide | New typed guide + reader + owning module menu | Six bilingual topics, four journey steps, four questions; reconciled against actions, filters, validation and output source |

Actual reference closure: `src/app/modules/Workshop/Job/components/list/list.component.ts` and `.html` for list composition; `src/app/modules/Movements/collectionMovement/components/details/details.component.ts::canDeactivate` for deferred discard; `src/app/modules/Lease/LeaseClause/components/clauses/clauses.component.ts` for shared prior-state freeze adoption. Shared owners inspected directly: `shared/utils/form-state.ts`, `editable-rows.ts`, `scalar-validators.ts`, `select-options.ts`, `date-utils.ts`, `list-query.ts::fetchAllPages`, shared FilterPanel/DataTable/EditorDialog, and ReportPrintSession. References were not edited. Worker conformance details are in `DOCUMENTS_20261009_REVIEW.md` and `SCALAR_20261009_REVIEW.md` beside this file.

### Phase and decision record

| Phase / decision | Outcome and evidence |
|---|---|
| PLAN-00 | No new maintenance plan required: bounded conformance repairs retain the already frozen business/API contracts |
| Phase00 | Current source evidence; no supplied screenshots/video, so visual evidence is unavailable and no screenshot-derived requirement was invented |
| Phase01 | Read/freeze gate applied; existing endpoint, field, approval and snapshot contract retained. No backend implementation |
| Phase02 | Audited five read grids/filters/paging/output; only TimeSheet validator and print-freeze consumers changed |
| Phase03 | Applied deferred discard, form/row freeze, lookup/save lifecycle and scalar editor repairs |
| Phase04 | Audited existing approval/delete state consumers against producers; no new domain action or state transition implemented |
| Phase05 | Audited existing feature routes and root HTTP/interceptors; integrated guide through existing `UserGuide/:sectionId` and menu. No feature HTTP provider or new route shape |
| Phase06 | Complete diff/source reconciliation, bilingual parity, guide and owner acceptance recorded |
| API and payload | Quotation uses `Quotation` producer; Master uses its existing specific service; Invoice/TimeSheet retain generic endpoints. Services/models unmodified; no client-derived value added to Add/Update |
| Approvals / child snapshots | Quotation Can* flags and approval tuple remain producer-owned; Master approved records remain locked; saleOrderIds remains the complete selected snapshot, including an empty selection to clear links |
| Dates | Local calendar hydration and yyyy-MM-dd transport unchanged. Delivery inclusive date range uses DeliveryDate with DeliveryNoteDate fallback; its plateNo search also matches ChassisNo. Invoice/TimeSheet dates remain exact criteria |
| Permissions | Existing AuthGuard preserved; no authorization mechanism or permission claim invented |
| Error/success | Existing inline handling covers declared and transport failures. Standard mutation success remains interceptor-owned |
| Backend / AutoMapper | No changes. Existing projections and mappings retained within the frontend continuation |
| Calculations | No calculation changed. Selected sales order amount stays producer-owned; no HH:mm conversion, rental charge, tax, invoice posting or financial workflow added |
| Migration | No schema/entity/EF change; owner does not need Add-Migration for this change. No migration name applies |
| Documentation promotion | Reuses existing rules/shared owners. Canonical books/skill/manifest dependencies were unchanged; no new rule or packet refresh required. Initial -Check passed all eight packets |

Grid columns beside current ListVM properties (frontend camelCase corresponds to backend PascalCase; actions are a separate UI column):

| Screen | Visible data columns | Consumed ListVM properties / minimum identity-state |
|---|---|---|
| Delivery | deliveryNoteNo, masterAgreementNo, plateNo, customerName, customerCode, deliveryNoteDate, deliveryDate, returnDate, invoicingStartDate, status, branchName | Same eleven fields + id |
| Quotation | no, quotationType, date, contactName, customerCode, internalApproval, customerApproval | Same seven fields + id, canEdit, canDelete, canApproveInternally, canRejectInternally, canApproveByCustomer, canRejectByCustomer, canRevise, canUnapprove, canCreatePurchaseOrder, hasPurchaseOrders |
| Master | approvalStatus, masterAgreementNo, date, customerName, customerCode, quotationNo (quotationRefNo fallback), po, createdBy, createdAt | id, no (grid alias masterAgreementNo), date, approvalStatus, customerName, customerCode, quotationNo, quotationRefNo, po, createdBy, createdAt |
| Invoice | id, masterAgreementNo, deliveryNoteNo, equipmentDetail, startDate, invoicingRule, period | Exactly the same seven consumed fields |
| TimeSheet | id, date, dateRangeStart, dateRangeEnd, deliveryId, customerId, masterAgreementId, hoursToInvoice, breakHours, startHM, endingHM, operatorOvertimeHours | Exactly the same twelve consumed fields |

Read behavior retained: explicit applied search, server totalCount, column sort contracts, bounded shared filling grid, stable filters and complete applied-scope Excel exports. Delivery/Quotation/Master Reset restores the current month; scalar lists Reset clear criteria. Invoice has six filters. TimeSheet has three exact date filters, three positive reference filters and five signed integer advanced filters. TimeSheet Report gathers all matching rows and immediately starts print; it is not a separate report dialog. Generic backend inheritance may expose audit fields beyond these frontend consumers; producer contract minimization is not silently introduced in this frontend change.

### Changed files and preservation

17 frontend source files were changed by this continuation. Paths below are relative to the verified frontend Git root:

- `src/app/modules/Equipment Rental/DeliveryNote/components/list/list.component.ts` and `.html`.
- `src/app/modules/Equipment Rental/EquipmentQuotation/components/details/details.component.ts` and `components/list/list.component.ts`.
- `src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/details/details.component.ts` and `components/sales-orders/sales-orders.component.ts`.
- `src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/details/details.component.ts` and `.html`.
- `src/app/modules/Equipment Rental/TimeSheet/components/details/details.component.ts` and `.html`, `components/list/list.component.ts` and `.html`.
- New `src/app/modules/UserGuide/content/equipment-rental-guide.ts`.
- `src/app/modules/UserGuide/components/reader/guide-reader.component.ts`: only Equipment Rental import/registration added by this task; pre-existing Fleet/Rental/Lease additions retained.
- `src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`: only Equipment Rental guide link added by this task; pre-existing links retained.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: only `deliveryNotes.recordSubtitle` added by this task; existing unrelated vocabulary changes retained.

Equipment redirects remain unchanged under `/Equipment` → `/Fleet` with create/view/edit compatibility. No backend source, generated file, shared utility, unrelated feature, app compile root or historical artifact was edited.

### User-guide gate

Content file: `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/equipment-rental-guide.ts`. Reader registration exposes `/UserGuide/equipment-rental`; owning Equipment Rental sidebar has the existing translated `userGuide.menu` link. No dedicated route is needed because `src/app/modules/UserGuide/user-guide.routes.ts` already accepts `:sectionId` and `src/app/pages/routing.ts` lazy-loads it.

Topics: Quotation, Master Agreement, Delivery Note, TimeSheet, Invoice information, and shared Equipment register at `/Fleet`. English and Arabic explain prerequisites, available actions and approval restrictions, input rules, failed save/retry, dirty exit, full applied-scope export, immediate TimeSheet printing and its restoration. Source reconciliation specifically verified the combined plate/chassis producer filter and invoice's six criteria. The invoice topic limits guidance to the existing six-field information form. All 56 bilingual text pairs are nonempty. Reader print, topic links, accessibility, RTL and visual acceptance remain owner-pending.

### Verification and remaining acceptance

- Source syntax/local-import checks passed for 41 runtime TypeScript files; Angular template syntax parsing passed for 11 templates. This is source parsing, not application compilation or a type-check.
- Read-only translation parity for deliveryNotes/equipmentQuotation/equipmentMasterAgreement/equipmentRentalInvoice/timeSheet/userGuide: 355 English keys, 355 Arabic keys, zero missing or case-only differences. Delivery subtitle placeholders match.
- Complete scoped Git diffs reviewed, including final embedded PO token correction. `git diff --check` exit0; only normal LF-to-CRLF informational warnings. Scoped merge-marker and silent `error: () => undefined` scan had no matches.
- Actual shared exports/input declarations, guide model, feature entry routes, existing root `provideHttpClient` interceptor chain and import reachability were inspected. No broad application `include` was introduced.
- Scoped backend producer/VM Git diffs are empty; no backend modifications by this task.

Source checks do not certify compilation, interaction or appearance. Owner should compile and manually verify: dirty exit without subscription/duplicate subscription, Cancel and Confirm through footer/X/Escape/navigation, customer locked by quotation after cancelled exit, child removal cancellation, loading/retry races, approved Master restrictions, SO failed/successful saves, both embedded PO close paths leaving the list usable, Invoice/TimeSheet save/load/lookup failure recovery, Int32 fractions/endpoints, full exports above one page and a failed later page, TimeSheet complete print/cancel with paged-list restoration, guide/menu/topic links and guide printing, Arabic/English, RTL, dark theme, narrow-screen internal scrolling and keyboard focus. Existing cross-writer/concurrency and generic backend business-validation concerns from the historical review remain outside this frontend delta; no financial expansion or unsupported requirement was invented.

Suggested frontend commit: `fix(equipment-rental): align editor lifecycle and add bilingual guide`. Suggestion only; the owner should select this task's hunks in shared dirty files. No backend commit is needed.

### Agent use and execution boundary

Delegation followed the applicable AGENTS/required-skill gate after API and delta contracts were frozen. Root performed Delivery/Equipment review, integration, guide, source verification and complete reconciliation. Documents worker used `gpt-5.6-sol` for four bounded Quotation/Master component files; scalar worker used the inherited root model for six Invoice/TimeSheet files. Independent ownership avoided overlapping edits and parallelized source-heavy reviews; shared writes stayed with root to reduce integration cost. Both workers completed source-only reports and final corrections were integrated/reviewed. No extra worker or uncontrolled delegation was used.

No builds, tests, lint, browser/application automation, database commands, migrations, snapshot edits, commits, pushes, deployments, Graphify or Sigma MCP were run. Status is Implemented — source-only; owner verification remains pending.
