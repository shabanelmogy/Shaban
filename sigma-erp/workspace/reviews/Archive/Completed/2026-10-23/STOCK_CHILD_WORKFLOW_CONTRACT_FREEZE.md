| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Stock child UI ownership amendment — 2026-10-09

Owner explicitly selected: **manage item quantities within the principal document**,
after receiving both options and their consequences. This authorizes retiring the
four independently routed legacy child editors and redirecting their old links to
the respective principal document lists. It supersedes the pending choice in the
module review; no new parent selector/attachment contract is introduced.

| Existing route family | Approved destination | Evidence |
|---|---|---|
| /ItemIssueItem, create, details/:id | /ItemIssue list | Parent owns full issue rows; existing Issue child service rejects linked edits/removals |
| /ItemRequisitionItem, create, details/:id | /ItemRequisition list | Parent owns full requisition rows and fulfilment state |
| /ItemReturnItem, create, details/:id | /ItemReturn list | Parent owns complete return snapshot and reason |
| /StockTransferItem, create, details/:id | /StockTransfer list | Parent owns destination plus source/item/quantity rows and duplicate checks |

All old paths are compatible navigation aliases, not editor modes. Do not
reinterpret a child ID as a parent ID; redirect to the list without opening a
different record or creating a document. Drop child-specific query parameters.
Existing principal document routes, filters, Create/View/Edit/Delete and actions
remain the source of truth. No access-control/security claim is made.

Read-only consumer scan: four child services are imported only by their own
list/details and LayoutModule (two legacy provider arrays). Their model interfaces
are internal to those four roots; principal editors have independent interfaces.
No explicit child runtime/spec roots occur in tsconfig. Retire child components,
models and frontend services after removing direct layout imports/providers;
keep the four public lazy-route constants in their existing route files and
`pages/routing.ts` imports. Preserve unrelated layout/user/peer changes.

Backend child endpoints, services, DTOs/mappers and stored rows remain intact for
API compatibility. No data deletion, parent reassignment, stock/valuation rewrite,
schema/migration, new authorization, or backend action restriction is part of
this amendment. The separate remaining legacy API boundary is recorded for the
owner rather than presenting UI retirement as endpoint security.

| Concern | Book/reference inspected | Shared owner | Target |
|---|---|---|---|
| Route alias | UI1/10; actual Stock principal route UrlTree guards and Angular router RedirectFunction/CanMatch declarations | Angular router | Four old route modules redirect to their correct principal list |
| UI ownership | Master4; BE14 snapshot rule and actual principal Stock row DTOs/editors | Existing principal documents | No independent child mutation UI or replacement generic CRUD |
| Obsolete source wiring | UI1; pages/routing and LayoutModule direct references, compiler roots | Existing lazy routing/root services | Retire only proven obsolete child frontend consumers |
| Guide | Master7; existing UserGuide reader | Stock module guide | Explain rows inside documents and old-link destination |

No agents act on unfrozen dependent contracts. Child discovery worker may now
implement only the four feature roots; root owns LayoutModule, guide/menu,
integration and final reconciliation. Build/test/runtime/browser/DB/migrations/
snapshot/commit/push restrictions remain. Owner verification pending.

## Source reconciliation

Implemented the owner's amendment: all four public route constants retained in
their existing lazy modules, each with wildcard CanMatchFn returning the correct
principal list UrlTree without query parameters. Installed Angular17.3.12 supports
CanMatchFn; the earlier table's mention of RedirectFunction is corrected by this
actual declaration evidence (no RedirectFunction is used). Empty children supplies
a valid componentless route; guard redirects before activation. No child ID is
reinterpreted. Removed 48 internal frontend files and only their Stock layout
imports/providers; no remaining runtime consumers. Backend endpoints/data and
the separate legacy API limitation remain as frozen. See STOCK_FEATURE_REVIEW.md
for source verification, guide coverage and pending owner acceptance.
