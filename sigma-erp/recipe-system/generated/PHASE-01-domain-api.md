<!-- GENERATED FILE. DO NOT EDIT DIRECTLY. -->
<!-- Recipe: phase-01-domain-api | Status: canonical-review -->
<!-- Source: recipe-manifest.json + templates/PHASE-01-domain-api.template.md -->
# PHASE 1: Domain, Persistence, and API

Use this packet to establish authoritative server behavior before UI consumers
are finalized.

## Canonical provenance

- master.0: # Sigma Feature Review Master Guide — Canonical - preamble | sha256:223e1233ba9b050b21a1052d8210300a3a7bacb57cf9c2a7c66c63b6adc1ecfe
- master.1: ## 1. Governance and review principles | sha256:4af3c22f52464c9696ac85adb7f000d9c89d1bd76ecabfffa2662030d5fa66b2
- master.2: ## 2. Screenshot and visual evidence policy | sha256:817eed9bcf1b6e55bd4e485e0297ade2bec072fb8360fd8fb8db49d918c10256
- master.3: ## 3. Phase model, ownership, and dependencies | sha256:401444b8a3fa2228c28387b28d1c7dab77fe83aeaa3a63a92b385644beacce27
- master.4: ## 4. Required decisions, artifacts, and contract invariants | sha256:416b24a6d74c22be5d7f8d37480fab2ef17fa7ddb0d3e4f1632795ed813558d0
- master.5: ## 5. Continuous quality gates | sha256:e332beddb8ee63faeea534279ce185f91f103e03d24514943b975a169f4ee748
- master.6: ## 6. Human and AI review protocol | sha256:bd28aa60196f8c328cddc50e40cf2b0be15fce7f63c84580f50c72a2ea381b97
- master.8: ## 8. Packet generation and governance | sha256:d21cd155e9041bfdac3d153a52d6941147d10be5a89e67c19ab748ba1166caa1
- backend.0: # Sigma Backend Pattern Book — Draft Canonical - preamble | sha256:0983535564fda910eb148cbb4a66079548016ce287b95a9409c7cec41974ed0a
- backend.1: ## 1. Step 1 — Entity | sha256:b762e9cee6264a5d9fe46208210f1f17dbdced5bc1092f8fc692717ffc86114e
- backend.2: ## 2. Step 2 — EF configuration | sha256:6fc404d5c366c960f1ff9292a0b9ce4b69c6825da3f4416385af0389c0ebc386
- backend.3: ## 3. Step 3 — ViewModels | sha256:1b2fd3b17c42fc35e1d5878bec1bad25b15edd349871a1957c2c1af9252d3bd2
- backend.4: ## 4. Step 4 — AutoMapper profile | sha256:f44d1e86220f2d11780e9d94370219270c183c004aef0ba39f7f9cb9e1550f11
- backend.5: ## 5. Step 5 — Interface and service | sha256:848b38b971e23945d10cb02d95cd2f94c2f3a176fe126e1a2169dca039be816d
- backend.6: ## 6. Step 6 — Controller | sha256:f0f56867e3997a688067c5e5ec7f19070f1f4d621a0d5617e4e9639fdf74eba6
- backend.7: ## 7. ListVM scope rule | sha256:6ae3e69d94ccc02a60bd005f20020b7cd4b9f105b81afa9baf63c427cfa05caa
- backend.8: ## 8. Validation: duplicates, keys, delete | sha256:9ffa9db969ffca5f271d1d047180ffd0fa5e7416eab045c9d3688b79c88c2e12
- backend.9: ## 9. Search model and filters | sha256:4ef414b8a321331568d54b24460ed22775a51164f055f89cb217841f815639dd
- backend.10: ## 10. Select and dropdowns | sha256:61f5fb1f28d7992cf7610dfbe5a9e4fc6d08fd656230d72ab36067a6f1c04925
- backend.11: ## 11. Document numbers (No) | sha256:5e5b57934271ae234d4fe49041c94703c53cc2eae9babe645b502a693e2e1e1d
- backend.12: ## 12. Activate and deactivate | sha256:0ab72d83147f2121f134159c72ce89862f2e6687b34d190aedcb9f48dd277c8d
- backend.13: ## 13. Pattern 1 — Normal entity | sha256:edfeb2f60ddcaaa73b8b31192afaba55bee59f8dde932beb111c6181e2d8daa2
- backend.14: ## 14. Pattern 2 — Master-detail, no financial effect | sha256:6035716962da9804921f58bce9d45abcedb25bc78df3210a790f1eeff1a472f0
- backend.15: ## 15. Pattern 3 — Master-detail with financial effect | sha256:617d88ab8c71663d9b5dde488440db4ea5d176c266854e28550625b166439ee7
- backend.16: ## 16. Pattern 4 — Settings | sha256:1464b56b0af2c120542e7f5be144c24b4bf268ab01db1613cfd803bd58817a77
- backend.17: ## 17. Pattern 5 — Reports | sha256:44e453b0f1099ea1885b08213580864c71447e9e93b0b1cf24f5fb81d7362742
- backend.18: ## 18. Edge cases | sha256:13d0548154a54a05fda8d1276d7d19529ee31b2b79d7945ab1363e7f18abb6f0

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
