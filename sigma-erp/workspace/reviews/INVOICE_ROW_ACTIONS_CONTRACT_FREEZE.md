# Invoice row actions contract — 2026-10-12

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Scope: invoice hub row actions, existing controllers/interfaces preserved. Screenshot evidence supplies menu labels/order. Owner confirmed Advance Tax Allocate, Workshop Void + Open Receipt, Rental Void. Other types retain their source-supported common actions; no guessed special workflows. Fines/Darb/Salik remain deferred.

Owner decisions: reviewer selects appropriate conservative rules (2026-10-12); subsequent explicit correction **Void only; no reversing journal**, overriding BE15 reversal recommendation for this scope. Original invoice/JV retained, JV.IsVoided flag + existing audit fields; ledger reports already exclude voided JVs. No entity schema change or migration.

## Frozen vertical slices

| Action | Type/state | Route/workflow |
|---|---|---|
| View | Known owning source | Existing owning route; sourceKind resolves CLR subtype + Workshop Module9; never invoice prefix or legacy numeric3 Equipment |
| Mark Disputed | Existing non-disputed row | Typed reason dialog -> POST Invoice/ToggleDisputeStatus {id,isDisputed:true,reason}; no financial impact |
| Journal | Linked JV exists | GET Invoice/GetVoucherDetails/id; read-only shared dialog/table |
| Allocate | TaxAdvance linked posted nonvoided JV | Existing GET GetTaxAdvanceAllocationDetails/id and POST AllocateTaxAdvance; allocations typed, positive and within source/target capacity; backend authoritative |
| Void | Rental or Workshop, linked nonvoided JV, no active allocation, open original fiscal period | New source-owned POST Invoice/Void {id,reason}; required trimmed reason, existing JV audit fields, no reversal, no delete; same shared JVallocation write serialization |
| UnApprove | Rental or Workshop, approved nonvoided JV, no active allocations, open period | New source-owned POST Invoice/UnApprove/id using existing resolver.UnpostAsync; no manual-JV endpoint bypass. TaxAdvance excluded because saved receipt reservation/settlement immutable |
| Delete | Only backend canDelete hint; TaxAdvance/sales-owned/posted/approved/voided/allocated excluded | Correct existing source owner DELETE Invoice or MiscellaneousInvoice; shared destructive confirmation, preserve applied query/page, step back if last row |
| Open Receipt for Invoice | Workshop with effective allocation to actual nonvoided saved receipt | New GET Invoice/Receipts/id read-only links; open existing Receipt owner using actual receipt id. No inferred InvoiceId payload, no new unallocated receipt |
| Print | Limo existing printable owner | Existing view route query print=true. Other printable workflows await their dedicated screen details; no placeholder menu |
| Edit | Existing working owning Edit route only | No invented create-as-update or blanket TaxAdvance editor; core/workshop editor extension separately bounded if source contract supports it |

Lean action fields: sourceKind, isDisputed, journalVoucherId, canAllocate, canVoid, canUnApprove, canDelete, hasReceipts. Existing columns remain no/invoiceType/customer/agreementNo/plateNo/invoiceDate/rate/period. Backend hints are availability only, mutation revalidates tenant, source and live state. Revalidate/refresh on stale state. No permissions invented.

## Conformance

| Concern | Book/reference | Shared owner / target |
|---|---|---|
| Menu rendering | UI7 shared ActionButton + Workshop Job list | One ActionList<InvoiceDTO>, DataTable owns first action column; visible business state, disabled transient busy only |
| Typed action dialog | UI13 Workshop Job close + shared EditorDialog declarations | translated title + record subtitle, controlled close, dirty-discard, retained values on failure |
| Destructive confirmation | UI9 ConfirmationDialogService | Delete; UnApprove warning; reason workflows use form dialog |
| Mutation/errors | UI22/28 Job close | one inflight guard, finalize loading, existing interceptor success, inline skip-error dialog errors |
| Accounting | BE5/6/8/15/18 existing resolver and JV service | source-owned action service; no general generated-JV bypass; allocation write guard; explicit owner Void-only exception |
| List fields | BE4/7 InvoiceProfiler/ListVM | typed additive action fields; no full graph loads |

Reference Job actions classified: View/Edit/Print/Delete shape supported where owning routes exist; labour time/InvoiceCustomer/Close/Cancel/QualityCheck/Logs/Estimation not applicable to an invoice aggregate. Quotation approval/rejection/revise/downstream agreement not applicable; no copied financial contracts.

Verification source-only. Recipe -Check: all eight packets current. Phases01/02/04/05/06 applicable; Phase03 only typed action inputs. No build/test/lint/browser/database/migrations/commit/push authorized. User guide /UserGuide/invoice updated at handoff. Unrelated payroll/other working-tree changes preserved.

## Rental action continuation — 2026-10-13

Status: Frozen. Owner asks to review Rental and add its actions to the Action button. Existing hub already provides the approved Rental profile; Rental View lacks the menu. Reviewer scope assumption, presented through optional clarification: retain hub actions and expose the same approved actions on saved Rental View, excluding redundant View. No action on the source-generation selection grid because candidates are not saved invoices. Lease View remains unchanged.

Detail/GetById adds only IsDisputed, JournalVoucherId, CanVoid, CanUnApprove and CanDelete alongside existing CanEdit. Map persisted dispute/JV fields normally; copy live availability from the same existing PopulateListHintsAsync used by the hub. No new endpoint, schema, permission or financial rule. Reuse existing Void/reason, Dispute/reason and Journal dialog, UnApprove warning and Delete confirmation; source-only Void retains consumption and journal, no reversal. Edit remains unavailable for saved rental-source invoices. Post-success refresh saved detail/hints; deletion returns to hub with applied query. Gate menu, print, Close and routed exit throughout dialog/confirmation/write/print; retain recoverable errors and stale identity checks. Auto-print query is consumed once per identity, not repeated on action refresh.

Menu label/order/icon and state policy share one typed invoice action factory consumed by hub and Rental View. Shared ActionButton gains optional row input default null to render its own existing template for a saved record; DataTable template/output path remains untouched, no feature-managed TemplateRef or duplicate menu markup. Same portal, theme/RTL/keyboard behavior, no local CSS. UI7/skill document this reusable capability after source reconciliation.

Direct Rental audit finding: dispute currently calls full-row Repository.Update on a tracked invoice and ignores failed SaveChangesAsync. Correct that action to tracked dispute-only changes, respect save failure and existing localized response; no financial/approval/consumption changes. Existing limousine serialization remains. UnApprove/Delete financial semantics stay as already frozen, not redesigned here.

| Concern | Owner/reference | Target conformance decision |
|---|---|---|
| Saved-record menu | UI7 shared ActionButton template/portal, existing hub ActionList | Optional row input reuses template; central invoice profile factory; unchanged DataTable default |
| Dialog | UI13 shared EditorDialog and Workshop Job close | Existing InvoiceActionDialog with title/subtitle, dirty-discard and failure retention |
| Risky confirmation | UI9/10 ConfirmationDialogService | Same approved Delete/UnApprove text, identity check and duplicate guard |
| Detail state | BE4/5/8/15 InvoiceProfiler, PopulateListHintsAsync | Minimal additive flags, same producer as hub; server still revalidates |
| Recovery/print/navigation | UI22/28/21 core editor | Reload flags after mutation, same return query, prevent action teardown and repeated auto-print |

Reference business actions Job labour/InvoiceCustomer/Close/Cancel/QualityCheck/Logs/Estimation and quotation approval/rejection/revise/downstream remain Not Applicable as above. No new creation/Allocate/receipt action for Rental. Source-only execution; owner compiler/runtime/visual checks pending. No migration. Small tightly integrated menu/detail continuation stays root-owned.

### Owner clarification — hub only (supersedes the continuation above)

Owner explicitly means the main Invoices screen: common actions plus source-specific actions. Do not add a menu to Rental View, detail DTO flags, shared row input or auto-print/navigation changes. That earlier optional scope assumption is withdrawn before source edits. Keep existing Rental View/Lease/creation untouched.

Frozen implementation: central typed action catalog owns names/icons/order; common profile defines supported shared shapes, source extras define Allocate for TaxAdvance, Void/UnApprove for Rental and Void/Receipts/UnApprove for Workshop. Preserve every existing source profile and authoritative availability hint, including lack of generic Rental-source Edit. Hub consumes a typed factory with one handler dispatcher and existing dialog/confirm/refresh lifecycle. Older responses retain View only. No dummy action or assumed allocation/receipt workflow for Rental. Backend audit correction stays limited to tracked dispute-field update, failed-save handling and existing bilingual result keys; exact endpoints and financial rules remain. Final inventory/reconciliation and in-app guide describe hub-only type composition. This small sequential catalog/action fix needs no subagents.

### Final hub-only reconciliation — 2026-10-13

Status: Implemented — source-only. Owner verification pending: yes. Only the owner's clarified main-list scope was implemented; Rental View/creation, detail DTOs and shared ActionButton were not changed by this continuation.

| Action | Rental visibility/interaction | Source owner |
|---|---|---|
| View | Known rental source, saved owning route | /Invoice/rental/details/id |
| Edit | canEdit=true; saved RentalInvoiceItem sources excluded by server | /Invoice/rental/edit/id, PUT Invoice |
| Print | Rental printable owner | Same View route with print=true |
| Mark Disputed | isDisputed=false, optional reason dialog | POST Invoice/ToggleDisputeStatus |
| Void | canVoid=true; live nonvoided journal, no allocation or sales-owned lock | Required reason, POST Invoice/Void; flag only, retains sources/JV |
| UnApprove | canUnApprove=true; approved journal plus Void eligibility | Shared warning, POST Invoice/UnApprove/id |
| Delete | canDelete=true; unposted/unapproved/nonvoided/unallocated state | Shared destructive confirmation, DELETE Invoice?id=id |
| Journal | journalVoucherId>0 | Read dialog, GET Invoice/GetVoucherDetails/id |
| Allocate / Open Receipt | Not Applicable for Rental | TaxAdvance Allocate; Workshop linked Receipts |

Frontend files: action-policy.ts and list.component.ts. The policy now separates COMMON_ACTIONS_BY_SOURCE and SOURCE_ACTIONS, with one ordered typed ACTION_CATALOG and buildInvoiceActions factory. All existing profiles/order/labels/icons remain: shared shapes only where supported; Rental extras Void/UnApprove, TaxAdvance Allocate, Workshop Void/Receipts/UnApprove. Factory rechecks profile/state and busy on execution, not only menu visibility. Main list retains one [actions] binding to shared DataTable and uses a single typed dispatcher; no menu TemplateRef/HTML/CSS duplication. All ten action kinds dispatch to their existing owning routes/services/dialogs/confirmations. Original old-response View fallback and unknown-source exclusion remain.

Backend file: InvoiceService.cs, ToggleDisputeStatusCoreAsync only in this continuation. FindByIdAsync reads a tracked tenant/live record; change the two dispute fields and save without full-row Repository.Update. Check failed save, return existing localized InvoiceActionNotFound/FailedToUpdate/SuccessedToUpdate. Existing limousine lock, endpoint/payload and nonfinancial effect retained. This reduces unrelated-field overwrite risk; it does not introduce a new concurrency/version policy. No flags/DTO/AutoMapper/DI/controller/schema/pricing/void/UnApprove/delete changes. PopulateListHintsAsync source eligibility and exact resolver allocation predicate were inspected and retained; do not substitute ledger-effective balance semantics for its existing write guard.

Guide: bilingual invoice-guide.ts main hub topic describes common actions, per-type extras, source-period edit lock and posted-delete lock. Existing INVOICE_GUIDE reader import/registration and /UserGuide/invoice are reused. No new translation keys. Invoice EN/AR parity check:215keys each, zero missing/case differences. Three changed TS sources parse without syntax diagnostics; scoped FE/BE diff --check clean (LF/CRLF notice informational). New/untracked policy/guide full source was reviewed separately; changed list dispatch and backend dispute hunk reconciled against the existing recorded invoice refactor. No runtime/compilation pass claimed. All eight recipe checks were current; no canonical/shared new capability needed, so no packet rewrite for this slice.

Phases: proportional discovery01freeze,02menu,04existing action lifecycle,05source integration/guide,06source reconciliation. No new Phase03 editor, backend financial transition or schema work. Reference Job/quotation-specific transitions remain Not Applicable as classified above; shared ActionButton/portal and EditorDialog are the reused owners. No migration for this continuation. No subagents: small tightly sequential policy/source fix. No build/tests/lint/browser/database/migrations/snapshot/commit/push/deployment.

Owner verification: reload the updated frontend/backend and inspect Rental, TaxAdvance and Workshop rows together; confirm exact extras without leakage across types; source Rental hides Edit, posted Rental hides Delete, disputed rows hide Mark Disputed, allocated/voided/closed-period writes are rejected by the server; successful actions refresh the same page/filters and last-row Delete steps back. Check old responses keep View, unknown sources remain excluded, EN/AR/menu/keyboard/theme behavior and failure/duplicate-click recovery. Closed-period availability is still revalidated on execution; this source-only slice does not add fiscal-period lookup to every list row. Suggested frontend commit: `refactor(invoice): centralize common and source-specific row actions`; suggested backend commit: `fix(invoice): persist dispute fields without full-row update`.

## Owner steering and implementation scope extension

2026-10-12: owner requires Workshop distinct invoice type and creation review from Workshop. Append InvoiceCreatingType.Workshop=4 / CoreInvoiceType.Workshop=4 without renumbering0..3. The source-owned MiscellaneousInvoice writer sets the type from Module.Workshop, including Job InvoiceCustomer/Close shared creation. Legacy Module.Workshop rows with olddefaultRental are normalized in read display and type filter, without bulk data updates or migration. Generic GenerateInvoices must reject this source-only type; it is generated from Workshop.

Core Rental/Lease Edit extends the existing routed editor with /Invoice/rental/edit/:id and /Invoice/lease/edit/:id; exact PUTInvoice editablepayload and realsavedFrom/To/StartDate, serverderivedtax/totals omitted. Print Core/TaxAdvance/Limo uses existing shared ReportPrintService with valid saved snapshot, print=true handoff. Workshop Edit/Print remain owning-editor workflows requiring typedcharges editor/print content; current legacyMisc editor was not copied as a canonical financial editor. Menu does not expose unsupported placeholders. TaxAdvance Edit/Delete/UnApprove remain disallowed by saved settlement/reservation invariant, despite generic legacy screenshot labels.

Workshop owning editor extension (2026-10-12, following explicit owner request): View/Edit/Print use /Invoice/workshop/details/:id and /Invoice/workshop/edit/:id with one typed routed financial editor, preserving persisted charges and server totals. Read existing MiscellaneousInvoice/GetByWithNavigationsId/id with additive minimal JobNo/Amount/Tax/TotalAmount/CanEdit, PUT existing MiscellaneousInvoice snapshot inputs. Module.Workshop is immutable; invoice type server-owned. Creation remains exclusively the existing Workshop InvoiceCustomer and Close Job workflows, never a hub generic generation route. This supersedes the earlier pending Workshop Edit/Print row; other Miscellaneous legacy editors remain out of scope.

Compatibility repair (owner feedback: Action button disappeared): shared ActionButton renders only when at least one ActionList.visible returns true. A still-running older API response has no sourceKind/action hints, so the initial strict profile removed all actions. Source-read fallback now preserves View using the existing known invoiceType route for such rows; new financial actions still require new backend hints. Explicit unknown sources do not become Rental. No shared ActionButton changes or fabricated state flags. Owner should restart the backend with these source changes to expose the full new contract; no build/runtime commands performed by agents.

## Source reconciliation and latest owner feedback

2026-10-12: owner requests the list title **Invoices**. Dedicated `invoice.title` is used by the list and its registered `/UserGuide/invoice` guide, with EN `Invoices` and AR `الفواتير`. Singular `invoice.invoice` remains suitable for existing detail consumers. This is a label change with no API/schema impact.

| Concern | Final source evidence | Verification |
|---|---|---|
| Action button disappearance | `invoiceSupportsAction` preserves View for absent sourceKind through `invoiceRowViewPath`; shared `ActionButtonComponent.visibleActions` remains unchanged | Source inspected; old/new server runtime replay pending |
| Menu wiring | One typed actions array passed through `[actions]` to shared DataTable; busy disables actions, type/state controls visibility | Source inspected |
| List return state | Shared read/writeListRoute carries applied filters/page to editors; VIP false retained as string, applied numberRange retained even with empty bounds | Source inspected; navigation replay pending |
| Labels/guide | Dedicated plural title EN/AR, `/UserGuide/invoice` topics describe type actions, Workshop creation, Void without reversal and older response compatibility | Source inspected |
| Syntax/whitespace | 29 invoice runtime TS files and 11 templates parsed without syntax diagnostics; scoped diff whitespace check clean | Syntax only, not compilation |

Phases02/05/06 applied to the compatibility/title repair; no new domain action or migration. Prior owning-backend/action/editor work remains as recorded above. Build/test/lint/browser/database/migration/commit/push were not run. Owner verification remains pending: restart the updated backend, reload Invoices, confirm View on an older response and per-type complete menus on the new response; verify saved Workshop creation from Invoice Customer/Close Job, cancellation without inverse entry, illegal/paid/closed-period actions, saved printing, and return filters/page. Suggested frontend commit: `fix(invoice): retain legacy row actions and pluralize list title`; suggested backend commit for the earlier slice: `feat(invoice): add source-aware actions and workshop invoice ownership`.
