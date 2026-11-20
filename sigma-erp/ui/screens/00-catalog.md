# Sigma UI Screen Patterns — catalog

> **Navigation layer.** The files in `ui/screens/` add no rule and restate no
> value. Each one names the screen type, its approved reference, and the book
> blocks to read in order. The cited blocks own every rule; on any difference
> the block wins, and the difference is reported as documentation drift.

Pick the screen type first, then read only the blocks its file lists. For a
block with a topic folder, read its main file and only the topic files that the
screen row or the table "Topic files: when to open" below names; a topic file is
part of its block (Master8). Do not
choose a type because a recent feature looks similar; choose it from the
questions below and record the choice in the feature contract.

## Which screen type?

| Question about the feature | Screen type |
|---|---|
| Is the output a read-only document with filters, sections, and totals, with no CRUD row actions? Preserve the existing response/count/output contract under [UI20](../20-report-page.md); transport paging alone does not change the screen type. | [07 Report](07-report.md) |
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
| 01 | List with modal editor | 1, 4, 6, 13 | List `Workshop/Job/components/list` (shell, filter panel, grid); modal shared `editor-dialog/` (+ `editor-tabs/`), UI13 controlled composition | 1 Normal entity (`BranchService`), or 2 when a header owns detail rows |
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
| [1](../01-feature-folders-and-wiring.md) | Folder shape and route wiring (main file); container-fill host, no page scroll, one scroll owner per region, base component ([`01/02`](../01/02-viewport-and-scroll.md)) |
| [3](../03-header.md) | `app-feature-title` inside the primary card |
| [24](../24-colors-icons-buttons.md) | Shared tokens, icons and buttons (main file); `app-summary-cards` only when the screen has a summary/KPI/total-card region ([`24/02`](../24/02-summary-cards.md)) |
| [22](../22-loading-empty-error-toast.md) | Page loading and state messages (main file); loading conformance gate ([`22/01`](../22/01-loading-gate-and-owners.md)); error/success feedback and both failure channels ([`22/04`](../22/04-error-and-success-feedback.md)) |
| [23](../23-translations.md) | Translation keys in both vocabularies |
| [25](../25-rtl-and-dark-theme.md) | RTL and dark theme |
| [26](../26-permissions-and-route-access.md) | Current-session route/action access, real endpoint enforcement and reviewed permission metadata; no invented permission API |
| [27](../27-focus-and-keyboard.md) | Focus and keyboard |
| [28](../28-request-cancellation-and-stale-responses.md) | Request cancellation and stale responses |
| [29](../29-verification-expectations.md) | Owner verification expectations |
| [30](../30-backlog-by-priority.md) | Known defects; open only before reporting a problem as new |

## Topic files: when to open

The main file of each block below is read whenever its block applies. Open a
topic file only when its condition holds (one owner for this routing; screen
files name the same topics for their type).

| Block | Topic file | Open when |
|---|---|---|
| 1 | [`01/01`](../01/01-authenticated-shell.md) | Changing the authenticated shell, sidebar or desktop navigation |
| 1 | [`01/02`](../01/02-viewport-and-scroll.md) | Any routed screen: page shells, container fill, one scroll owner, routed editor/settings/financial exceptions |
| 1 | [`01/03`](../01/03-hierarchy-tree.md) | Hierarchy tree workspace (screen 04) |
| 1 | [`01/04`](../01/04-branch-switch.md) | Working-branch bootstrap or branch switching |
| 1 | [`01/05`](../01/05-platform-and-angular.md) | Platform, root composition, Angular adoption or standalone migration |
| 2 | [`02/01`](../02/01-cache-gate-and-checklist.md) | Every new or reviewed screen (cache gate) |
| 2 | [`02/02`](../02/02-reference-lookup-cache.md) | The screen consumes reference lookups |
| 2 | [`02/03`](../02/03-settings-and-policy-caches.md) | Settings reads, currency policy or dashboard snapshot caches |
| 2 | [`02/04`](../02/04-import-and-realtime.md) | Batch import transport or real-time read invalidation |
| 6 | [`06/01`](../06/01-columns-filters-money.md) | Money, percentage, frozen-first or advanced-filter columns; grid scroll owner |
| 6 | [`06/02`](../06/02-row-presentation.md) | Post-save text rows or row centering |
| 6 | [`06/03`](../06/03-report-rows-and-trees.md) | Report row width, report hierarchy, tree bulk controls or statement rows |
| 6 | [`06/04`](../06/04-report-tables-and-variants.md) | Report tables on the shared grid; report variants |
| 6 | [`06/05`](../06/05-csv-and-incremental.md) | CSV import workspace or incremental flat datasets |
| 7 | [`07/01`](../07/01-approval-status.md) | The model has an approval lifecycle |
| 7 | [`07/02`](../07/02-action-menu-runtime.md) | Any row action menu |
| 7 | [`07/03`](../07/03-action-log.md) | Document action log |
| 7 | [`07/04`](../07/04-quotation-specialization.md) | Quotation-style conversion cycles |
| 13 | [`13/01`](../13/01-access-while-open.md) | Editor with an explicit access requirement |
| 13 | [`13/02`](../13/02-mock-data.md) | Any new or reviewed editable form (mock-data assistance) |
| 13 | [`13/03`](../13/03-source-document-picker.md) | Selecting lines from source documents |
| 13 | [`13/04`](../13/04-document-journal-dialog.md) | Document journal dialog |
| 13 | [`13/05`](../13/05-accessible-tabs.md) | Any editor or workspace with tabs; hidden tab panels |
| 13 | [`13/06`](../13/06-routed-editors.md) | Routed document editors (screens 02 and 08) |
| 13 | [`13/07`](../13/07-dirty-close.md) | Any editable dialog or editor (dirty close) |
| 13 | [`13/08`](../13/08-body-padding-and-nested-drafts.md) | Dialog body padding or nested child drafts |
| 14 | [`14/01`](../14/01-bounded-scroll-and-print.md) | Routed editors with bounded row scrolling, or printing a collection |
| 14 | [`14/02`](../14/02-public-inputs.md), [`14/03`](../14/03-row-mechanics.md) | Any editable collection |
| 14 | [`14/04`](../14/04-financial-collection-editor.md) | Financial collection editor (screen 05) |
| 20 | [`20/01`](../20/01-accounts-family.md) | Accounts family reports |
| 20 | [`20/02`](../20/02-shell-and-visual-invariants.md) | Any report (shell, filter/totals invariants, title width) |
| 20 | [`20/03`](../20/03-summary-cards.md) | Report summary/KPI cards |
| 20 | [`20/04`](../20/04-tabbed-sections.md) | Tabbed report sections |
| 20 | [`20/05`](../20/05-accounting-tree-table.md) | Dense accounting tree/report tables |
| 22 | [`22/01`](../22/01-loading-gate-and-owners.md) | Every new or reviewed screen (loading gate) |
| 22 | [`22/02`](../22/02-session-progress.md) | Sign-in or sign-out |
| 22 | [`22/03`](../22/03-loading-appearance.md) | Changing the shared loading appearance |
| 22 | [`22/04`](../22/04-error-and-success-feedback.md) | Any request with error or success feedback |
| 24 | [`24/01`](../24/01-primeng-theme-and-sass.md) | PrimeNG theme hooks, appbar presentation or Sass modules |
| 24 | [`24/02`](../24/02-summary-cards.md) | Summary/KPI/total cards |
| 24 | [`24/03`](../24/03-overlays-and-dark-theme.md) | Body-appended overlay styles or dark-theme selectors |

## Reviewing the whole application

The order of the screen-by-screen review and the per-screen checklist are in Master block 1
(*Whole-application review order*). Each review picks the type here first.

## Maintenance

- A new screen type is added only when a book block defines it as Canonical
  with an approved reference. Add the block first, then the screen file, then a
  row in both tables above.
- When a cited block is renumbered or retired, update every screen file that
  cites it in the same change.
