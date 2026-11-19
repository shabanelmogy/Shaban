# Opening Balances Feature Review Manifest

## Manifest

| Item | Frozen decision or evidence |
|---|---|
| Requested outcome | Refactor `SiGmaAngularFrontEnd/src/app/modules/Accounts/openingBalances` and its directly related .NET opening-balance/account-link contracts so saved opening balances and generated journal vouchers cannot diverge. |
| Evidence | Current Angular/.NET source plus the ten Opening Balances screenshots supplied on 2026-09-16. Screenshot metadata not supplied by the user is Unknown. |
| UI shape | Routed multi-tab financial editor. Each tab owns an editable collection; screenshots are functional/content evidence, not layout authority. |
| Backend pattern | Canonical Pattern 3: master-detail with financial effect. Each tab is a full-replacement collection whose source rows and `OpeningBalanceJV` are one consistency boundary. |
| Approved UI building block | `shared/components/editable-collection-table` for editable row collections; feature owns typed `FormArray` state, validation, payload mapping and persistence. |
| Packet status | Revalidated on 2026-09-17 with `Generate-SigmaRecipes.ps1 -Check`; Phase 00 through Phase 06 packets all reported `OK`. |
| Migration boundary | Entity/EF changes are implemented in source, but no migration or snapshot is created or run. A migration is required for `OpeningBalanceBatch`, the required Cost Center opening-balance dimension columns/constraints, and the Link Accounts uniqueness changes before this source can run against the database. |

## Functional Evidence Table

| Evidence | Classification | Required feature behavior | Owner | Frozen decision |
|---|---|---|---|---|
| Accounts screenshot | Confirmed | Account Code, Debit, Credit; rows save as one opening-balance set | Phase 03 | Branch and Cost Center remain supported optional dimensions because backend supports them; account must be a leaf account. |
| Cost Center screenshot | Confirmed + Resolved | Account, Branch, Cost Center Group, Cost Center, Detail, Debit, Credit | Phase 01/03 | `CostCenterGroupId` remains an organizational selector; `CostCenterId` is now mandatory and is the only accounting dimension posted to `JournalVoucherDetail.CostCenterId`. The selected Cost Center must belong to the selected Group. |
| Customers screenshots | Confirmed | Multiple opening rows may belong to the same customer; row date/detail/agreement/debit/credit are editable | Phase 01/03 | Bulk reconciliation uses persisted row `Id` as identity; duplicate CustomerId is allowed. |
| Suppliers screenshot | Confirmed | Supplier/date/detail/debit/credit rows | Phase 01/03 | Preserve current one-row-per-supplier logical key until contrary evidence exists. |
| Staff screenshot | Confirmed + Defect | Staff/date/detail/debit/credit must affect accounting | Phase 01/03 | Enable the existing source-backed Staff control-account posting flow. |
| Stock screenshot | Confirmed | Item, quantity, description, debit, credit | Phase 01/03 | Preserve quantity source rows; accounting uses configured Stock Account and Opening Balance Equity. |
| Prepaid screenshots | Confirmed + Missing contract | Screenshot also demonstrates From Date and To Date / remaining amortization period | Phase 00/01 | Do not invent From/To or amortization fields; current API has no authoritative contract. Preserve current account/vehicle/detail/debit/credit contract. |
| Deposit screenshot | Confirmed + Conflicting | Multiple deposit rows may belong to the same customer; agreement/contact/customer/type/amount/notes are persisted | Phase 01/03 | Bulk reconciliation uses row `Id`; duplicate CustomerId is allowed. Voucher Date/No shown by current Angular are not persisted by the API and are removed from the editable contract until backend ownership is defined. |

## Frozen Write Contract

1. `POST .../AddList` remains the authoritative full-replacement write for each tab. Omitted persisted rows are removed from that tab's active set.
2. All other in-scope mutation paths must either delegate to the same aggregate reconciliation or reject the operation; no path may mutate an Opening Balance row without reconciling its JV.
3. Every debit/credit row must have exactly one side strictly greater than zero; neither side may be negative.
4. Journal posting accounts must exist, be active/non-deleted leaf accounts, and the generated JV must balance.
5. `OpeningBalanceJV` is a source-owned derived ledger entry. Saving Opening Balances automatically approves/posts the generated JV in the same aggregate transaction. Posted/Approved state does not lock the Opening Balances source; only Void or active allocations block a rebuild. Generic Journal Voucher create/update/delete/activate/deactivate/post/unpost/void/allocation paths reject `OpeningBalanceJV`; corrections are made from Opening Balances only.
6. `General / OpeningBalanceEquity` is the balancing account for every generated opening-balance JV.
7. Customer/Supplier/Staff control accounts resolve through `LinkAccountsType.Contacts` by contact group. Stock resolves `General / StockAccount`. Deposit resolves `General / CustomerDepositsPayableAccount`. Prepaid and Account rows post to their selected accounts directly.
8. Link Accounts logical identity is the existing service upsert key: `(Type, Value, SubType, JobType, LinkSection)`. `AccountId` is the mapped value, not part of identity. Database uniqueness must be tenant-scoped and ignore soft-deleted rows.
9. One persisted `OpeningBalanceBatch` exists per subscription. Its server-owned `OpeningDate` is the single GL date for every generated `OpeningBalanceJV`, across all tabs and branches, and must equal `FiscalYear.StartDate`. Customer/Supplier/Staff `VoucherDate` remains the source document date only and never determines the GL posting date.
10. The client does not choose or submit the Opening Date. A new batch resolves the current open fiscal year and uses its first day automatically; an existing batch synchronizes against the first day of its own `FiscalYearId`. Posted/Approved generated JVs remain source-editable because they are derived from Opening Balances; Void or active allocations block corrective synchronization.

## Journal Voucher Rebuild / Save Hardening Closure

| Phase | Source closure |
|---|---|
| 1 â€” Subscription ownership | Added entities receive `SubscriptionId` from the authenticated context at the final EF save boundary, including new children attached to tracked aggregates. Existing ownership is immutable; tracked tenant moves are rejected and detached updates use tenant ownership as a concurrency predicate instead of trusting client data. |
| 2 â€” Rebuild ownership | `RebuildAsync` reconciles current and previously referenced JV ids, rejects missing/wrong-source JVs, foreign generated details, duplicate source/branch ownership and reuse of one generated JV by multiple branch groups. Expected source-line shrink/delete still reconciles owned details rather than silently ignoring the old JV. |
| 3 â€” Monetary/account validation | Opening Balance source amounts and the final rebuilt JV are checked against the centralized financial-number policy. Negative values, both/neither positive sides, invalid/inactive/non-leaf accounts and final imbalance are rejected. `SaveJVAsync` is the final generic-JV save gate for both new and rebuilt vouchers, validates header/detail references plus posting accounts/fiscal year/money shape, and refuses updates to Posted/Approved/Voided/allocated vouchers. The direct Journal Voucher service retains user-facing prevalidation, explicitly reconciles owned detail/document collections on update, then delegates persistence to that gate. |
| 4 â€” Links and allocations | Opening Balance general/contact mappings resolve through semantic resolver APIs backed by the full logical Link Accounts key; the low-level exact-key resolver is no longer exposed to business services. General, Charges, Payment Method, Bank and Partner callers use domain-specific lookup methods; Payment Method resolution derives Branch/Category from its master record. Bank mappings now use `SubType=BankId`, `Value=null`, and `AccountId` only as the mapped GL output. Ambiguous runtime/stored/request mappings are rejected rather than selecting or deleting one silently. Allocation protection checks both JV identities and both detail identities directly. |
| 5 â€” Concurrency | Full-replacement writes require the aggregate `ExpectedVersion`, execute inside a serializable transaction, and treat failed tenant-concurrency saves / `DbUpdateConcurrencyException` / deadlocks as HTTP 409-style conflicts. The version hash includes source rows plus generated JV header/state/details. `OpeningBalanceBatch` has its own `Version/ExpectedVersion` contract so stale batch synchronization is also rejected instead of last-write-wins. |
| 6 â€” Atomic save boundary | `RebuildAsync` stages JV changes but does not save. Each Opening Balance tab performs one final persistence operation for source rows + generated JV inside the same transaction; a failed save cannot be reported as success. Generic `SaveJVAsync` also rejects a failed persistence result. |

`JournalVoucherResolver` is also fail-closed at the shared boundary: generic `SaveJVAsync` rejects `OpeningBalanceJV` so the Opening Balances aggregate cannot be bypassed, and fiscal-year resolution rejects overlapping open fiscal years for the same posting date instead of selecting one arbitrarily. Posting callers must now use the explicit dated fiscal resolver; the separate current-fiscal helper is the only resolver path that intentionally uses today's date. Link Account and fiscal-year ambiguity that escapes a service boundary is returned as an HTTP 409 configuration conflict rather than an unhandled 500. Opening Balances continues to convert those configuration conflicts into its explicit business result where it owns the aggregate workflow.

The desired tenant-scoped filtered unique indexes for Link Accounts are represented in `LinkAccountsConfig`, including normalized nullable key dimensions. `OpeningBalanceBatch` also has a tenant-scoped filtered unique index so there can be only one active batch per subscription. These EF model changes require a database migration before they can be relied on as physical constraints. Per the task boundary, no migration or snapshot was created or run.

Migration/data-conversion rule: do not backfill `OpeningBalanceBatch.OpeningDate` from `DateTime.Today`, the minimum source `VoucherDate`, or another inferred transaction date. The only valid source is the owning fiscal year's persisted `StartDate`; existing source-owned `OpeningBalanceJV` entries may be synchronized/rebuilt from Opening Balances while they are non-voided and unallocated, regardless of their Posted/Approved state. Likewise, do not fabricate `OpeningBalanceCostCenter.CostCenterId` from `CostCenterGroupId` or choose the first member of a group; existing Cost Center opening rows must be explicitly mapped to a real Cost Center or deliberately reset before enforcing the required dimension column. Legacy `BankAccounts` Link Accounts rows that stored the linked GL account in `Value` must be converted explicitly to `AccountId` and have `Value` cleared; runtime fallback from `Value` has been removed so bank mappings now use one canonical identity (`Type=BankAccounts`, `SubType=BankId`, default dimensions) with `AccountId` as the mapped output only.

## Action-State Contract

| Action | Allowed when | Blocked when |
|---|---|---|
| Save full tab | Opening Balance Batch initialized from `FiscalYear.StartDate`; no JV yet or source-owned JV is unallocated and non-voided | Batch missing, date/fiscal mismatch, Voided, active JV allocation, invalid account/link/fiscal/dimension state |
| Initialize/synchronize Opening Balance Batch | Automatic when the Opening Balances screen opens. The backend owns `OpeningDate` and always derives it from `FiscalYear.StartDate`; the user has no date-change action | Missing/ambiguous open fiscal year, or a required synchronization is blocked by a Voided/allocated generated JV |
| Delete row by omission | Same as Save while generated JV is non-voided and unallocated | Voided/allocated generated JV; downstream deposit usage also blocks deleting an opening deposit source |
| Approve/Post JV | Automatic inside the Opening Balances save transaction | Manual lifecycle actions from Journal Vouchers are blocked for `OpeningBalanceJV` |
| Reopen/Unpost generated JV | Not exposed; `OpeningBalanceJV` stays automatically posted while it exists | Generic Journal Voucher lifecycle is blocked |
| Void generated JV | Not exposed from generic Journal Vouchers | `OpeningBalanceJV` lifecycle is source-owned; generic void is blocked |

The Journal Voucher detail screen keeps `OpeningBalanceJV` fully read-only. Generic update/delete/activate/deactivate/post/unpost/void/allocation actions are blocked by the backend; the Opening Balances aggregate is the only mutation owner.
| Development reset all | Development environment only; current authenticated subscription; all branches in that subscription | Production/non-Development environment |

Development reset is a hard-delete maintenance action for pre-production test data only. It deletes all Opening Balance source rows for the current subscription across all branches, the `OpeningBalanceJV` vouchers/details/allocations they own, related bank-reconciliation lines, and `CustomerDeposit` wrappers/usages rooted in Opening Balance Deposit rows. It does not delete unrelated receipts, invoices, or non-Opening-Balance journal vouchers.

## Current Accounting Map

| Tab | Source side | Balancing side |
|---|---|---|
| Accounts | Selected account, optional Branch/CostCenter | Opening Balance Equity |
| Cost Center | Selected posting account + selected `CostCenterId` (validated against selected `CostCenterGroupId`) | Opening Balance Equity |
| Customers | Contact-group control account + PartnerId | Opening Balance Equity |
| Suppliers | Contact-group control account + PartnerId | Opening Balance Equity |
| Staff | Contact-group control account + PartnerId | Opening Balance Equity |
| Stock | General Stock Account | Opening Balance Equity |
| Prepaid | Selected prepaid account | Opening Balance Equity |
| Deposit | Customer Deposits Payable credit + PartnerId | Opening Balance Equity debit |

## Unresolved Requirements Register

| Requirement | Status | Safe boundary |
|---|---|---|
| Cost Center Group accounting dimension | Resolved 2026-09-17: Group is organizational only; user selects a real Cost Center and backend validates Group membership | Post `CostCenterId` only. Never derive, distribute, or choose a Cost Center from the Group. |
| Opening-balance posting date policy | Resolved 2026-09-17: `OpeningBalanceBatch.OpeningDate` is server-owned and equals the first day of the owning fiscal year | The client never submits the GL opening date. Every generated Opening Balance JV uses `FiscalYear.StartDate`; source `VoucherDate` remains document metadata for Customer/Supplier/Staff and future aging/settlement semantics. |
| Draft versus automatic posting | Resolved 2026-09-17: Opening Balance is an exception to the generic JV draft lifecycle | Saving Opening Balances generates/rebuilds an `OpeningBalanceJV` and marks it Approved/Posted atomically. It can be edited only through Opening Balances; generic Journal Voucher mutations reject it. |
| Prepaid From/To dates and amortization schedule | Missing API/domain contract | Do not add fields or schedule logic in Opening Balances. |
| Deposit Voucher Date / Voucher No | Missing backend contract | Remove fabricated frontend values; do not persist invented fields. |
| Customer/Supplier opening-balance settlement documents | Legacy direct Customer source-row allocation is incompatible with ledger-backed Opening Balances; supplier opening settlement is not implemented | Keep direct source-row settlement disabled until allocation targets the generated posted JV detail through a stable document-level contract. |
| Production correction lifecycle | Resolved 2026-09-17 | During Opening Balance setup, source-owned generated JVs stay auto-posted and corrections are made only through Opening Balances while the JV is non-voided and unallocated. After the opening-balance setup is operationally closed/go-live, correct historical balances through the normal adjustment/reversal journal workflow; never use generic JV edit/unpost or hard-reset to rewrite posted opening history. |
| Financial precision migration | Runtime policy is centralized, but ledger amount storage remains `decimal(18,2)` and migrations are prohibited in this task | Reject incompatible base-currency precision/monetary scale instead of truncating; widen schema only in a deliberate future migration. |

## Financial Number Policy Boundary

- Backend is authoritative for monetary scale. Base-currency `DecimalPrecision` drives allowed Money scale, but the current ledger schema limits it to at most two decimal places.
- Exchange-rate precision is a separate semantic policy and is not treated as Money precision.
- Opening Balance inputs/totals consume the backend policy for `step`, display digits and validation. The frontend does not perform authoritative financial rounding.
- The broader Sigma codebase still contains legacy local rounding/formatting and explicit `decimal(18,2)` declarations. This review does not claim global numeric-policy migration is complete.

## Settlement / Allocation Boundary

- Financial outstanding/due/ageing calculations only consume allocations whose allocating side has posted, non-voided ledger effect. Draft allocation rows remain operational reservations/dependencies so they still prevent conflicting edits and over-allocation.
- Credit Note and Debit Note allocation targets must belong to the selected customer/supplier and their target Invoice/Bill JV must already be posted and non-voided.
- Draft + posted allocation reservations are validated together, and Credit/Debit Note replacement writes revalidate capacity inside a Serializable transaction to prevent concurrent overbooking.
- Generic JV allocation sources must themselves be posted/non-voided and belong to the target partner. `OpeningBalanceJV` is excluded from the generic "Other JV" settlement source because the current allocation schema identifies the source at whole-JV level rather than the exact partner/detail line.
- Receipt/CreditNote/DebitNote source approval now synchronizes the linked JV approval/posting state; unapproval clears posting state and remains blocked when active allocations exist.
- Opening-balance-backed Customer Deposits cannot be used/refunded until their source Opening Balance JV is posted and non-voided. Deposit Use/Refund are final operational actions and their generated JVs are posted/approved within the same transaction as the operational balance/status update.

## Verification Boundary

Current closure verification includes source review plus compile/build checks for the touched Angular and .NET projects. No database migration, schema update, commit or deployment is part of this task. Runtime browser verification is still required after the updated API binaries are loaded to confirm the post-save network requests all complete and the UI spinner clears.

