# Sigma Backend Pattern Book — Draft Canonical

| | |
|---|---|
| Status | **Draft canonical.** Binding for new work; open items in block 19 |
| Version | 0.85 |
| Last targeted source verification | 2026-10-23 — documentation current-state pass checked the pattern index, reference paths, ViewModel file-count rule, and report status. This was not a full source verification. |
| Last content change | 2026-10-30 — BE18 shared quantity/hour/meter policy, explicit input-scale rejection and derived rounding; experimental-data foundation decision. Earlier verification scope remains unchanged. History in `../CHANGELOG.md` |
| Verification boundary | Targeted source/documentation inspection only; no full source review, build, test, migration, or database run |

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
| 1 | Normal entity | `SiGma.Business/Services/BranchService.cs` | One entity, ordinary Add/Update/Detail/List/Select/Delete |
| 2 | Master-detail, no financial effect | `SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs` | A header owns detail rows; no journal voucher, no allocation |
| 3 | Master-detail with financial effect | `SiGma.Business/Services/VouchersServices/InvoiceService.cs` | A financial-effect workflow; the current approved draft policy distinguishes Save from Approve/Post where applicable. Existing references may still write a journal during Save; record that as historical not-yet-migrated behavior in the feature contract. |
| 4 | Settings | `SiGma.Business/Services/AdministrationsServices/ChargeSettingsService.cs` | A screen loads and saves a whole configuration set keyed by a logical key |
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
| 10 | [Select and dropdowns](10-select-and-dropdowns.md) | Canonical |
| 11 | [Document numbers (No)](11-document-numbers-no.md) | Canonical reservation; transitional formatting |
| 12 | [Activate and deactivate](12-activate-and-deactivate.md) | Canonical |
| 13 | [Pattern 1 — Normal entity](13-pattern-1-normal-entity.md) | Canonical |
| 14 | [Pattern 2 — Master-detail, no financial effect](14-pattern-2-master-detail-no-financial-effect.md) | Canonical |
| 15 | [Pattern 3 — Master-detail with financial effect](15-pattern-3-master-detail-with-financial-effect.md) | Canonical |
| 16 | [Pattern 4 — Settings](16-pattern-4-settings.md) | Canonical |
| 17 | [Pattern 5 — Reports](17-pattern-5-reports.md) | Canonical |
| 18 | [Edge cases](18-edge-cases.md) | Canonical |
| 19 | [Backlog](19-backlog.md) | — |

---
