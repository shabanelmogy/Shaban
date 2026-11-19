# Equipment Rental feature review — 2026-10-07

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | Equipment, DeliveryNote, EquipmentQuotation, EquipmentMasterAgreement, EquipmentRentalInvoice, TimeSheet frontend; related integration only |
| Baseline | Clean frontend HEAD4b2d83d2; unrelated Lease follow-ups are already committed by owner |

Canonical Master0/3/4/5/7 and the applicable UI/BE shape blocks govern the implementation. The historical [frozen handoff](<../../../EQUIPMENT_RENTAL_FRONTEND_CONTRACT_FREEZE.md>) records producer evidence and initial conformance decisions. Generated packets remain stale except Phase01 after a repeated read-only recipe check; use the canonical books. Regeneration and semantic review are owner-pending. No screenshot was supplied; all decisions use current source evidence. No application verification or backend implementation is claimed.

## Implemented findings and shape decisions

| Feature | Governing shape and resulting behavior |
|---|---|
| Equipment | Existing Sales/Fleet routed aggregate owns the same Equipment API, Documents/Warranties and sale/reference locks. Legacy Equipment name/SKU/category/loyalty scaffolding is retired, with empty/create/details/view/edit compatibility redirects to Fleet. Twelve obsolete component/template/style/spec/model/service files and their LayoutModule registrations are removed. Fleet source is unchanged. |
| DeliveryNote | Operational read grid and saved detail viewer. Shared shell, filters, paging, current-month range/Reset, applied-query refresh and complete Excel replace local page/table/date/export code. Actual GET/{id} powers a controlled read-only dialog with error/retry and identity checks. The empty Edit callback is removed; no delivery/return mutation workflow was invented. |
| EquipmentQuotation | Routed type02 aggregate, backend pattern2 without a journal contract. Shared filters/grid/status/action states, complete Excel, routed Create/View/Edit with supported description/periodMonths, typed full-child snapshots, shared editable rows, validation and dirty-route protection. Empty details and fractional integer inputs are rejected before transport. Edit deep links honor loaded approval state. Existing PO association/search/edit integration remains; the embedded editor's public dirty/saving state now protects Cancel/X/Escape/navigation/reload at its list owner. |
| EquipmentMasterAgreement | Routed type02 aggregate. Edit loads GET/{id} and sends PUT with id instead of POST. Saved customer/quotation/date/PO/notes values and approved locks are retained. Customer resolution uses identity-guarded switchMap and locks the selected quotation's customer. The approved-only sales-order dialog manages existing association IDs via a full snapshot, preserves allowed empty selection, blocks duplicates/invalid IDs, confirms saved-row removal/discard and protects route exit/reload. |
| EquipmentRentalInvoice | Exposed six-field API is a type01 field-only modal. Unsupported product/loyalty fields are replaced by actual API columns, typed Create/View/Edit and CRUD/read/export/confirmation/error behavior. Entity InvoiceBase inheritance is not evidence of a complete accounting UI. Legacy details/:id stays View; explicit view/edit and create deep links enter the list-owned modal. |
| TimeSheet | Type01 modal uses all eleven API inputs, actual ID selects, signed-int32 fields and independent exact-date filters. Unsupported shift/rates/document/file/lookup-name fields and ignored criteria are removed. Shared complete Excel and ReportPrintSession print the supported grid contract over all matching pages, preserving normal paging/filter state. Legacy details/:id stays Edit. No unverified hour interpretation or billing calculation was added. |

Lists use the applied filter snapshot for paging, editor return and output. Typed manual calendar values are validated before date-only transport; restored values use shared toPickerDate. Read failures handle both HTTP errors and isSuccess=false with a visible retry path. Requests explicitly skip global error feedback where inline feedback owns it; normal mutation success stays interceptor-owned.

## Grid/ListVM reconciliation

The columns and frontend read properties are shown side by side. Backend response breadth is unchanged in this frontend scope.

| Grid | Visible columns | Frontend ListVM fields |
|---|---|---|
| Equipment | Existing Fleet owner | No second local ListVM; existing Fleet contract reused |
| DeliveryNote | deliveryNoteNo, masterAgreementNo, plateNo, customerName, customerCode, deliveryNoteDate, deliveryDate, returnDate, invoicingStartDate, status, branchName | Same eleven fields plus id. type/poNo/ownership/operatorProvidedBy/chassisNo belong to the detail contract only. |
| Quotation | no, quotationType, date, contactName, customerCode, internalApproval, customerApproval | Same seven fields plus id, canEdit/canDelete/canApproveInternally/canRejectInternally/canApproveByCustomer/canRejectByCustomer/canRevise/canUnapprove/canCreatePurchaseOrder/hasPurchaseOrders for actual actions |
| Master Agreement | approvalStatus, masterAgreementNo, date, customerName, customerCode, quotationNo, po, createdBy, createdAt | id, no, date, approvalStatus, customerName, customerCode, quotationNo, quotationRefNo fallback, po, createdBy, createdAt; grid masterAgreementNo adapts no/id |
| Invoice | id, masterAgreementNo, deliveryNoteNo, equipmentDetail, startDate, invoicingRule, period | Exactly those seven fields |
| TimeSheet | id, date, dateRangeStart, dateRangeEnd, deliveryId, customerId, masterAgreementId, hoursToInvoice, breakHours, startHM, endingHM, operatorOvertimeHours | Exactly those twelve fields |

DeliveryNote/Quotation/Master range defaults use currentMonthRange and the custom inclusive range API. Invoice/TimeSheet generic date filters are equality criteria with explicit labels and no fabricated inclusive range. Actual page/count/size and sortable producer names are reconciled. Export page size is200 for the custom producers and100 for the generic producers; shared fetchAllPages aborts on any failed page.

## Final conformance evidence

| Concern | Owning book / actual reference or shared owner | Final source result |
|---|---|---|
| Shape/folders/routing | Master3/5, UI1; Workshop/Job routed editor, Fleet/Vehicle dialog editor | Shape selected before implementation; modal lists own their editor state and compatibility URLs; guard calls delegate to actual editor state |
| Bounded shell/title | UI1/3; src/styles.scss sigma-route-host/list/editor page and panel, FeatureTitle | Shared geometry and title owner; no page-height workaround or local palette/table/filter CSS |
| Filter geometry | UI4; Workshop/Job list, FilterPanel/directives | stableLayout=true on all five lists, mandatory Reset, six primary controls maximum, shared reserved date feedback and advanced controls where needed |
| Grid/action/value presentation | UI5/6/7/14; DataTable/EditableCollectionTable | Typed columns/actions, server action availability, fixed lookup column widths, shared date/status/money formatting and numeric read highlighting |
| Editor height/scroll | UI1/13/14; Job editor and FormSection/EditorDialog public fill contracts | Quotation has two bounded shared panes, header form scroll and item table scroll. Sales-order dialog has a bounded shared pane. One-pane editors use sigma-editor-scroll; headers/footers remain outside scroll owners. Visual acceptance pending. |
| Dates/validation/focus | UI17/19/27; DatePicker/date-utils/FieldError/focusField/QuantityInput | Shared mask/transport/hydration, form and row errors, positive reference IDs, exact backend integer ranges, first-invalid/Add focus, preserved API null/number contracts |
| Confirmations/dirty protection | UI9/10/14; ConfirmationDialogService/EditableRows | Pending confirmation gates before mutation, current-row availability recheck, save/close snapshot locks, list/routed CanDeactivate bridges and reload warnings |
| Request lifecycle/feedback | UI2/22/28; switchMap/defer/finalize/takeUntilDestroyed, apiErrorMessage/composedReadErrorMessage | Balanced loaders, identity guards/cancellation, partial successful lookups retained on retry, both failure channels, explicit inline ownership |
| Complete output | UI8/21; fetchAllPages/dataTableExportRows/onExportToExcel/ReportPrintSession | Full applied-query output, shared money/date/status labels, failed intermediate page abort, print lifecycle restoration |
| Translation/public declarations | UI1/23; exact exports, standalone imports, @Input declarations, EN/AR dictionaries | Final36 runtime files/11 templates: zero syntax/import/member/registration/public-input/translation findings. Dynamic approval/action keys inspected beside owning dictionaries. |

Root final review also restored customerId to the Master filter interface (the form and producer already used it), fixed Master returned pageSize handling, joined list action/confirmation/dialog busy gates, trimmed unused read-only DTO fields, removed an unused local date serializer, and added modal reload protection. These are conformance repairs; API endpoints/business transitions are unchanged.

## Shared extraction and documentation

UI17, the required sigma-screen-refactor skill (§3.3 plus revision row), UI preamble and CHANGELOG1.90 now document saved calendar-date hydration through shared date-utils.toPickerDate. Its implementation is the existing partnerPickerDate algorithm extracted unchanged; that compatibility wrapper delegates to it. Date-time contracts and manual parsing remain separate. The exact reference algorithm and owning shared declarations were compared before promotion.

PurchaseOrderService.searchByEquipmentQuotationId accepts optional skipErrorInterceptor with default false, retaining the same POST read endpoint/payload for all existing callers; the inline PO viewer opts in. Other reusable screen mechanics already have shared owners, so no new feature-local framework was introduced. Preexisting documentation changes, generated packet changes and unrelated source were preserved.

## Backend findings retained for owner follow-up

Backend repository remains unchanged. These are source findings, not demonstrated runtime failures or completed backend repairs:

1. QuotationService.cs:97 stamps a new detail from entity.SubscriptionId during Update, instead of the canonical current server tenant owner (BE18). Review the complete stamping boundary before changing it.
2. QuotationService.cs:205/227 exposes CanUnapprove and the approval reversal without a linked-purchase-order dependency check, despite projecting HasPurchaseOrders. Define and implement the dependency invariant at the backend; the frontend consumes current server availability rather than inventing a new rule.
3. EquipmentMasterAgreementService.cs:312 approves via Repository.Update(entity), requiring field-only/concurrency review against BE5/12/18.
4. EquipmentMasterAgreementService.cs:387 UpdateSaleOrdersAsync checks eligibility then saves the association without a demonstrated common concurrency boundary for competing link writers. Owner runtime race verification and a producer-scoped fix are pending.
5. Generic Quotation/GetSelect includes choices which Master Add/Update may reject for approval or uniqueness. Delivery/Master generic select labels can be blank when Name/No differs from the document number property. The frontend preserves actual IDs/historical data and displays #id where needed; eligible producer labels need a separate backend change.
6. TimeSheet generic writes do not establish server FK ownership/date-order/hour rules. No client-only restriction is described as backend protection. Invoice's generic CRUD does not establish lines/totals/journals/posting/reversal/delete accounting rules. Full financial workflow remains a separate business/backend review.
7. The existing embedded PurchaseOrder editor is not fully refactored here. Its public dirty/saving states protect this integration's exit, but legacy row/file dirty marking and the whole PO workflow require its own review. No claim of PO-wide conformance is made.

No entity/EF/mapping/backend change, new permission, domain calculation or migration was introduced. AutoMapper remains producer-owned. No Add-Migration command is required for this task.

## Phases, verification and owner acceptance

Discovery and contract freeze, frontend reads/grids/output, detail/write, existing domain-action presentation, routing/integration and final source reconciliation apply. Backend implementation, screenshot extraction, accounting expansion, schema changes and deployment were skipped because they are outside this frozen frontend scope. No new Missing/Conflicting business decision was invented; the bounded backend findings above remain deferred.

TypeScript syntax and Angular17.3.12 template parses, exact local named exports, standalone metadata/public inputs, declared class members, translation presence/parity and explicit application-file existence pass. A separate AST unused-import scan found no unused named imports. Scoped source contains no ms-lib/any/UTC serializer/flatMap/fromEntries/MessageService/silent-error remnants or merge markers. Scoped whitespace checks pass. These checks are source inspection, not application type checking, a build or tests.

The complete scoped frontend changes were reconciled with the frozen contracts and worker diffs, then root follow-up edits were inspected. Documentation changes were inspected separately in the documentation repository; unrelated preexisting changes remain. Backend Git status is clean. Local reports remain outside application Git repositories.

Owner verification pending: compile the application; open all five lists and Equipment→Fleet compatibility links; exercise Create/View/Edit/legacy details URLs, including changing an id on the same route; confirm Master Edit uses PUT; check approved/unapproved action tuples and failure/retry; edit/remove the last Quotation item and enter fractional integer values; confirm saved dates/current-month/Reset and draft-versus-applied queries; test partial lookup failure/retry; protect dirty X/Cancel/Escape/navigation/reload and saving snapshots; manage duplicate/empty sales-order snapshots; export/print more than one page and fail an intermediate page; confirm print cancellation restores state and success notification occurs once; verify keyboard/RTL/light/dark/narrow layouts and internal-only scrolling. Regenerate stale recipes and semantically review them separately.

Agent utilization: discovery children supplied read-only API evidence; two bounded implementation streams owned Quotation/Master and Invoice/TimeSheet after freeze, reducing wall-clock time across independent files. The mapped gpt-5.6-sol document worker stopped at its usage limit before final reconciliation; root inspected and finished its output, and also addressed audit findings. Invoice/TimeSheet inherited-model worker completed its report. A bounded read-only final audit also reached its usage limit; root performed final integration rather than accepting its status as completion. No overlapping agent ownership; no new agents were started during this continuation.

No builds, tests, lint, browser/application/database commands, migration/snapshot edits, commits, pushes or deployment were run. Generated packets were not edited by this task.

Suggested frontend commit: `refactor(equipment-rental): align screens with shared patterns and API contracts`. Documentation suggestion: `docs(ui): standardize saved calendar-date hydration`. Suggestions only; no commits were made.

Detailed slice records: [Equipment/Delivery and shared integration](<EquipmentRental/ROOT_20261006_REVIEW.md>), [Quotation/Master final reconciliation](<EquipmentRental/DOCUMENTS_20261007_REVIEW.md>), [Invoice/TimeSheet](<EquipmentRental/INVOICE_TIMESHEET_20261006_REVIEW.md>). Changed-file inventory follows.

## Changed files

Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd. M = modified; D = retired duplicate/style/scaffold file.

```text
M	src/app/_metronic/layout/layout.module.ts
M	src/app/modules/Equipment Rental/DeliveryNote/components/list/list.component.html
D	src/app/modules/Equipment Rental/DeliveryNote/components/list/list.component.scss
M	src/app/modules/Equipment Rental/DeliveryNote/components/list/list.component.ts
M	src/app/modules/Equipment Rental/DeliveryNote/models/list.ts
M	src/app/modules/Equipment Rental/DeliveryNote/services/deliverynote.service.ts
D	src/app/modules/Equipment Rental/Equipment/components/details/details.component.html
D	src/app/modules/Equipment Rental/Equipment/components/details/details.component.scss
D	src/app/modules/Equipment Rental/Equipment/components/details/details.component.spec.ts
D	src/app/modules/Equipment Rental/Equipment/components/details/details.component.ts
D	src/app/modules/Equipment Rental/Equipment/components/list/list.component.html
D	src/app/modules/Equipment Rental/Equipment/components/list/list.component.scss
D	src/app/modules/Equipment Rental/Equipment/components/list/list.component.spec.ts
D	src/app/modules/Equipment Rental/Equipment/components/list/list.component.ts
M	src/app/modules/Equipment Rental/Equipment/equipment.routes.ts
D	src/app/modules/Equipment Rental/Equipment/models/create.ts
D	src/app/modules/Equipment Rental/Equipment/models/details.ts
D	src/app/modules/Equipment Rental/Equipment/models/list.ts
D	src/app/modules/Equipment Rental/Equipment/services/equipment.service.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/details/details.component.html
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/details/details.component.scss
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/details/details.component.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/list/list.component.html
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/list/list.component.scss
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/list/list.component.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/sales-orders/sales-orders.component.html
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/sales-orders/sales-orders.component.scss
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/components/sales-orders/sales-orders.component.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/equipmentmasteragreement.routes.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/models/create.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/models/list.ts
M	src/app/modules/Equipment Rental/EquipmentMasterAgreement/services/equipmentmasteragreement.service.ts
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/details/details.component.html
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/details/details.component.scss
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/details/details.component.ts
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/list/list.component.html
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/list/list.component.scss
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/list/list.component.ts
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/purchase-orders/purchase-orders.component.html
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/purchase-orders/purchase-orders.component.scss
M	src/app/modules/Equipment Rental/EquipmentQuotation/components/purchase-orders/purchase-orders.component.ts
M	src/app/modules/Equipment Rental/EquipmentQuotation/equipmentrental.routes.ts
M	src/app/modules/Equipment Rental/EquipmentQuotation/models/details.ts
M	src/app/modules/Equipment Rental/EquipmentQuotation/services/equipmentrental.service.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/details/details.component.html
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/details/details.component.scss
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/details/details.component.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/list/list.component.html
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/list/list.component.scss
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/components/list/list.component.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/equipmentrentalinvoice.routes.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/models/create.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/models/details.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/models/list.ts
M	src/app/modules/Equipment Rental/EquipmentRentalInvoice/services/equipmentrentalinvoice.service.ts
M	src/app/modules/Equipment Rental/TimeSheet/components/details/details.component.html
M	src/app/modules/Equipment Rental/TimeSheet/components/details/details.component.scss
M	src/app/modules/Equipment Rental/TimeSheet/components/details/details.component.ts
M	src/app/modules/Equipment Rental/TimeSheet/components/list/list.component.html
M	src/app/modules/Equipment Rental/TimeSheet/components/list/list.component.scss
M	src/app/modules/Equipment Rental/TimeSheet/components/list/list.component.ts
M	src/app/modules/Equipment Rental/TimeSheet/models/create.ts
M	src/app/modules/Equipment Rental/TimeSheet/models/details.ts
M	src/app/modules/Equipment Rental/TimeSheet/models/list.ts
M	src/app/modules/Equipment Rental/TimeSheet/services/timesheet.service.ts
M	src/app/modules/Equipment Rental/TimeSheet/timesheet.routes.ts
M	src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/services/purchaseorder.service.ts
M	src/app/modules/i18n/vocabs/ar.ts
M	src/app/modules/i18n/vocabs/en.ts
M	src/app/modules/shared/utils/date-utils.ts
M	src/app/modules/shared/utils/partner-editor-forms.ts
```

Documentation/instruction changes made by this task: sigma-erp/ui/17-dates.md; sigma-erp/ui/00-preamble.md; sigma-erp/CHANGELOG.md in F:/My Work/Shaban Documents/Shaban, plus F:/My Work/Sigma/.agents/skills/sigma-screen-refactor/SKILL.md. Other dirty documentation files predate this task.

Final integration parse: all six directly related LayoutModule/shared-date/partner-wrapper/PO-service/EN/AR source files have zero TypeScript syntax diagnostics. Final frontend scoped diff contains71 changed files (3654 additions,8151 removals); this includes retirement of the obsolete Equipment scaffolding. Backend remains clean and all scoped diff whitespace checks pass. Temporary inspection helpers were removed after recording their results.
