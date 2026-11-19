| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Limousine masters and quotation continuation — 2026-10-09

Bounded owner: Location, TripTypes (including tariff settings), TripGridCustomization,
limousineTariff and LimoQuotation frontend folders. Continuation and existing masters,
quotation and customization frozen handoffs apply. Root owns shared files, books,
translations and module user guide. No business/API/schema changes are authorized here.
Initial recipe check was supplied by root: PLAN00 and PHASE00–06 pass.

## Pre-edit actual source conformance

| Concern | Book | Actual reference symbol/value | Shared owner | Target evidence and confirmed gap |
|---|---|---|---|---|
| List bounds/filter/grid | UI1/3/4/6/28 | Workshop/Job list `bindListQueries` uses switchMap/defer/finalize; template uses sigma-route-host/list-page/list-panel/list-table and fill grid; default paging15, cap100 | DataTable, FilterPanel, list-query/list-route-state | Location/TripTypes/GridCustomization/Quotation use those same request/bounds/paging owners; Location/TripTypes trim and pending-action read gates need reconciliation |
| Modal lifetime | UI10/13/28 | EditorDialog `visible` controlled input, closeRequested/escapeRequested outputs, contentPadded false default requiring true consumers; contentStyle shrinking flex; Job editor canDeactivate calls freezeFormState | EditorDialog and freezeFormState | All small editors use controlled composition/contentPadded=true. Location/TripTypes/settings restore by broad enable; GridCustomization copies disabled-controls traversal. Deferred confirmation needs single subscription/identity/loading gates; use shared freeze |
| Routed quotation | UI1/13/19/24 | Job editor form/body/scroll/footer shell, backend preview separation and pristine after successful save | FormSection/FieldError/SummaryCards/TaxSettings/ReportPrintSession | Quotation uses those owners; disabled tax subtree is manually restored, pending discard copies traversal. Replace with shared freeze. Saved detail stays authoritative in View |
| Tariff saved-row removal | UI10/14 | EditableRows.requestRemove distinguishes savedId/edited rows, re-resolves row object; freezeParentOnConfirmation defaults false, helper clears pending before canMutate recheck | EditableRows/freezeFormState | Tariff helper lacks freezeParentOnConfirmation=true. Save/tab/navigation gate exists; context selector must freeze too, with scope identity retained. Full snapshot and integer rates stay unchanged |
| Lookup recovery | UI16/22/28 | shared mergeSelectOptions keeps incoming order and appends saved actual ID/name; skipErrorInterceptor routes inline failures; apiErrorMessage owns safe messages | Select options/API feedback | Quotation merges saved detail names and blocks failed batches; tariff/settings keep typed reads/retry. Prevent late detail/lookup and save-finalizer restoration after destroyed/closed identity |
| Dates | UI17 | currentMonthRange returns local first/last day; toPickerDate validates saved URL calendar days before local Date hydration | date-utils/DatePickerDirective | Quotation range uses shared validator/picker but private previous-year default. No frozen date-default exception exists; adopt current month and validate both URL endpoints |
| Code readability | Master5 G10 | One statement per line; no inline if block, compressed switch or method body | Existing project TypeScript conventions | Scoped components/models/services contain compressed guards/getters/actions; expand confirmed compressed statements without changing payloads |

## Preserved contracts

Location list shortName/searchGoogleLocations/detail plus identity/actions; TripType list
name plus identity/actions; customization column/hide plus identity/actions; quotation
no/createdAt/customerName/internalApproval/customerApproval plus identity/status.
Corresponding ListVM fields retain exactly their frozen read contracts. Location writes
searchGoogleLocations/shortName/detail; TripType name; customization column/hide;
quotation existing customer/trip/location/tariff/fuel/charges/tax/notes fields. Tariff
category/customer and complete items snapshot retains optional matrix blank omission.
No pricing, permission, preference consumer, accounting, schema or workflow invention.

Phases2/3/confirmed4 apply; root integrates5 and reconciles6. Backend untouched.
Source inspection does not establish build, interaction, visual, RTL/theme or API acceptance.

## Final reconciliation

Pending implementation and scoped source diff review.

