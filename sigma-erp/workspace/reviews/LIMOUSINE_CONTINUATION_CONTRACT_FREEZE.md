| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Limousine continuation — 2026-10-09

Owner authorizes review and confirmed implementation across Limousine. This
continuation reuses the source-supported frozen masters, quotation, trip,
partial-invoice, grid-customization and report handoffs under reviews. Their
later owner-approved amendments prevail over historical blocked/single-invoice
decisions. Current TripBooking writes omit Invoiced; generation still sends
invoiceDate/items[{tripBookingId,totalAmount}] to LimousineInvoice/Generate.
No new deposit/advance settlement, driver tracking source, grid-preference
consumer, pricing, accounting or permission contract is inferred.

Initial recipe -Check passes PLAN00 and PHASE00–06. Limousine source is clean
against HEAD; UserGuide reader/other module guides and tsconfig have earlier
changes which must be preserved. References are UI catalogue01 normal modal
lists,02 routed quotation/trip,05/06 complete tariff/invoice generation
workspace,07 complete reports and08 financial invoice view. DriversTracker
remains the documented map exception. Backend contracts are unchanged unless a
confirmed source mismatch is independently evidenced and frozen before repair.

Mandatory implementation precondition: each bounded owner reads relevant
canonical blocks, skill and actual shape reference, and records symbol/value
conformance in its review fragment before source edits. Use existing shared
freezeFormState/EditableRows/validators/query/date/feedback owners; root owns
any missing shared capability and book/skill/changelog/packet maintenance.

| Workstream | Owned source | Contract / references |
|---|---|---|
| Masters/configuration/quotation | Location, TripTypes, TripGridCustomization, limousineTariff, LimoQuotation frontend folders | Existing freeze tables; Job list/editor, EditorDialog/EditorTabs, UI10/14/19/28; source field validation and API shapes retained |
| Reports/map | UtilizationReport, ChauffeurForcedAllocationsReport, limousineTariffReport, DriversTracker frontend folders | Existing report/map exceptions; ReportPage/DataTable/SummaryCards/ReportPrintSession, UI20/21; complete server datasets and formulas retained |
| Trips/invoices/integration | TripBooking, LimousineInvoice frontend folders; new Limousine guide and directly related registration/menu/translations | Existing approved partial invoice contracts; Job routed shell/OpeningBalances collection; API/states/cap and server tax preserved |
| Backend source audit | Read-only named Limousine services/controllers/VMs/maps and partial invoice policy/writer | Compare current producers with existing frozen handoffs; no edits by audit owner |

Root reconciles fragments, full scoped diffs, contract compatibility, guide,
local syntax/public declaration evidence and recipe check. Parallel workstreams
have disjoint feature folders; shared/translation/guide files remain root-only.
No builds/tests/lint/browser/app/DB/migrations/snapshots/commits/push/deployment,
Graphify or Sigma MCP. Runtime/visual/accounting acceptance stays pending.

## Required-tax read amendment before implementation

Verified shared TaxSettingsService.load currently accepts declared failure and
catches transport failure as cached/default settings. Quotation and Trip editor
forkJoin therefore cannot distinguish a failed required read; Trip list also
subscribes outside its readiness batch. UI2/19/22 require failed required reads
to block dependent Save/Finish and offer Retry. Add an optional requireSuccess
load mode with inline errors and a separate successful-read cache; preserve
legacy no-argument fallback and default tax normalization. Adopt it in all three
Limousine callers, with composedReadErrorMessage for thrown declared failures.
No rate, preview formula, backend tax policy, API endpoint or payload changes.

Root conformance before edits: Workshop Job editor/list actual shared
sigma-editor-page/form/body/scroll/footer and stable FilterPanel; EditorDialog
public focusOnShow/height/close/primary inputs; EditableRows.freezeParentOnConfirmation
and freezeFormState actual no-event/idempotent disabled-subtree restoration;
UI10 deferred identity/busy lifetime gates; UI18 tracked cleanup preserves
successful Save and keeps failed cleanup open. Trip/invoice custom capture
functions and workflow blanket re-enable violate the current shared owner;
replace them with the existing helper and matching identity/cleanup gates.
Existing screenshot evidence is none for this continuation. Root preserves
fields, stored values, complete payloads, server financial ownership and routes.

Multi-form freeze extension (before edit): Tariff's rows and customer/category
context live in separate forms; invoice generation also has separate draft and
filter forms. Reuse one plural freezeFormStates wrapper over freezeFormState,
deduplicating selected roots/descendants. Optional EditableRows.confirmationForms
adds contextual forms only when freezeParentOnConfirmation is selected; default
consumers stay unchanged. This freezes the submitted context without reparenting
controls or making context changes dirty row data. Tariff adopts it, invoice and
trip workflow decisions adopt the plural helper. UI10/14 and skill/history own
this reusable capability; root performs generator/semantic maintenance.
