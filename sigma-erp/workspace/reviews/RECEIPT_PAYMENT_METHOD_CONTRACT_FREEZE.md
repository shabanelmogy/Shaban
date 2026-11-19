# Receipt Payment Method — Feature Review Manifest and Contract Freeze

Current scope clarification2026-10-26: the owner requested full Receipt review
and completion from Receipt1/2/3.png. See RECEIPTS_DOMAIN_API_CONTRACT_FREEZE.md
and RECEIPTS_FULL_STACK_REVIEW.md for the current list, party eligibility,
receivable allocation and reasoned approval handoff. This older payment-method
record remains historical evidence; its gross-card/BankId/fee snapshot contract
is retained. Its unchanged-list assertion and pending packet drift are not current
instructions (all eight packets checked OK in the new task). No legacy backfill
or unrelated booking/card settlement accounting is authorized by the new slice.

Date: 2026-08-22  
Scope: the Receipt detail/write path in `SiGmaAngularFrontEnd`, the Receipt
entity/DTO/mapping/service path in `SigmaBackend`, and the directly consuming
Card Transaction Bank Transfer pending-settlement path.

## Authority and packet status

- Canonical authority: `SIGMA_FEATURE_REVIEW_MASTER.md`, UI blocks 13, 16, 19,
  22, 23, 25, 27, and 28, and backend Pattern 3 with blocks 3–5, 8, 10, 15,
  and 18.
- `Generate-SigmaRecipes.ps1 -Check` reports drift for generated packets 00
  through 06. Canonical sources own this review; packets require regeneration
  and semantic review.
- Screenshots `3.PNG` and `4.PNG` are functional/content evidence only.

## Functional evidence classification

| Evidence | Classification | Frozen implication |
|---|---|---|
| `3.PNG` | Confirmed conditional card content | Card payment methods expose transaction number, batch number, last four digits, expiry, actual amount, commission percentage, commission, and VAT amount. |
| `4.PNG` | Confirmed conditional bank content | Bank Transfer exposes a required Bank selector. |
| Current Receipt DTO/entity | Confirmed card persistence | Receipt persists card metadata and backend-derived card financial values. |
| Current Bank entity and link-account service | Confirmed bank source; API extension approved | Receipt gains nullable `BankId`; Bank Transfer requires it and resolves the selected Bank's linked GL account. |
| Current Card Transaction Bank Transfer service | Conflicting accounting ownership, resolved by user | Settlement owns net/commission/VAT posting once; Receipt posts the gross amount to its card-clearing account. |

## Frozen detail and write contract

- `PaymentMethodId` is required. Its backend `PaymentType` controls conditional
  behavior; UI labels/names do not control business logic.
- Credit Card, Debit Card, and Card Refund show card metadata. The frontend
  previews card financial values, but Add/Update sends only metadata and never
  sends derived totals.
- The backend uses the selected Payment Method's configured commission rate and
  calculates Commission = Amount × rate / 100, VAT = Commission × 5%, and
  Actual Amount = Amount − Commission − VAT, rounded to four decimals.
- Bank Transfer requires `BankId`; the backend validates ownership/existence and
  resolves `LinkAccountsType.BankAccounts` for that Bank. Other payment types
  clear `BankId`.
- Non-card payment types clear card metadata and derived values. Hidden stale
  values cannot affect persistence or vouchers.
- Receipt's journal voucher credits customer AR and debits the gross Receipt
  Amount. Receipt does not post card commission or VAT. Card Transaction Bank
  Transfer uses stored Receipt values as settlement defaults and posts those
  fee lines once.
- Card settlement reloads amount and descriptive snapshot fields from each
  source Receipt, rejects deleted/voided/non-card sources and invalid fee rates,
  and does not trust client-supplied source amounts.
- A Receipt referenced by a card settlement cannot be updated, deleted, voided,
  or un-voided. Bank deletion is blocked when a Receipt references the Bank.
- Card-settlement update keeps the tracked aggregate header and explicitly
  reconciles validated detail rows; the header AutoMapper map does not replace
  the owned collection.

## Compatibility and migration decision

The Payment voucher contract is unchanged. Receipt list/grid contracts are
unchanged. The Cash Deposit pending-source query and write validation accept
only vouchers whose Payment Method type is Cash, preventing card and bank
vouchers from entering a second settlement route. Adding `Receipt.BankId` and
its foreign key requires an owner-run `Add-Migration`; migrations and snapshots
remain outside this task.

## Remaining missing or conflicting contracts

- `BookingService` creates deposit Receipts directly. It posts a gross payment-
  method debit, but does not apply Receipt's configured card commission preview
  and has no Bank selector for Bank Transfer. Extending the Booking Deposit API
  is a separate Missing editor/API contract.
- Card Transaction Bank Transfer currently debits the master Payment Method's
  linked account and credits the general customer-card-deposits account, while
  Receipt debits its source Payment Method's linked clearing account. Whether
  the transfer's selected `BankId` and each source Payment Method must own those
  two GL accounts is Conflicting and needs an accounting decision before that
  separate voucher contract is changed.
- No source contract states whether a card Receipt must be approved before it
  is eligible for settlement. No approval-state rule was invented.
- Existing card Receipts are not backfilled. Historical null derived values are
  presented to settlement as zero commission and gross net until the owner
  decides whether data correction is required.

## Verification boundary

Final reconciliation is source-only. Build, tests, lint, browser/runtime,
database, migrations, commit/push, and deployment are prohibited by workspace
policy and remain owner verification.

## Final reconciliation

| Concern | Producer → consumer | Status |
|---|---|---|
| Conditional type | `PaymentMethodDetailVM.Type` → Receipt typed form | Reconciled by numeric `PaymentType`; no name matching |
| Bank input | Receipt form `bankId` → Add/Update VM → Receipt entity/FK | Reconciled; required only for Bank Transfer |
| Card inputs | Receipt metadata controls → Add/Update VM | Reconciled; derived values excluded |
| Card calculation | Payment Method configured rate → Receipt domain calculation → Detail VM | Reconciled at four-decimal precision and 5% VAT |
| Receipt JV | Receipt Amount → customer AR credit and selected debit account | Reconciled as balanced gross posting |
| Card settlement | Source Receipt → pending list → validated snapshot → settlement details/JV | Reconciled for source/type/amount/fees and mutation locks |
| Cash deposit | Payment Method type → pending Receipt/Payment and write validation | Reconciled to Cash only |
| Payment voucher | Existing Payment DTO/entity/service | Unchanged |
| Schema | Receipt entity/config → database | Owner action pending: `Add-Migration` and database update |

Applied phases: Phase 0 evidence, Phase 1 domain/API freeze and implementation,
Phase 3 detail/write implementation, and Phase 6 source reconciliation. Phase 2
grid work, Phase 4 new domain actions, and Phase 5 route/runtime wiring were not
applicable.
