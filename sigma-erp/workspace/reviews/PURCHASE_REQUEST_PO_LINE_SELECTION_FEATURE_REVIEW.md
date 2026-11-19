# Purchase Request to PO explicit line selection

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner requests aligned Search/input in Choose a Purchase Request and explicit
line selection after clicking a request, matching GRN's shared picker behavior.
Tier M bounded conversion UI; existing typed command and backend contracts stay.
Existing conversion uses one source PR (supplier scoped when entered from PO),
GET PurchaseRequest list/draft, POST PurchaseRequest/{id}/purchase-orders.
No multi-request combination authorized or new backend shape needed here.

Frozen before editing: paged source list uses existing shared FilterPanel inline
actions with caption alignment; keep named request-No search/server paging and
supplier/available filter. Source row activation opens SourceDocumentPicker
for that one request. Only explicit checked line/quantity Apply advances to the
existing date/branch/totals/create form; Cancel returns to the source list (or
closes direct PR entry) without creating a PO or altering parent draft. Allow
review form to reopen selection, preserve earlier quantities/date/branch; source
refresh must not reset unselected rows to their full remaining quantity.
Discount all-consumed calculation examines ALL source lines, not only selected
ones. Server remains authoritative for discount, price, supplier and capacity.

| Concern | Book | Actual shared/reference owner | Target |
|---|---|---|---|
| Filter row | UI4/24/25 | FilterPanel public inlineActions/inlineActionCaption; Job list | Label/control and Search/Reset share shared alignment |
| Selection dialog | UI13/14/16/27 | SourceDocumentPicker, EditorDialog, DataTable, QuantityInput | Reuse same picker; customize semantic headings for requested/already ordered; one shell at a time |
| Conversion form | BE14; UI13/14/19 | Existing PR create-purchase-order typed command | Preserve date/branch, positive selected IDs only, full-source discount allocation and stale-capacity errors |
| Guide | Master7/UI23 | purchase-requests-topic + purchase-documents-topics | Bilingual selection and continuation steps |

Initial recipe Check passed all8. Applicable phases00/01(no API change)/02/03/05/06.
No delegation: source list/selection/review state is one small coupled flow.
Preserve all prior dirty changes. Source-only verification, no builds/tests/
runtime/browser/database/migrations/commits. Frozen archive PR picker record is
historical; this record supersedes its automatic full-source quantity default.


## Owner compact selection amendment — 2026-10-24

Owner now requests Select Request Lines to contain only the table and quantity
to include. Supersedes the generic split presentation for this PR stage: reuse
shared SourceDocumentPicker layout=table with checkboxes, line, unit, remaining,
and inline quantity column. Hide document navigator, duplicate selected cards,
extra descriptions/prices/context sections. Keep one source request here;
Review/Create form and GRN multi-source split mode remain their existing shapes.
Shared inline rows must retain identity across quantity keystrokes so input
focus is not lost. Retain stale missing selections as unavailable rows to allow
explicit deselection; never silently erase or clamp quantities. Same backend.


## Owner return-and-save amendments — 2026-10-24

Owner clarified that the blocked return belongs to PR selection from Create PO,
then required saving only after rows populate the main PO screen. These later
instructions supersede this record's earlier no-API-change / embedded conversion
handoff for that entry. See the separately frozen
[PURCHASE_REQUEST_PO_MAIN_EDITOR_CONTRACT_FREEZE.md](PURCHASE_REQUEST_PO_MAIN_EDITOR_CONTRACT_FREEZE.md).
Direct PR row/View conversion retains its populated review-and-final-Create flow;
no line picker persists. Source combination remains one PR per PO.

## Final source reconciliation

| Concern | Final source evidence | Result |
|---|---|---|
| Read/filter | PR chooser form[appFilterPanel], FilterActionsDirective, inlineActionCaption, appliedSourceNo + reset + existing paging filters | Search/Reset share canonical alignment; supplier/eligibility remain server-filtered |
| Compact choice | Shared SourceDocumentPicker layout=table; DataTable custom quantity cell + QuantityInput; one EditorDialog mounted | Checkbox, line/unit/available/quantity only; no duplicate navigator/cards/prices |
| Input identity/stale reads | Stable inlineLines array on keystrokes, ID-resolved quantities; missing selected rows retained unavailable; switchMap + DestroyRef | No silent clamp/erase or recreated quantity inputs |
| Return/cancel | Shared backLabelKey/backRequested + requestLeave fingerprint comparison and optional review-draft guard | Back returns eligible supplier-scoped requests; Cancel leaves main draft intact; neither emits Apply |
| Main editor | PO selectedRequest signal, selectionOnly chooser + linesSelected -> stageRequestSelection | Local rows only, activate Details; date/branch/quotation/notes/files retained; protected source fields |
| Save | Main PO save chooses existing PR conversion POST with source IDs/quantities/header | Only main Save persists this entry; no manual-create fallthrough or picker navigation to an already saved record |
| Backend | Draft line VM source IDs; optional Header VM, nested validation; bounded PurchaseOrderService draft/conversion methods | Source lock, fresh capacity/approval, supplier/type/currency/price/tax/discount logic preserved; no schema change |
| Discount | Feature-owned purchaseRequestOrderDiscount utility reused by both entry adapters | All-source consumption and allocated discount balance, not selected-subset full discount; server authoritative |
| Lookup/cache | Existing PO root cache bindings preserved; selection-only PR path does not bootstrap branches | Reference sources remain cached; source capacity GET stays fresh and finite |
| Route/provider/lifetime | Existing routes/root services; no new provider/client; conditional picker mount | Obsolete/destroyed reads cancelled; no new route or persistence effect on Apply |
| Labels/theme/RTL/focus | Existing FilterPanel/EditorDialog/DataTable/QuantityInput owners, logical picker sizing, bilingual headings/messages | Source conformance only; visual/keyboard/mobile/theme acceptance pending |
| Guide | UserGuide/content/purchase-documents-topics.ts and purchase-requests-topic.ts | Bilingual PR choice, compact quantities, return, staged main rows/final Save and direct PR review explained |

Guide remains in the existing reader at /UserGuide/vouchers-purchasing,
registered through invoice-guide.ts (vouchers-purchasing group) and the Purchasing
and Suppliers sidebar User Guide link. Topics continue linking /PurchaseOrder
and /PurchaseRequest; no new guide route/menu is needed.

Tests added as source (NOT executed): shared inline identity, missing-source
retention/deselection, guarded Back and unchanged GRN multi-source selection;
PR subset discount/fresh max/cancel/source-list return/selection-only no POST;
main PO local staging/header/file retention/final-save command/declined replacement.
New runtime utility is included in the existing explicit tsconfig.app.json files
list; no test is added to the application compile.

Scoped frontend/backend diff and new-file whitespace/merge-marker review passed.
Bounded backend worker completed its owned implementation and independent
read-only integration audit. Its proposed Back warning was reconciled against
the shared requestLeave selection fingerprint (already guarded), with a source
regression case; no unresolved confirmed finding remains.

UI13 and execution skill both now document compact table, stable row identity,
explicit Back and editor-owned staging. Regenerated all eight derivative packets
(plan00/phases00–06) via generator; semantically checked UI13 provenance and
preserved approved shape/reference roles, then final -Check passed all eight.
No generated file was edited directly. Existing unrelated dirty work was kept.

Owner verification remains pending: frontend/backend build, test execution,
actual request selection/return/cancel, input focus, mobile/RTL/themes, selected
subset discount, attachments, failed/concurrent capacity save, and Save/Print.
No build/test/lint/runtime/browser/database/migration/commit command was run.
No Add-Migration is needed: only DTO/read projection and UI flow were changed.

Suggested commits (suggestions only, isolate this task from earlier dirty work):
- Frontend: `fix(purchase-orders): stage request lines before final save`
- Backend: `feat(purchase-orders): accept editor header on request conversion`
- Documentation: `docs(ui-book): document compact source selection and staging`


## Latest authoritative amendment: multi-request composition and plain editor — 2026-10-24

Owner answered “جمع بنود أكثر من طلب للمورد نفسه”. This supersedes all earlier
single-request restrictions and the earlier no-schema/no-migration statements
in this historical review. The current Frozen handoff is
[PURCHASE_REQUEST_PO_MULTI_SOURCE_CONTRACT_FREEZE.md](PURCHASE_REQUEST_PO_MULTI_SOURCE_CONTRACT_FREEZE.md).
The owner subsequently requested removal of the red source-protection and
approval/billing/reservation banners from the PO editor. Both quoted informational
banners were removed; actual errors remain errors. Source request numbers are
available per line, including saved print; approval retains its existing tab.

### Final amended reconciliation

| Concern | Final source | Outcome |
|---|---|---|
| Return keeps work | SourceDocumentPicker retainOnBack / cloned backRequested payload; discardBaseline across remounts | Back retains picks and quantities; Cancel compares the whole session with its original baseline and never mutates main rows |
| Multiple eligible PRs | PR chooser selectionSnapshot, availableForPurchaseOrder + supplier/type/sourceCurrencyId filters and fresh draft compatibility guard | Add several compatible requests, restore prior per-request picks, show selected counts; Insert all from table or source list |
| Compact picker | Same layout=table and stable inline quantity cells; failed retained source yields unavailable deselectable rows | No duplicate cards/context; invalid/stale quantities are retained, blocked and correctable rather than silently clamped |
| Main rows | selectedRequests + selectedRequestLines, stageRequestSelection, source number column | Insert only stages local main Details; retains header/files; source identity/price/tax protected; main quantities editable |
| Persisted API | POST PurchaseOrder/from-requests with PurchaseOrderFromRequestsCreateVM, createFromRequests client | Main Save sends only supplier/date/branch, source IDs/quantities and editable header/files; no client discount share input |
| Write authority | PurchaseOrderService create/legacy-single/update/approval, existing PurchaseRequest unique-write boundary | Same approved sources, tenant/supplier/type/effective active currency, references and fresh capacity; existing lifecycle reservation/release retained |
| Discount history | Nullable PurchaseOrderDetail.PurchaseRequestAllocatedDiscount precision18,2; explicit input-map ignore | Exact share per request stored on its lines, deterministic rounding residual; header sum; disjoint single-header legacy fallback; no heuristic split of multi-source totals |
| Editing/history | Owned source FK retained; no appended source/manual rows on ordinary Update; summary derived from retained lines | Pending descriptions retain pre-existing edit capability; source identities/prices stay protected; removing a whole request updates header summary |
| PR readers/guards | PurchaseRequestService usage/grid/remaining/detail/approval/edit/delete reference membership | All sources count through actual line provenance even when combined order header is null; rejected/deleted orders release use under prior policy |
| Shared guidance | UI13, BE14 + skill/revision rows, generated all8 packets | Compact retained Back, original session baseline, local Insert/final Save and per-source attribution documented together |
| User guide | Existing bilingual PO/PR topics at /UserGuide/vouchers-purchasing | Multiple requests, counts, retained quantities, one final Save, each source discount/consumption and source labels described |

Scoped final source audit corrected saved-description overrestriction introduced
by the core worker, effective-currency comparison for legacy-null order currency,
header summary after removing a whole source, and intermediate-overflow risk in
line discount proportion. Input mapping explicitly ignores server-owned discount
shares. Main navigation is blocked while a source dialog is active; close it
explicitly so its own retained-session cancellation guard is authoritative.

New/updated test source (not executed) covers retained Back without Apply,
original cancellation baseline, failed-source correction, two compatible PRs
retained/emitted together, main staged rows/source labels, sum of two independent
discounts, source-ID payload only on final Save, retained header/files, failed
capacity save and declined replacement. No backend test project was found in the
bounded source search; backend scenarios remain manual owner verification.

Two backend implementation streams had disjoint file ownership; root reviewed
and integrated their source. The extra backend audit did not return a completed
result; root performed the final source comparisons and corrections above.
All8 packets were regenerated after UI13/BE14 promotion; reviewed provenance
UI13 sha397e0e3a / BE14 sha8a54f2d8 plus preserved reference roles. Final -Check
passed all8. Scoped tracked diffs and new-file whitespace/merge-marker checks
passed. Builds/tests/lint/runtime/browser/database/commits remain unexecuted.

### Required owner schema and acceptance handoff

Run owner migration creation and database update before using the changed backend:
`Add-Migration AddPurchaseRequestLineDiscountShares`

Reason: new nullable decimal(18,2) PurchaseRequestAllocatedDiscount on PO details
persists each request's exact discount allocation independently. Agents did not
create/edit/run migrations or snapshots. The original single-request Header
contract remains compatible, but its earlier no-migration handoff is superseded.

Verify with the owner's frontend/backend build and tests, then select PR-A lines
and partial quantities, Back, choose compatible PR-B, Insert; both must appear in
main Details with source numbers and no create POST yet. Cancel/decline must keep
main header/files/rows; final Save emits one from-requests POST and reserves each
source once. Check mismatched supplier/type/currency refusal, stale/colliding
capacity, sum/rounding of source discount shares, edit/remove-source summary,
rejection/delete releasing capacity, attachments and Save/Print. Check the two
quoted banners are absent while actual failure messages remain.

Current suggested commits (suggestions only):
- Frontend: `fix(purchase-orders): stage multiple request lines before save`
- Backend: `feat(purchase-orders): preserve per-request source and discount shares`
- Documentation: `docs(purchasing): document retained multi-source selection`


Final source follow-up: header-only legacy orders without any source line FK now
return the existing SourceLocked failure on edit instead of being treated as
manual orders and accepting untracked new lines. Their disjoint reference fallback
is retained. Saved print source labels also fall back to their legacy header number.
The JSONC application configuration was inspected as authored text (not parsed as
strict JSON): new utility is an explicit runtime entry and no spec is an app entry.
Final scoped diff checks and final all8 packet Check passed after these amendments.


## Tier S compiler follow-up — 2026-10-24

Owner supplied Angular compiler output from 18:29–18:40. Current source still
contained `selectedRequests().length?.lines[index]` in lineLocked: length is a
number, so TS2339 is valid. Replaced it with the existing flattened typed owner
`selectedRequestLines()[index]`, retaining savedLine provenance fallback.
The older errors in the same pasted log already match current contracts:
initialSelections/requestSelections are plural, stageRequestSelection consumes a
readonly collection, and returnToSourceList accepts the shared typed back payload.
Source inspection confirmed all producer/consumer signatures together.

Conformance: existing routed PO master/detail editor + shared selection dialog;
UI13 public typed contract and UI14 row identity; no backend/API/schema change
in this follow-up. The existing two-source test source now checks lineLocked for
both source rows and an absent row. No extra test harness or test run was added.
Existing bilingual purchasing guide still describes protected source identities
and editable quantities accurately; corrected a joined Arabic sentence typo.
No new reusable rule or canonical-book/skill change is required for this typo fix.
Initial recipe Check all8 passed; scoped diff whitespace check passed. Builds,
tests and runtime were not run under the workspace source-only boundary.
Owner should rebuild Angular and exercise a staged two-request order. Earlier
multi-source migration handoff remains, unchanged by this compile fix.

Suggested frontend commit: `fix(purchase-orders): resolve staged source lines correctly`
