# Account reconciliation option

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |
| Tier | M, bounded account property end-to-end; plan required for schema/defaults |

Owner authorizes adding Reconcile in Account details after discussing a per-account capability distinct from bank-statement matching. Scope is stored configuration, not implementing a general journal-line matching engine or changing current allocation/bank behavior. Conversation is evidence; no screenshot.

## Existing state / impact / alternatives

| Area | Classification | Evidence / selected outcome |
|---|---|---|
| Account entity, EF, Add/Update/Detail | Extend | No existing reconciliation flag; new persisted `AllowReconcile` |
| Canonical Account hierarchy pane | Extend | Existing checkbox field/form/dirty modes, next to AllowBudget |
| Account create, convert, seed, subledger writers | Extend | Default new receivable/payable analytical accounts true, others false; preserve explicit false and existing choices; move flag to child on conversion |
| BankReconciliation / BankReconciliationLine | Keep | Existing separate statement session/selected JV detail snapshot/reservation workflow, no dependency on new flag |
| JournalVoucherAllocation / ReceiptAllocationDetail | Keep | Existing document allocations; not a general account-line reconciliation engine |
| General matching engine / automatic allocation integration | Not in this slice | No new matching endpoint/amount/status/approval/permission introduced |

Selected bool on Account over a bank-only setting or type-only permission because owner requests per-account configurability. Type supplies creation default only. Changing type on an existing account must not silently overwrite its flag. Group accounts always false. Grouping-only roles cannot enable the flag even on malformed analytical rows.

## Frozen decisions and rollout

- Entity and Detail/Update: bool. Add: bool? so omitted request defaults by selected AccountType.Kind (Receivable/Payable) and leaf status; explicit false wins. Null type defaults false. All other posting types may opt in.
- No actual live children allowed for enabled analytical accounts; existing parent/child validation plus normalization on grouping retained. Existing transactions do not block changing configuration because no new matching engine consumes it yet. No deletion of allocation or banking history.
- Create seeds default new typed receivable/payable leaves; initial chart may gain types after creation, so new-chart defaults must be applied after classification or explicit known creation role. Rerunning initialization/setup must not re-enable an edited existing account. Existing database column defaults false; no backfill or data command.
- Existing bank and allocation operations retain their behavior; flag is configuration for later general reconciliation work. UI/help and final report must state that boundary explicitly.
- No route/list/grid contract change. Authenticated tenant ownership and current save/transaction boundaries remain.

## Execution

Recipe check all8 OK. Applicable PLAN-00, Phases0/1/3/5/6. Phase2 no new list; Phase4 no new matching/state action. Account UI shape04, backend specialized Account normal entity validation with current conversion action. Existing Account pane is approved hierarchy reference; BE1–4/8 and UI1/15/16/23 govern the extension. Source-only verification; no builds/tests/lint/browser/database/migrations/commits. Owner generates/applies `AddAccountReconcileOption`, rebuilds, then checks save/reload, new type defaults/manual override, group locks, conversion, repeated seed preservation and bank workflow unaffected.
