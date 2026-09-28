# Sigma Backend Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 19 |
| Version | 0.17 |
| Last verified against source | 2026-09-17 (`IRepository`, `SiGmaControllerBase`, `SiGmaDbContext`, `MiscellaneousInvoiceService`, `InvoiceService`, `PurchaseOrderService`, `WorkOrderService` re-checked 2026-09-28) |
| Last content change | 2026-09-28 — skill promotion: page size 10 clamped 1–100 (block 9); repository calls and the list/extra-read-endpoint rule (block 5); base routes (block 6); tenant ownership (block 18) |
| Verified by | source inspection only — no build, test, migration, or database run |

Build order for one entity, six steps, five patterns. Open the reference file,
copy the shape, change the names.

Paths are relative to `SigmaBackend/`. This book is the single authority for
.NET work. Its companion is `SIGMA_UI_PATTERNS.md`, the Angular side of the same
contract — the ListVM, filter-key and payload rules are shared, so a change to
either side is a change to both.

Review orchestration, screenshot evidence, phase ownership, contract artifacts,
and final reconciliation are defined by `SIGMA_FEATURE_REVIEW_MASTER.md`. This
book remains the backend implementation authority incorporated by that master.
Screenshot-visible values never authorize a new entity, DTO field, endpoint, or
persistence contract without confirmed source or an explicit business decision.

### Generation packets

Coding models should not load this entire book when a reviewed phase or task
packet exists. Use the generated packet under `recipe-system/generated/` and
the approved reference named by that packet. Generated packets are derivative:
this book remains authoritative when they disagree.

`recipe-system/Generate-SigmaRecipes.ps1 -Check` verifies that each generated
packet still carries the current fingerprints of its canonical source blocks.
Tasks without a matching recipe use the smallest applicable block dependency
closure from this book.

## The six steps

Always in this order. Each step depends on the one before it.

| Step | Artefact | Project and folder |
|---|---|---|
| 1 | Entity | `SiGma.Helpers/Models/<Entity>.cs` |
| 2 | EF configuration | `SiGma.DataAccess/Configuration/<Entity>Config.cs` |
| 3 | ViewModels | `SiGma.ViewModels/ViewModels/<Entity>/` |
| 4 | AutoMapper profile | `SiGma.Business/MapperConfig/<Entity>Profiler.cs` |
| 5 | Interface + service | `SiGma.Business/IServices/I<Entity>Service.cs`, `SiGma.Business/Services/<Entity>Service.cs` |
| 6 | Controller | `SiGma.ServerAPI/Controller/<Entity>Controller.cs` |

Then tell the owner to run `Add-Migration <Name>` with a suggested name (Master
block 7, "Suggested migration name and commit messages"). Never create, edit, or run a
migration yourself, and never touch `SiGmaDbContextModelSnapshot.cs`.

## The five patterns

| # | Pattern | Reference service | Choose when |
|---|---|---|---|
| 1 | Normal entity | `Services/BranchService.cs` | One entity, ordinary Add/Update/Detail/List/Select/Delete |
| 2 | Master-detail, no financial effect | `Services/VouchersServices/PurchaseOrderService.cs` | A header owns detail rows; no journal voucher, no allocation |
| 3 | Master-detail with financial effect | `Services/VouchersServices/InvoiceService.cs` | Saving also writes a journal voucher, allocations, or accounting state |
| 4 | Settings | `Services/AdministrationsServices/ChargeSettingsService.cs` | A screen loads and saves a whole configuration set keyed by a logical key |
| 5 | Report | `QueryReport<T>()` plus a feature service, block 17 | Read-only, reads across tables, returns sections and totals. No CRUD, no `ListVM` |

Pick the **simplest** pattern that fits. Do not add detail reconciliation to a
normal entity, and do not add voucher or allocation logic to a non-accounting
document.

## Contents

| # | Block | Status |
|---|---|---|
| 1 | [Step 1 — Entity](01-step-1-entity.md) | Canonical |
| 2 | [Step 2 — EF configuration](02-step-2-ef-configuration.md) | Canonical |
| 3 | [Step 3 — ViewModels](03-step-3-viewmodels.md) | Canonical |
| 4 | [Step 4 — AutoMapper profile](04-step-4-automapper-profile.md) | Canonical |
| 5 | [Step 5 — Interface and service](05-step-5-interface-and-service.md) | Canonical |
| 6 | [Step 6 — Controller](06-step-6-controller.md) | Canonical |
| 7 | [ListVM scope rule](07-listvm-scope-rule.md) | Canonical |
| 8 | [Validation: duplicates, keys, delete](08-validation-duplicates-keys-delete.md) | Canonical |
| 9 | [Search model and filters](09-search-model-and-filters.md) | Canonical |
| 10 | [Select and dropdowns](10-select-and-dropdowns.md) | Transitional |
| 11 | [Document numbers (No)](11-document-numbers-no.md) | Legacy |
| 12 | [Activate and deactivate](12-activate-and-deactivate.md) | Transitional |
| 13 | [Pattern 1 — Normal entity](13-pattern-1-normal-entity.md) | Canonical |
| 14 | [Pattern 2 — Master-detail, no financial effect](14-pattern-2-master-detail-no-financial-effect.md) | Transitional |
| 15 | [Pattern 3 — Master-detail with financial effect](15-pattern-3-master-detail-with-financial-effect.md) | Canonical |
| 16 | [Pattern 4 — Settings](16-pattern-4-settings.md) | Canonical |
| 17 | [Pattern 5 — Reports](17-pattern-5-reports.md) | Transitional |
| 18 | [Edge cases](18-edge-cases.md) | Canonical |
| 19 | [Backlog](19-backlog.md) | — |

---

