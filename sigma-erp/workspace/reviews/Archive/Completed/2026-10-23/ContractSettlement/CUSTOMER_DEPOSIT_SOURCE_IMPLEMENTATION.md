# Customer deposit source implementation

| Status | Implemented — source-only |
|---|---|
| Owner verification pending | yes |

2026-10-07. This fragment records the exclusively delegated CustomerDeposit backend slice of the frozen `CONTRACT_SETTLEMENT_MAINTENANCE_EVOLUTION_PLAN.md`. No screenshots were supplied. The generated recipe drift check reported Phase 01 current and PLAN 00 / Phases 00 and 02–06 stale, so canonical Master 4/5/7 and backend blocks 5/8/15/18 governed the implementation.

## Scoped contract and evidence

| Concern | Decision | Evidence / conformance |
|---|---|---|
| Balance concurrency | `CustomerDepositService` lifecycle writes and outstanding-invoice balance reads acquire the tenant `JournalVoucherAllocation` application lock before source/balance reads. Nested allocation calls reuse the existing transaction. | Frozen plan rule 8; BE15 transaction ownership; `IUnitOfWork.ExecuteUniqueWriteAsync<TEntity>` current transaction behavior. |
| Source lifecycle | Use/refund require a live supported source and live posted, nonvoided source journal. Update/transfer/extend reject voided wrappers; transfer rejects any use/refund history; deletion rejects posted financial history. | Frozen plan rules 6–8; BE8 state/delete validation; J-1 posted-history decision. |
| Liability account | Use/refund debit the unambiguous original credit account from the posted source journal instead of resolving the current Link Accounts setting. | Frozen plan rule 7; BE15 historical posting stability. |
| Deposit use | Create a posted `ContactReceipt`-owned JV, persist its id on `CustomerDepositUsage.ReceiptId`, retain unallocated on-account credit when no invoice is selected, and allocate explicit selections through `IJournalVoucherService.AllocateAsync` in the same transaction. | Frozen API handoff and rule 7; existing `JournalVoucherAllocateVM` public shape confirmed with the accounting worker. |
| Allocation request | Add `CustomerDepositInvoiceAllocationVM { invoiceId, allocatedNow, notes }` and `CustomerDepositUsageAddVM.Allocations`. Resolve the selected live invoice's single customer AR debit line and pass the usage receipt as the allocation source. | Frozen API handoff; accounting worker confirmation of target/source orientation and live source/account/branch invariants. |
| Refund transport | Add optional `date` and `bankId`; use a valid selected payment method, require bank for bank transfer, and retain current-date/default-collection fallback only when the legacy request omits the method/date. | Frozen API handoff and rule 7. |
| Partial refund | Increase guarded consumed amount; mark `Refunded` only when the remaining available amount reaches zero. | Frozen rule 7. |
| Journal history | Return the source journal, linked usage-receipt journals, and the deposit operation journal when present instead of hiding use journals behind one header pointer. | Existing Journal action plus durable `CustomerDepositUsage.ReceiptId` lineage. |
| Schema | No entity/configuration change. Existing `CustomerDepositUsage.ReceiptId` is used. | Frozen no-schema decision and current entity/configuration. |

## Files

- `SigmaBackend/SiGma.Business/Services/BanksServices/CustomerDepositService.cs`
- `SigmaBackend/SiGma.ViewModels/ViewModels/CustomerDepositUsage/CustomerDepositUsageAddVM.cs`
- `SigmaBackend/SiGma.ViewModels/ViewModels/CustomerDepositUsage/CustomerDepositInvoiceAllocationVM.cs`
- `SigmaBackend/SiGma.ViewModels/ViewModels/CustomerDeposit/RefundDepositVM.cs`

## Verification boundary

Source-only review covers the complete scoped backend diff, public DTO shape, transaction/lock ownership, source/target ownership, posted-history guards, merge markers, and whitespace. Build, tests, lint, runtime, database, migrations, snapshots, and browser verification remain pending for the owner and were not run. No migration is required. Suggested backend commit: `feat(customer-deposits): secure use refund and invoice allocation`.
