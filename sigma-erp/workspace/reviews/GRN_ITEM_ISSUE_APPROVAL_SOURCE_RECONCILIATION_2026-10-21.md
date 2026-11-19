# GRN and Item Issue approval — source reconciliation

Date: 2026-10-21. Contract: `GRN_ITEM_ISSUE_APPROVAL_CONTRACT_FREEZE.md` (Frozen). Evidence is source-only; owner compilation, migration, database, API and browser acceptance remain pending under `AGENTS.md`.

Phases applied: discovery and source-backed contract freeze were completed before this reconciliation; implementation and source-only review cover the GRN/Issue slice. Screenshot evidence from the earlier GRN and PO references was classified as functional workflow/content evidence, not a demand to copy the legacy layout. Later ERP families remain outside this frozen slice until their effect contracts are resolved. Three controlled workstreams previously covered receipt backend, issue backend and the two approval interfaces on separate files; the root integrated them and corrected cross-feature locks, labels, guides and documentation. No new agents were started in this continuation. Delegation shortened the independent source work while preserving separate ownership; the same configured model was inherited.

| Concern | Canonical rule and reference | Target source and reconciliation |
|---|---|---|
| Dual approval surfaces | Master 4, UI 7/13; saved PO editor and list approval modal | GRN and Item Issue have a saved-editor Approvals tab and list Approval Status modal, both reading one approval endpoint and exposing the same eligible decisions. |
| GRN draft and approval | Backend 12/14; PO approval lock and decision log | GRN Save persists a pending aggregate only. Approval revalidates header, source PO lines and capacity under the tenant PurchaseRequest write lock, refuses a changed saved monetary snapshot rather than repricing it silently, records a terminal decision and creates one linked pending Issue if Issue to Job was selected. |
| Item Issue stock effect | Backend 12/15; authoritative stock report | Pending and rejected issues do not count as stock outflow. Approval rechecks source receipt, requisition capacity and current item-level stock before making the issue effective. The source-linked decision also acquires the receipt write lock to serialize it with receipt cancellation. |
| Effective stock and PO capacity | Backend 15; StockReportsService, GRN source readers | All directly related readers use approved-or-legacy-null and nonvoided movements. The time-based stock report uses approval time for new effects, original date for historical effects. No draft PO reservation. |
| Cancellation | Master 4, Backend 12/15; existing GRN Void | GRN operational cancel takes the stock-issue lock before its PO/receipt lock, requires a reason, rejects linked bill/effective issue and a negative resulting stock balance, and cancels any linked pending issue in the same transaction. This serializes its stock subtraction against issue approvals. Item Issue cancel requires a reason and blocks later linked return use. Audit logs are retained; no accounting reversal is created. |
| Pending issue deletion | Backend 14; source-linked Item Issue | A GRN-created pending issue cannot be deleted independently because the receipt promised that linked workflow; receipt cancellation cancels the pending issue. A requisition-created pending issue retains its eligible deletion path. Approved, rejected and canceled issues cannot be deleted. |
| Historical state | Frozen feature contract | Null approval remains an effective historical movement but cannot receive a new approve/reject decision. Historical correction remains guarded by its existing references and stock checks. |
| Guide and labels | Master 7; existing UserGuide reader | `purchase-documents-topics.ts` and `stock-guide.ts` explain separate approvals, effect dates, cancellation guards and legacy state. English and Arabic approval labels cover tab, modal, decisions, badges and errors. |

List grid and DTO alignment: GRN grid `Id`, `No`, `Date`, `GRNType`, `LPONo`, `BillNo`, `SupplierBillNo`, `SupplierName`, `SupplierCode`, `BranchName`, `JobName`, `ApprovalStatus`, `IsVoided`, `NetAmount` map to identically named `GoodsReceivedNoteListVM` properties. Item Issue grid `No`, `DateAndTime`, `JobName`, `ApprovalStatus` map to identically named `ItemIssueListVM` properties. Per-row actions read `CanEdit`/`CanDelete`/`CanVoid` where exposed, with the approval modal re-reading server eligibility. The Item Issue list currently does not display `IsVoided` as a dedicated column; its approval modal shows canceled state.

Migration required: owner to generate and apply `AddGrnAndItemIssueOperationalApproval` for nullable approval status, effect/cancel fields and decision-log tables. No migration or snapshot was edited in this phase. Existing historical rows must retain null status; do not backfill them to pending. Any existing Bill migrations must be applied in sequence before validating Bill endpoints. The earlier SQL 207/208 errors are consistent with a database schema lag, but only owner database inspection can confirm the exact missing object.

Unverified: C# and Angular compilation, EF translation of approval/history and balance queries, database schema, transactional races, historical tenant data, all five manual state-transition scenarios and UI rendering. No build, test, lint, database command, browser automation, commit or push was run.

Suggested commits (do not execute): backend `Implement guarded GRN and item issue operational approvals`; frontend `Show GRN and item issue approvals and update guides`.


## Bounded GRN type presentation amendment — 2026-10-24

Owner requests GRN Type styled like Purchase Order and placed above tabs.
Tier S frontend presentation; routed document editor (UI13), backend N/A.
Frozen before editing: reuse compact FormSection heading/actions and the existing
PrimeNG radio controls; move type above the tab switch/conditional body so it
remains visible on Approval too. Bind directly to the same typed grnType control
outside the submit form; do not wrap approval reason forms inside the GRN form.
Keep source/edit/view type locks; render the locked type as read text like PO.

| Concern | Canonical block | Actual reference/shared owner | Target |
|---|---|---|---|
| Compact type heading | UI13 compact heading choices; UI24/25 | FormSection actions slot; PO details type section | Same icon, compact density, flex wrapping and radio label utilities above tabs |
| Form/selection contract | UI16/27 | Existing GRN typed control and source guards; PrimeNG RadioButton | Same values/control and disabled gates; read text for locked type |
| Guide | Master7 | Existing GRN topic in purchase-documents-topics | Bilingual placement and locked-type guidance |

Recipe check passed all8; Phase03 applies only to this bounded form presentation.
No new backend/API/lifecycle decision or reusable component; no delegation for
this small coupled edit. Existing dirty purchasing/approval changes preserved.


Implemented amendment — source-only; owner verification pending: yes.
Moved the existing compact type section before EditorTabs and outside the
conditional submit form. Direct FormControl binding preserves the same typed
control, value-change logic, source guards and payload; no nested approval
forms or replacement controls. Enabled create shows the same PO radio-group
alignment/label utilities; disabled/edit/view shows the existing translated type
as read text. Busy/cleanup/lookup gates retained. Type remains visible across
Basic/Lines/Documents/Approval. Existing no-print behavior preserved.
Updated the GRN bilingual topic through the existing UserGuide reader. No shared
component or new reusable rule needed: UI13 already owns compact heading choices.
Source reconciliation inspected FormSection public API/projection, PO section,
GRN enableForm/type subscriptions/imports and final template boundaries; scoped
whitespace diff check passed. No TypeScript, CSS, backend or financial changes.
Build, specs, runtime/visual/RTL/theme acceptance were not run and remain pending.


## GRN source toolbar amendment — 2026-10-24

Owner requests PO Source above detail rows beside Add Detail. Tier S frontend
placement fix, routed document editor, backend N/A; no lifecycle/API change.
Frozen: move the existing create/unlinked source selector, Load and error/Retry
from Basic to the existing appEditableCollectionToolbarAction slot. Preserve
sourceChoice/options/fresh capacity/load gates. UI14 shared EditableCollectionTable
owns toolbar layout; actual PO details already projects source action there.
GRN owns bounded source-select width and its existing typed command. Shared
collection warning must remain in normal flex flow so it cannot cover projected
source controls. UI14/24/25/27; promote that reusable collision fix in UI14+skill.
Guide: existing GRN topic, bilingual. All8 recipe checks passed before Phase03.


Implemented source-only; owner verification pending: yes. GRN source selector,
Load and error/Retry now project beside Add through the existing shared toolbar
slot in Details, with bounded220px selector and wrapping group. Removed Basic's
repeated source card; selected sourceChoice/control/options, supplier/type
selection, dirty-replace confirmation, fresh source reader and canLoadSource
remain unchanged. Existing linked/read-only/printing branches preserved.
Shared collection validation now participates in normal flex flow instead of
absolute overlay; retains alert role/message/condition and styling. This is the
existing shared owner's collision correction for all consumers, not a local
GRN validation fork. Bilingual GRN guide updated. Source conformance reconciled
against shared template/action slot, actual PO source button and GRN handlers;
scoped diff whitespace check passed. No API/backend/form/payload changes.
UI14 rule and skill/revision updated together, all8 packets regenerated through
the generator, Phase03 UI14 provenance/reference roles reviewed and all8 final
checks passed. Build/tests/browser, responsive/RTL/theme runtime acceptance
remain owner-pending; no database/build/test/lint/commit commands executed.
