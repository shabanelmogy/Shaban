# Account Reconcile property contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Governing [approved plan](ACCOUNT_RECONCILE_OPTION_MAINTENANCE_EVOLUTION_PLAN.md); root owns decisions and final integration.

| Surface | Target / ownership |
|---|---|
| Account entity / EF | `AllowReconcile: bool`, required DB default false |
| Existing POST Account | `AccountAddVM.AllowReconcile: bool?`; omitted defaults to Receivable/Payable only for analytical, explicit bool retained |
| Existing PUT Account | `AccountUpdateVM.AllowReconcile: bool`; group normalizes false, grouping-only type rejects true |
| Existing GET Account/GetById | `AccountDetailVM.AllowReconcile: bool` to typed `AccountDetailsDTO.allowReconcile` |
| Form | nonnullable bool; reset false; pristine new selected receivable/payable type defaults true; manual override retained; saved accounts never re-default on type changes |
| Groups | disabled, cleared; actual children guard remains server-owned; conversion transfers to new posting child, parent false |
| Mapping | Existing convention maps carry new field, no extra ignore/reverse map |
| List/tree/lookup | Unchanged, no unused new list property or operational selectability widening |
| Financial effects | None in this slice; no general matches, automatic settlement or bank gating added |
| Failure | Existing Result failures/transport handling retained; grouping-role validation localized EN/AR |
| Save boundary | Existing Add/Update single saves and conversion atomic owner retained |
| Tenancy / permissions | Existing authenticated tenant query/writes; no invented permission |

## Before-edit conformance

| Concern | Book | Actual reference/shared owner | Target |
|---|---|---|---|
| Hierarchy details | UI1 tree, UI15/16 | Account details native checkbox/label, existing form mode/dirty lock | Extend existing reference in scope, no layout/CSS fork |
| Persistence/DTO/map | BE1–4 | AccountConfig/AccountProfiler; BranchProfiler conventional maps | Minimal entity/VM field |
| Validation | BE8 | AccountValidator existing parent checks and role classifier | Analytical only; grouping-type guard |
| Guide/language | Master7/UI23 | Existing Accounts guide reader/menu `/UserGuide/accounts`, two vocabularies | Explain configuration vs current bank reconciliation |

No missing decision blocks this stored-configuration slice. General matching rules remain outside it rather than being invented.

## Owner amendment — bank defaults, 2026-10-24

Owner additionally requests default activation for bank accounts. Creation default expands to `Receivable`, `Payable`, **`BankAndCash`** (the existing combined bank/cash kind), still only for analytical accounts. This supersedes the two-kind default above without rewriting its historical decision. Manual false and existing account settings remain preserved. The shared backend helper covers Add normalization, new-chart seeding and subledger creation; frontend new-account preview must match. No schema/API/bank-matching workflow change.
