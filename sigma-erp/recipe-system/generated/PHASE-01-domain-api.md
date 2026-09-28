<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-01-domain-api | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-01-domain-api.template.md -->
# PHASE 1: Domain, Persistence, and API

Use this packet to establish authoritative server behavior before UI consumers
are finalized.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:2a00e0f2004ea5c5cbd27c9a26b08bfe0599846b4a088c1e6e51a13c51123c74
- master.1: ## 1. Governance and review principles | sha256:127af0593047619ee010cc42872c85f6fb17822939fc1eb84ddc0448a1bc38d2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:a34e2c67fb64586a7d135ae183ef2085e698c442fe21f0ea34059360b019c63c
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:3e4693fe20b130ccadbc096ec295c856ca45b65edce618be94f856736f679a28
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:7f9e01355e77a11d7b6ac6c30e6093397e8df8ada6489488ca1027b7d252fa03
- master.5: ## 5. Continuous quality gates | sha256:20f297601f44c6f54a86681f894a655fcd8cf1f78c852288f0654451830a50c9
- master.6: ## 6. Human and AI review protocol | sha256:4ceaecd1ec28eb3a13b14908b167b8b4c632cbdc403f7f7622324076cd3e6399
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:ab611bb68b93c0e7b2fe256a1fbafb30a9a2f9f6f56f397e87f1b6cf3301b3cb
- backend.1: ## 1. Step 1 — Entity | sha256:402e9b4eea62373a3aafebd8985dc20e9724d8d140a798e123ebd6024a3de7bb
- backend.2: ## 2. Step 2 — EF configuration | sha256:380d118d3350120685c6803baac619d45a383d7b9c3594417953129d93994322
- backend.3: ## 3. Step 3 — ViewModels | sha256:34e112b5119c6c4e222bd1e984261d3a3385c2b5c82f921d0a9d59b47480f4f9
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:337246e86e0bbc6f3e4910c39f070f7235aa3984a4bad92b6ce70d49fb2e9658
- backend.5: ## 5. Step 5 — Interface and service | sha256:9b3baa82fcb269fd9c8b3c9d407a7e5e10a2eab2bea4109ea2e7d8ce7f541a44
- backend.6: ## 6. Step 6 — Controller | sha256:196e4d710119ab25a6e4a2e7f6db823b298f7420f9748f792f92944c95602654
- backend.7: ## 7. ListVM scope rule | sha256:65cc47b13fc8e207693e2ed6d033d491f879d845dc39a07b261670328ecbc1d1
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:c834c66dc17d92ffca8e74a7f32113de7febbf293507205c32287d375e3bb386
- backend.9: ## 9. Search model and filters | sha256:6ab38c4859bfd9d1a29424abfa3e6ea38670329c9c1c3f78db133cf4945523fa
- backend.10: ## 10. Select and dropdowns | sha256:4f52d4a48672f3a86c04856cf6a3b11e93442d6c062c78effbb56017e965a6da
- backend.11: ## 11. Document numbers (No) | sha256:de235ede7e7b956870b015236d065da71dce0ebd1f9ec3a16a5da492302529ab
- backend.12: ## 12. Activate and deactivate | sha256:9b94917f07ae34b895ef07fcf62ad039cbaf1a00786bdd05fb91e078beb0dd32
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:c744ef011b1b10511c873fe7afb1d6b6a1992392c81e9c9f6db18ceb05cf733c
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:80805d298438df7141fade3d3c04cd3a8efd6ee44b4738c180623f50bf88b3c9
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:632431c1d33706e030d2c1a56d0a52169d46daa4f69c3c44d910aabcf340eb12
- backend.16: ## 16. Pattern 4 — Settings | sha256:2f54dc0f231a48095318a7f802cb952c1c6aef64770c9cadbdee36007035b65c
- backend.17: ## 17. Pattern 5 — Reports | sha256:309c2a4dec4c1479e70b870ba4452011775fc3d5273bfea78aba1f8647b41ee3
- backend.18: ## 18. Edge cases | sha256:54b16261e2303ca977639276da2aa38b689d83678f06e9ceb7e6b98a307944df

Approved backend references:

- `SigmaBackend/SiGma.Business/Services/BranchService.cs`
- `SigmaBackend/SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs`
- `SigmaBackend/SiGma.Business/Services/VouchersServices/InvoiceService.cs`
- `SigmaBackend/SiGma.Business/Services/AdministrationsServices/ChargeSettingsService.cs`

The Master Guide and Backend Pattern Book are authoritative. This packet is
derivative. Stop and report drift when they disagree.

## Purpose

- Freeze domain and API contracts consumed by read, write, and action paths.
- Keep server-owned state at the backend boundary.
- Identify persistence, transaction, compatibility, and migration effects.

## Included concerns

- Entity and aggregate shape.
- Entity base class and tenant behavior.
- EF configuration, indexes, required relationships, and migration impact.
- Add, Update, Detail, List, Select, and action DTO separation.
- AutoMapper direction and projection.
- Duplicate business keys, FK validation, delete blockers, and ownership checks.
- Transactions, child reconciliation, calculations, concurrency, and idempotency.
- Endpoint, request, response, paging, filtering, and error contracts.
- Upload persistence and cleanup contracts.

## Explicit exclusions

- Grid layout and row markup.
- Angular form structure.
- Screenshot-derived component selection.
- UI-only permission hiding.
- Running or editing migrations.

## Dependencies and input gate

Required:

- Frozen Maintenance / Evolution Plan when the Master Guide requires one.
- Phase 0 Feature Review Manifest.
- Evidence rows that require stored or returned data.
- Selected backend pattern.
- Scoped backend files and direct consumers.

Missing or Uncertain evidence does not authorize a new entity property or API.
If Phase 1 evidence conflicts with a Frozen maintenance/evolution target contract,
mark the affected plan decision stale and reopen that decision; do not silently
implement a different backend design.

## Procedure

1. Select the simplest backend pattern and entity base.
2. Inventory persisted fields, relationships, and inbound references.
3. Define separate List, Detail, Add, Update, Select, and action contracts.
4. Verify client-editable versus server-owned fields.
5. Verify mapping direction and remove only mappings proven unnecessary.
6. Define duplicate, FK, ownership, state, and delete validation.
7. Trace each reachable execution path, reconcile children explicitly, count
   the saves reached by that path, and record implicit or explicit transaction
   ownership using the canonical backend rule.
8. Define filter parsing, stable paging, and response metadata.
9. Define both declared-failure and transport-failure behavior.
10. Record schema and API compatibility impact.

## Required outputs

### DTO ownership matrix

| Field | Entity | List | Detail | Add | Update | Select/action | Owner and reason |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Validation and invariant table

| Invariant | Add | Update | Delete/action | Persistence support | Failure contract |
|---|---|---|---|---|---|
| | | | | | |

### Transaction boundary table

| Method and execution path | Scoped `DbContext` or persistence boundaries | `SaveChangesAsync` calls reached | Child reconciliation before save | Transaction owner | Decision and reason | Required source comment | Manual review |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Count saves by reachable execution path, not by textual occurrences in the
method. One scoped `DbContext` saving a complete tracked entity graph once uses
EF Core's implicit transaction. Keep or introduce an explicit transaction only
when multiple dependent saves or independent persistence boundaries must commit
atomically. A private helper may rely on its owning method's transaction only
when both share the same scoped unit of work and `DbContext`; record that owner.

Use the applicable source comment at each reviewed decision point:

```csharp
// Removed: EF Core implicit transaction is sufficient.
// Kept: Multiple SaveChangesAsync() calls must be committed atomically.
```

### Endpoint contract

| Operation | Method/route | Request | Response | Authorization/state rules | Transaction | Error behavior |
|---|---|---|---|---|---|---|
| | | | | | | |

### Migration and compatibility decision

| Change | Entity/EF impact | Migration required | Existing consumers | Owner action |
|---|---|---|---|---|
| | | | | |

## Continuous gates

- Repository tenant and soft-delete behavior is understood before adding manual
  predicates.
- Required FK collections are validated by distinct count, not `Any`.
- Add and Update exclude server-owned values.
- A single graph save on one scoped `DbContext` is not wrapped in an explicit
  transaction without a documented technical reason.
- Every retained explicit transaction covers a reachable multi-save or
  multi-boundary consistency requirement from before the first mutation.
- Private persistence helpers have a named transaction owner and use the same
  scoped unit of work and `DbContext` as that owner.
- Calculations remain backend/domain-owned.
- Upload paths and abandoned files have an explicit lifecycle.
- API failure responses remain actionable and typed.
- No migration or database command is run by the reviewer.

## Expected handoff

Phases 2, 3, and 4 receive frozen contract tables. Any later contract change
marks affected downstream reviews stale.
