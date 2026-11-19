# Rental core UI handoff — 2026-10-06

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Root-approved evidence: `Rental/CORE_DISCOVERY.md`, current four features' models/services/components and related controllers/VMs. This is a presentation and adapter handoff; it preserves existing business/API contracts. The earlier quotation artifact's modal presentation is superseded by UI13 D4-2; current source already routes aggregate editors.

## Read contract

Keep each existing exact `DataTableColumn.field` order and backend ListVM set recorded beside it in CORE_DISCOVERY's Grid/ListVM table. Actions remain first. Retain existing typed filter/query members and exact backend keys from each feature's models/list and service. Adopt shared toListParams, resolveListPaging, DEFAULT_PAGE_SIZE, filter Reset, validated current-month date ranges unless an existing explicit owner exception applies, supported sortable columns whitelist, switchMap/defer request flow and apiErrorMessage with one inline/global owner.

All server responses remain Results<Row> with authoritative totalCount/pageNo/pageSize/totalPages. Full grid export uses fetchAllPages and dataTableExportRows; any failed page fails the whole export. Agreement's named detailed export has a separate confirmed column/response contract and remains separate. No new endpoint or fake complete page.

## Detail/action contract

Agreement, Booking, RentalQuotation use the same existing typed create/view/edit routed editor, full child snapshots with saved IDs and current forms/payload construction. Shared shells, SummaryCards, FieldError, numeric read badges, Quantity controls (only actual quantity inputs), date controls, dropdown translated options and existing EditableRows own presentation. Backend calculations and action flags/state checks are immutable here. Preserve uploads/print/save/dirty discard and parent refresh.

MasterAgreement's current StartDate/EndDate/CustomerId/QuotationId/Notes editor is source-supported: safe shell cleanup may preserve those fields. Historical screenshot Date/PO/PaymentTerms redesign is out of this task's requirements and remains unimplemented; it does not block current-source presentation fixes. No approval/state or write contract redesign.

Action requests retain their existing controller route/payload and real row flags. Confirmation-only actions use the shared service presets; reason/date/data input uses typed EditorDialog. Action dialog title names the screen; identifier is the muted subtitle. Mutation success stays with the interceptor. Required inline failures suppress the interceptor explicitly.

## Ownership

Core worker: four list components/styles/templates and services; RentalQuotation details/rejection/master-agreement dialogs; MasterAgreement current editor. Write worker: Agreement and Booking details and child dialogs/models, excluding lists/services owned by core. Root: shared wiring/config/translations, integration/diff review/reconciliation. Workers preserve all peer/user edits; no overlapping modifications. Backend source remains read-only. Shared capability edits require root coordination and book/skill promotion.
