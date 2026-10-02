# Sigma UI Screen Patterns — catalog

> **Navigation layer.** The files in `ui/screens/` add no rule and restate no
> value. Each one names the screen type, its approved reference, and the book
> blocks to read in order. The cited blocks own every rule; on any difference
> the block wins, and the difference is reported as documentation drift.

Pick the screen type first, then read only the blocks its file lists. Do not
choose a type because a recent feature looks similar; choose it from the
questions below and record the choice in the feature contract.

## Which screen type?

| Question about the feature | Screen type |
|---|---|
| Is the output a read-only document with filters, sections, and totals, with no row actions and no server paging? | [07 Report](07-report.md) |
| Is it an accounting document — header, lines, totals and a journal (invoice, bill, credit/debit note, receipt, payment, journal voucher)? | [08 Financial document](08-financial-document.md) |
| Is it a small form that runs one domain action on an existing record (close, extend, void, deliver, log time)? | [09 Action dialog](09-action-dialog.md) |
| Is the domain intrinsically parent/child, and is the main operation navigating nodes rather than paging records? | [04 Hierarchy tree workspace](04-hierarchy-tree-workspace.md) |
| Does one screen load and save a whole configuration or account-mapping set, usually split into tabs? | [06 Tabbed settings workspace](06-tabbed-settings-workspace.md) |
| Does one screen edit many financial rows under one shared business context, usually split into source/type tabs? | [05 Financial collection editor](05-financial-collection-editor.md) |
| Is it a long record with several ordered groups or child collections that the user completes step by step? | [03 Step-form record](03-step-form-record.md) |
| Is it a paged list whose record has two or more child collections, or totals, or approval/posting (UI block 13 decision rule, D4-2)? | [02 List with routed document editor](02-list-with-routed-master-detail-editor.md) |
| Otherwise: a paged list whose record has fields only or one small child list, no totals | [01 List with modal editor](01-list-with-modal-editor.md) — **the default** |

Type 01 or 02 follows the UI block 13 decision rule (D4-2), not whether a modal or a page exists
today. A screenshot's layout is not a reason either: a
screenshot supplies fields, actions, and workflow, never the screen type (Master
block 2, "Screenshots are not implementation authority" and "Screenshot-backed
scope from the user request").

## Summary

| # | Screen type | Owning block(s) | Approved UI reference | Backend pattern (backend `00-preamble`, "The five patterns") |
|---|---|---|---|---|
| 01 | List with modal editor | 1, 4, 6, 13 | List `Workshop/Job/components/list` (shell, filter panel, grid); modal editor `Fleet/VehicleService/components/details` | 1 Normal entity (`BranchService`), or 2 when a header owns detail rows |
| 02 | List with routed document editor | 1 (editor shell), 13 (decision rule, routed variant), 14 | List as 01; editor `Workshop/Job/components/editor` | 2 (`PurchaseOrderService`), or 3 when saving has a financial effect |
| 03 | Step-form record | 12 | `Customers/Individual/IndividualPartner/components/{list,details}`; CompanyPartner now adopts the same shared shell and gated steps (2026-10-01 comprehensive fixes) | 1 or 2 by the record's child collections |
| 04 | Hierarchy tree workspace | 1 ("Hierarchy tree workspace") | `Accounts/Account/components/{list,details}` | Select by the table; not fixed by the UI shape |
| 05 | Financial collection editor | 14 ("Financial collection editor"), 1 | `Accounts/openingBalances/components/details` (legacy calc and frame rules removed in its review) | Select by the table; not fixed by the UI shape |
| 06 | Tabbed settings workspace | 1 (routed settings-workspace exception), 16 | `Accounts/Link Accounts/LinkAccounts/components/details` | 4 Settings |
| 07 | Report | 6, 20, 21 | `Accounts/TrailBalance/components/list` (shared strip and totals); semantics `Customers/StatementOfAccount/components/list`; new/reviewed report tables use `app-data-table` | 5 Report |
| 08 | Financial document | 1, 7, 13, 14, 19 | Editor shell `Workshop/Job/components/editor`; the first voucher reviewed becomes the document reference | 3 (`InvoiceService`) + `reviews/JOURNAL_ENTRIES_DECISION_SHEET.md` |
| 09 | Action dialog | 7, 13, 19, 22 | `Workshop/Job/components/close-job` | Domain transition of the owning pattern (2 or 3); Master block 4 action-state contract |

## Applies to every screen type

Read these with any type; each file lists them again only where they decide
something specific to that type.

| Block | Concern |
|---|---|
| [1](../01-feature-folders-and-wiring.md) | Folder shape, route wiring, container-fill host, no page scroll, one scroll owner per region, base component |
| [3](../03-header.md) | `app-feature-title` inside the primary card |
| [22](../22-loading-empty-error-toast.md) | Loading, empty, error, and toast states; both failure channels |
| [23](../23-translations.md) | Translation keys in both vocabularies |
| [24](../24-colors-icons-buttons.md) | Tokens, icons, shared buttons |
| [25](../25-rtl-and-dark-theme.md) | RTL and dark theme |
| [26](../26-permissions-and-route-access.md) | Authentication only; no invented permission API |
| [27](../27-focus-and-keyboard.md) | Focus and keyboard |
| [28](../28-request-cancellation-and-stale-responses.md) | Request cancellation and stale responses |
| [29](../29-verification-expectations.md) | Owner verification expectations |
| [30](../30-backlog-by-priority.md) | Known defects; check before reporting a problem as new |

## Reviewing the whole application

The order of the screen-by-screen review and the per-screen checklist are in Master block 1
(*Whole-application review order*). Each review picks the type here first.

## Maintenance

- A new screen type is added only when a book block defines it as Canonical
  with an approved reference. Add the block first, then the screen file, then a
  row in both tables above.
- When a cited block is renumbered or retired, update every screen file that
  cites it in the same change.
