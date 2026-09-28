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
| Is the domain intrinsically parent/child, and is the main operation navigating nodes rather than paging records? | [04 Hierarchy tree workspace](04-hierarchy-tree-workspace.md) |
| Does one screen load and save a whole configuration or account-mapping set, usually split into tabs? | [06 Tabbed settings workspace](06-tabbed-settings-workspace.md) |
| Does one screen edit many financial rows under one shared business context, usually split into source/type tabs? | [05 Financial collection editor](05-financial-collection-editor.md) |
| Is it a long record with several ordered groups or child collections that the user completes step by step? | [03 Step-form record](03-step-form-record.md) |
| Is it a paged list whose Create/View/Edit must be an independently addressable page, approved by source or a documented business workflow? | [02 List with routed master-detail editor](02-list-with-routed-master-detail-editor.md) |
| Otherwise: a paged list with Create/View/Edit | [01 List with modal editor](01-list-with-modal-editor.md) — **the default** |

Absence of an existing modal is not a reason to choose type 02 (UI block 13,
"Mandatory CRUD modal rule"). A screenshot's layout is not a reason either: a
screenshot supplies fields, actions, and workflow, never the screen type (Master
block 2, "Screenshots are not implementation authority" and "Screenshot-backed
scope from the user request").

## Summary

| # | Screen type | Owning block(s) | Approved UI reference | Backend pattern (backend `00-preamble`, "The five patterns") |
|---|---|---|---|---|
| 01 | List with modal editor | 6, 13 | `Fleet/VehicleService/components/{list,details}` | 1 Normal entity, or 2 when a header owns detail rows |
| 02 | List with routed master-detail editor | 13 (routed variant), 1 (routed full-page editor exception), 14 | List as 01; editor `Rental/RentalQuotation/components/details` | 2, or 3 when saving has a financial effect |
| 03 | Step-form record | 12 | `Customers/Companies/CompanyPartner/components/details` | 1 or 2 by the record's child collections |
| 04 | Hierarchy tree workspace | 1 ("Hierarchy tree workspace") | `Accounts/Account/components/{list,details}` | Select by the table; not fixed by the UI shape |
| 05 | Financial collection editor | 14 ("Financial collection editor"), 1 (routed financial-editor exception) | `Accounts/openingBalances/components/details` | Select by the table; not fixed by the UI shape |
| 06 | Tabbed settings workspace | 1 (routed settings-workspace exception), 16 | `Accounts/Link Accounts/LinkAccounts/components/details` | 4 Settings |
| 07 | Report | 20, 21 | `Customers/StatementOfAccount/components/list`; dense variant `Reports/TrailBalance/components/list` | 5 Report |

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

## Maintenance

- A new screen type is added only when a book block defines it as Canonical
  with an approved reference. Add the block first, then the screen file, then a
  row in both tables above.
- When a cited block is renumbered or retired, update every screen file that
  cites it in the same change.
