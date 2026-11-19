# Journal Voucher Posting — Feature Review (read-only)

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Request | "عاوز اراجع الية انشاء القيود المحاسبية" — read-only review of how journal vouchers are generated |
| Guides | Master Guide; backend blocks 14 (explicit transaction), 15 (financial effect, journal direction, Link Accounts completeness), 18; packets `-Check` 8 × OK |
| Scope | `JournalVoucherResolver`, `JournalVoucherService`, and the document services that build vouchers (35 files reference the resolver); reports' posting filter; fiscal-year close check. Source-only; nothing built or run |

## How it works today

1. A document service resolves accounts through `JournalVoucherResolver` (`GetPartnerAccountAsync` → Contacts link by contact group; `GetChargeAccountIdAsync` → ChargesType by module; `GetGeneralAccountIdAsync`; `GetPaymentMethodAccountIdAsync`; `GetBankAccountIdAsync`). An exact match is required, the account must be an active posting account, and a duplicate mapping throws `LinkAccountConfigurationException` (→ 409 by middleware).
2. `NewJV(...)` builds a header with `IsPosted = false`; `AddLine(...)` adds lines.
3. `SaveJVAsync` validates: not opening-balance, not posted/approved/allocated on update, date, header and line references, money scale, active leaf accounts with no children, **open fiscal year covering the date** (overlap throws), debit = credit, one positive side per line. Then saves. Numbering is central (`Repository.AddAsync` → `SetDocumentNumbersAsync`).
4. Reports (`AccountReportHelper`, `AccountReportsService`) and fiscal-year close count only `IsPosted && !IsVoided`; close is blocked while any voucher in the year is not approved and posted.

Strong points: one validation gate, balanced/one-sided lines, posting-account and fiscal-year checks, ambiguity detection in Link Accounts, explicit transactions on most multi-save paths, resolve-before-save in Invoice/Bill/Misc Invoice.

## Findings

| # | Severity | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| 1 | High | **Posting policy differs per document.** Three behaviours: (a) the document's Approve posts its JV — Receipt, Credit Note, Debit Note; (b) the JV is auto-posted on save — Customer Deposit use/refund (`MarkOperationalJournalPosted`), Opening Balances; (c) the JV stays Draft until someone approves it on the Journal Voucher screen — Invoice, Bill, Miscellaneous Invoice (incl. Close Job), PDC receivable/payable, Rental/Lease deposits, Booking deposit, Staff. Until then the amounts are missing from every ledger/report. | `ReceiptService.cs:322-331`, `CreditNoteService.cs:474-483`, `DebitNoteService.cs:289-298`, `CustomerDepositService.cs:709-714`, `NewJV` `IsPosted = false`, `AccountReportHelper.cs:212` | Owner decision: one policy. Suggested: operational documents without their own approval auto-post on save; documents with an approval step post on approve. |
| 2 | High | **Cash Deposit and Card Transaction Bank Transfer approval does not post the JV** — it sets the document's `IsPosted`/`ApprovalStatus` only; the generated JV stays Draft, so the screen says posted while the ledger does not. | `CashDepositService.cs:288-294`, `CardTransactionBankTransferService.cs:291-297` | Post/unpost the linked JV in the same toggle, like Receipt. |
| 3 | High | **PDC receivable clearing creates a Receipt with `ApprovalStatus = Approved` but its JV is Draft.** | `PDCReceivableService.cs:413-441` | Post the JV with the approved receipt (or create the receipt unapproved). |
| 4 | High | **Generated JVs can be edited, deleted, approved and unapproved from the Journal Voucher screen independently of their source document.** Only `OpeningBalanceJV` is guarded. Editing lines makes the ledger differ from the invoice; unapproving a receipt's JV leaves the receipt Approved; deleting leaves the source pointing to a deleted JV. | `JournalVoucherService.cs:205-226` (Update), `:380-404` (Remove), `:413-470` (Approve/UnApprove) | Treat `VoucherType != JournalVoucher` as source-owned: read-only on the JV screen; approve/unapprove only through the source document. |
| 5 | High | **Unposting ignores the period.** `UnApproveAsync` (JV) and the documents' unapprove do not check that the fiscal year is still open, so a voucher inside a closed year can be unposted, changing closed figures. | `JournalVoucherService.cs:440-470`; fiscal check exists only in `SaveJVAsync` | Require an open fiscal year (and open month, see 6) for approve and unapprove. |
| 6 | High | **Month close is not enforced.** `MonthClose` (Open/Closed per month) is stored and toggled, but no posting, update, approve or unapprove path reads it. | `MonthCloseService.cs:165-175`; no other reference in `SiGma.Business` | Check the month in `SaveJVAsync` and in approve/unapprove. |
| 7 | High | **Miscellaneous Invoice is saved without any JV when the customer has no linked account** (silently; no transaction either). This also affects the workshop invoice raised by Close Job. | `MiscellaneousInvoiceService.cs:24-89` (`if (customerAccountId > 0)`) | Fail with "No customer control account…" like `InvoiceService.cs:816`. Small fix. |
| 8 | Medium | **Invoice revenue goes to one account per invoice type** — Rental → `RentPerDay`, Lease → `Rent`, Limousine → `Rental`; other charge types of the same invoice (fuel, damage, extra km…) are not split, so their Link Accounts are unused by invoices. Invoice types other than the four in `InvoiceCreatingType` have no revenue account. | `InvoiceService.cs:884-903` | Owner decision: split credit lines by charge type (needs charge lines on the invoice) or keep one revenue account. |
| 9 | Medium | **Cost center rules are not applied.** `Account.CostCenterRequired` and `DefaultCostCenterId` are validated when editing accounts but never read when posting; generated lines carry no cost center. | only `AccountValidator.cs:61-161` | In `SaveJVAsync`, default the line's cost center from the account and reject a required account without one. |
| 10 | Medium | **Posting errors surface as HTTP 500 in some paths.** `SaveJVAsync` throws `InvalidOperationException` (unbalanced, closed year, invalid account); only Link-Accounts and fiscal-overlap exceptions are mapped by the middleware. Services with `catch (Exception)` return a message; Miscellaneous Invoice and Customer Deposit use/refund do not catch. | `JournalVoucherResolver.cs:350-440`, `AccountingConfigurationExceptionMiddleware.cs`, `CustomerDepositService.cs:329-346` | A dedicated `JournalPostingException` mapped to 409/400, or catch in those services. |
| 11 | Low | Sentinels differ: `GetPartnerAccountAsync` returns `0`, the other resolvers `null`; callers mix `== 0`, `<= 0`, `is null or <= 0`. | resolver `:48-168` | Return `int?` everywhere. |
| 12 | Low | `ApproveAsync` does not re-validate lines (an account may have become inactive or a parent since the draft was saved). | `JournalVoucherService.cs:413-433` | Re-run the account and period checks on approve. |

Backend block 19 backlog has no journal entries, so all items above are new.

## Suggested order

1. #7 (small, affects Close Job) and #2/#3 (state drift, local changes).
2. Decision on #1 (posting policy), then #4 and #5/#6 together (period and source locks in one place: the resolver/`JournalVoucherService`).
3. #9, #10, #11, #12.
4. #8 only after the owner decides how invoice revenue should be split.

Decisions needed from the owner: **#1 posting policy**, **#8 revenue split**. Items #5 and #6 change what users may do in closed periods (accounting effect), so they also need approval before implementation.

No source file was changed by the review itself. Prohibited commands (build, test, lint, migrations, database, browser, commit) were not run.

## Implementation (2026-09-29)

Owner: "تمام ظبط كل الملاحظات طبقا لافضل سياسات"; the environment is a test system, so no tool is built for old draft vouchers (approve them on the JV screen or reset the data). Policy recorded in backend block 15 *Journal posting policy* (0.24).

| # | Outcome |
|---|---|
| 1 | No-approval documents post on save (`SaveAndPostJVAsync`): Invoice (add, update, tax-advance allocation), Bill, Miscellaneous Invoice, PDC receivable clear/bounce, PDC payable mature, Customer Deposit use/refund. Approval documents keep draft + post on approve. Rental/lease/booking deposits create a Receipt, so they follow the receipt approval (unchanged). |
| 2 | Cash Deposit and Card Transaction Bank Transfer approval posts/unposts the JV through the resolver (the toggle also no longer re-approves when the JV id is missing). |
| 3 | PDC clearing posts the JV of the approved receipt. |
| 4 | `JournalVoucher.IsGenerated` (set by `NewJV`); the JV screen refuses update/delete/approve/unapprove/void for generated vouchers; Angular JV details treat them read-only like opening-balance vouchers (`isGenerated` on the detail/list VMs). |
| 5, 6 | `EnsurePeriodOpenAsync`: open fiscal year **and** open month (Month Close). Used by save, `PostAsync`, `UnpostAsync`, JV void and the void toggles of receipt, credit/debit note, cash deposit, card transfer. |
| 7 | Miscellaneous Invoice fails without a customer account, links `JournalVoucherId`, rebuilds the JV on update and removes it on delete. |
| 8 | Not changed: invoices have no charge lines, so revenue stays one account per invoice type (a correct entry). Backend backlog 17. |
| 9 | Cost center default/required applied on save and post. |
| 10 | `JournalPostingException` → 400 `Result` in the middleware; services with transactions catch it. |
| 11 | `GetPartnerAccountAsync` returns `int?`; the 17 callers use `(await … ?? 0)` so their existing `<= 0` checks stay correct. |
| 12 | `PostAsync` re-validates accounts, children, cost centers and balance. |
| extra | Invoice update/delete found the JV by a line-description match when the FK was empty, which could hit another invoice's JV — removed (FK only). Invoice update with a zero total removes the old JV. Bill update/delete now rebuild/remove the JV (they left it unchanged before); the bill pre-check read is untracked (it conflicted with the later `Update`). |

Migration (owner): `Add-Migration AddIsGeneratedToJournalVouchers` — new column `JournalVouchers.IsGenerated` (bit, default false). Existing generated vouchers stay `false` (test data).

Owner verification: build; create an invoice → JV posted and in the ledger; edit it → JV rebuilt and still posted; close its month → edit/delete refused; approve/unapprove a receipt and a cash deposit → the JV follows; open a generated JV on the JV screen → read-only; Close Job for a customer without a linked account → clear error, nothing saved.

## Follow-up 2026-09-29

- #8 re-assessed: generated invoices bill only the periodic rent (`Rate` × `Period`), so crediting the rent account is correct; extra charges are billed through the Miscellaneous Invoice, which splits by charge type. Backlog 17 reworded as a Link Accounts design question (module charge-type slots beyond rent are mostly unused). No change to invoice posting.
- PDC bounce checked: posted reversing JV against the still-posted receipt JV nets to zero; correct.
