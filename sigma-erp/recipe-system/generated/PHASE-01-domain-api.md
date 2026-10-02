<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-01-domain-api | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-01-domain-api.template.md -->
# PHASE 1: Domain, Persistence, and API

Use this packet to establish authoritative server behavior before UI consumers
are finalized.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:e091f8715bd45438f4c58030c4b56015b25567c6a0541c233340321b522d916a
- master.1: ## 1. Governance and review principles | sha256:3e69ec4d48c952286dea7792d9e442d37585c15446b7ef02531c8a54053558cf
- master.2: ## 2. Screenshot and visual evidence policy | sha256:2765a62adfb7b5913db822c98348b3a456a6ee504e8ed4d2434881a593cf41f5
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:2d02535a738d0a1e03f44f22ff5ac7028554bc00cf9e8517245d3cf9e4c5811e
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:542c18b6aebf46ed0eef2c290f184e04de0eea49bea5d148c7e423b05f7259c7
- master.5: ## 5. Continuous quality gates | sha256:f58faeabf6c2409c74fefb2ab8bffe86ad0dfc6f4042220c4425e07697d4e22f
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:73c6e842f2a188bb1fc2ca3391756683ac7fca9cd64c805e229c02ae7ce03bb5
- backend.1: ## 1. Step 1 — Entity | sha256:3d755799b3e4b42bb225a46660377f86994c9d67b9450ca7b9ec9ca126c78f2b
- backend.2: ## 2. Step 2 — EF configuration | sha256:542434089dccbb109c242e52bd9ccc357f6b6d217efa9b68ed0dad17259e7a48
- backend.3: ## 3. Step 3 — ViewModels | sha256:4a11c70ca487d4644b26fc5082a6d9244db925d3a6ef8d3f7c174b0548fb48a1
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:d8ab105a1462baaa5dee9c089419a7783ede54cdb09d075a51805970fef624f9
- backend.6: ## 6. Step 6 — Controller | sha256:ef99a6dec8e52b278bc36495c5415bd445b65183e12189e02ecd9e88cee3d75e
- backend.7: ## 7. ListVM scope rule | sha256:24fbfbcf92b61da465eb4b8b4d9aa50f2c48c1f43e8711402843db1ff1a7771e
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:1798ea5f97d741d74fdb69fb8555447c0a2d04fabc40b88895e17d22b8588e36
- backend.9: ## 9. Search model and filters | sha256:80adaa0424534a753b302d2ae386e8374958bea389692e3b856f7ecc8cdf082e
- backend.10: ## 10. Select and dropdowns | sha256:700a3fc93df824f337cf2bf5c2fe12f866d8aee46c8be35976a2fccf7fa533cb
- backend.11: ## 11. Document numbers (No) | sha256:64b0d4b95e91a9b9dd3abc1f8eb55a0251a388795d6ea0743a61e3c329d1b202
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:72df618eef97754d2145fd42ce10e3a09b842ec6870bce6a2e7ee3eced51af93
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:7e2d36c3ce382f62e903e3c14d8cc74023eb1e28cadc8913c5cc0e37aceb62d7
- backend.16: ## 16. Pattern 4 — Settings | sha256:f2379884db393f76c984b88a487c4ec4cbad1e492a69a48302d9761d6fa2339e
- backend.17: ## 17. Pattern 5 — Reports | sha256:57ec4fd3d996915f15d15c7baad51a573b258d24cd19680dc1c2f10ef437aa73
- backend.18: ## 18. Edge cases | sha256:a485f6c78402f9f0717d03164ce3fcccd4a7ea449c0352b381fd6aa77e88c108

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
