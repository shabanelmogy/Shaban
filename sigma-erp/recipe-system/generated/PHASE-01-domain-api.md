<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-01-domain-api | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-01-domain-api.template.md -->
# PHASE 1: Domain, Persistence, and API

Use this packet to establish authoritative server behavior before UI consumers
are finalized.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:3d74ae71fa7ca4d78e3061da8b59c62bf979108fe9529ec4052336a6da002034
- master.1: ## 1. Governance and review principles | sha256:ee76565b87a3e1818f4ae0b77f0d10041f5dcbb4141a72e5bae32d07adedb420
- master.2: ## 2. Screenshot and visual evidence policy | sha256:0b1dbab4b3b5c74d8f98f445aa6401c59248a410eb62069b1a0e970aae83a7c2
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:fa4216c7eb26b98af29e24c266026c920dafc7d1e8031d06bbd6d803dfc960a5
- master.5: ## 5. Continuous quality gates | sha256:f33275578ef4b77c78d894dc27e67da870281c9ba228f988c98f055597e026d2
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:90dac99897883d0a9d4e973f60b38f549c45b3511dfd83bd5fe3e389da1eeb04
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.1: ## 1. Step 1 — Entity | sha256:52a1318fd245375c9ebdc492abb38eeb87a8004d48bb1007ade18b500143a030
- backend.2: ## 2. Step 2 — EF configuration | sha256:cf4f75793ea80c2bd92d2b51a51aa3b0d57240be85e4bd11f928737190874460
- backend.3: ## 3. Step 3 — ViewModels | sha256:933970f27dabf7974427031b8da025a0bda06fa7c341134c8f666665299bc4a6
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:2756fc24a8a3aff7b061c8bd51716403d7c353bdfc79bd1573223eac9d5381ba
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.7: ## 7. ListVM scope rule | sha256:a32c3c557eec2057ea19e2c4233176c5c701135a7c02173f650fa242b9a69091
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:25c8c824e257a558545cb1475aa83b0e02ccb83c6cd980bc163c4d0840cfd344
- backend.9: ## 9. Search model and filters | sha256:1064b113a9c3badecae45e5ea387980d383a30fa398be6353802ced34de04d27
- backend.10: ## 10. Select and dropdowns | sha256:5492c310ca8d128504e1e223600fba3d8bdfaaacd7ef8907446d57a536edcc06
- backend.11: ## 11. Document numbers (No) | sha256:5e5b57934271ae234d4fe49041c94703c53cc2eae9babe645b502a693e2e1e1d
- backend.12: ## 12. Activate and deactivate | sha256:9f0e81c5f9c502123092dbd91de4e11b7886c0575d38a8c715fadece39f252c3
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:b3b6cf30cbd6bfab549f516d75cc31f5abaa64e43d53ae0f1ba906d57b80dc33
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:9aa937b534848693453be58682e411e089a6de631363ffa72ab529b3abebe432
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:99a22dc9b24695edc30eef7ed5b7ff1241576830b4f86fd3d1424af7a06e6465
- backend.16: ## 16. Pattern 4 — Settings | sha256:66be4b0b3eab54af0f2d37c4658f255db8e9fe8e4fcaace16627754174ac2c9e
- backend.17: ## 17. Pattern 5 — Reports | sha256:ccf8fd38580e92bc5da25e555e0b09e0e30dfcef4ab797ebb8842c5d932d84eb
- backend.18: ## 18. Edge cases | sha256:ca231703f8f3eecb2ba71fb505d7d6960d9c84ae8c2a9f3e3a73847bc553c3b8

Approved backend references:

- `SigmaBackend/SiGma.Business/Services/BranchService.cs`
- `SigmaBackend/SiGma.Business/Services/VouchersServices/PurchaseOrderService.cs`
- `SigmaBackend/SiGma.Business/Services/VouchersServices/InvoiceService.cs`
- `SigmaBackend/SiGma.Business/Services/AdministrationsServices/ChargeSettingsService.cs`

The Master Guide and canonical books are authoritative; this packet is
derivative. Run recipe `-Check` before use and follow Master8 for drift. Preserve
unrelated changes; source-read-only review still forbids application-source edits.
Each item names the block that owns its rule; this packet restates no values.

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

Compare the declared endpoint table with actual controller routes and inherited
HTTP actions (BE6). Record service-only methods separately. For an exposed
nonassignable action, trace ordinary-user denial and the administrator's
service response through their actual paths.

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
- Classify reviewed numeric fields by domain (BE18): shared quantity/hour/meter
  precision and scale rejection, integer counts/identities, financial money
  policy. Reconcile DTO/storage/readers together; experimental data is not a
  reason to retain accidental precision. Round only explicitly derived results.
- Upload paths and abandoned files have an explicit lifecycle.
- API failure responses remain actionable and typed.
- No migration or database command is run by the reviewer.

## Expected handoff

Phases 2, 3, and 4 receive frozen contract tables. Any later contract change
marks affected downstream reviews stale.
