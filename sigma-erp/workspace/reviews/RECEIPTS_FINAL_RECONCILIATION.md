| Item | Value |
|---|---|
| Status | Implemented — source-only; schema and owner acceptance pending |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Receipts final reconciliation

Current contract: RECEIPTS_DOMAIN_API_CONTRACT_FREEZE.md. Detailed evidence,
files, phased decisions, cache/loading/query/index matrices and owner checklist:
RECEIPTS_FULL_STACK_REVIEW.md. The screenshot styling is not the layout owner.

| Gate | Final source evidence | Remaining acceptance |
|---|---|---|
| Party | Partner storage; Individual/Company customer types, Staff only for staff receipts, chosen credit account for General. UI and writes use authoritative eligible parties. | Owner checks each type and historical incompatible party. |
| List | Exact flat columns/typed ListVM, count before sort/page, custom named/grid filters, server flags, complete applied export/report; no per-row detail reads. | Real counts, SQL translation, concurrent export data changes and numeric workbook values. |
| Editor | Shared full-width routed shell and preserved embedded API; typed fields, BankId/card/source contracts, full selected allocation snapshot, tracked documents, saved-snapshot print. | Desktop/mobile/sidebar/RTL/theme and print matrix. |
| Accounting | Existing Save=draft, approval=post; debit target ↔ receipt partner-credit allocation; server money/context/capacity validation, paired allocation and same transaction/lock order. | Owner inspects expected gross two-line JV and actual allocation rows after migration/build. |
| Decisions | Shared status tab/dialog, persisted reasoned history, terminal reject, guarded unapprove/void, retained legacy route restrictions, no invented reversal or legacy history. | Period closure, active allocations, source ambiguity and competing writes. |
| Compatibility | Source-generated cheque/deposit/card cases remain read-only as applicable; no legacy credit-note target migration. Existing old allocation endpoint remains a compatibility read, unused by new UI/write paths. | Existing sales/rental/lease/quotation embedded flows and representative history. |
| Mapping/types | Explicit computed flag ignores, source namespaces/global imports and project references checked; Result.id and actual flat labels aligned. Root read proposed party/branch without incompatible saved receipt ID. | Backend/frontend compiler, DI and AutoMapper runtime verification. |
| Loading/cache | Actual route and shared progress host traced; global page/financial reads/writes, local lookups/body dialogs, silent retained reference refresh. Per-source classification/watch/failure/context evidence in review. | Browser visibility, cancellation overlap, cache network/tenant behavior. |
| Performance | Scalar projection, batched≤100 action flags, bounded500 receivables/10000 usage, split aggregate reads, no per-child numbering reads for internal children. Existing index coverage and exact proposals/costs recorded. | Comparable five cold/five warm samples, SQL/logical reads/plans and deployed index audit. No speedup claimed. |
| Guide | New bilingual receipts-topic.ts registered with existing record-list topics and vouchers-cash guide. | Owner opens guide from Receipts and Payments menu and verifies navigation. |
| Syntax/source diff | Roslyn32 C# files zero syntax errors;52 referenced localization keys present in both XMLs; TypeScript/Angular12 files zero parsing/local-import issues;83 new bilingual keys matched; scoped whitespace checks pass. Root reviewed scoped changed/new files; unrelated changes preserved. | These are source checks only; compiler/build/tests/runtime remain pending. |
| Recipes | Final read-only Check reports all eight packets OK. No feature-only canonical rule was invented; no generated packet edited. | None for source drift check. |

DDAS import is explicitly unsupported: screenshot supplies an action name only,
without a file/API/validation/duplicate contract. No fake importer or guessed
financial import was added. This gap is separate from completed source paths.

Schema handoff: owner runs `Add-Migration CompleteReceiptReceivablesAndApproval`,
reviews and applies the generated migration through normal deployment. New
schema includes Receipt.CreditAccountId and void audit fields,
ReceiptAllocationDetail.TargetJournalVoucherDetailId/VoucherType and restricted
FK, plus ReceiptApprovalLog and its tenant/receipt/time index. Keep legacy FK and
historical data. The API now reads that new schema, so migration must precede
runtime verification. No migration/snapshot/database command was run here.

Suggested backend commit: `feat(receipts): complete receivable allocation and approval lifecycle`.
Suggested frontend commit: `feat(receipts): complete receipt workspace actions and user guide`.
Suggestions only; nothing was committed, pushed or deployed. No build, test,
lint, browser or application execution was performed under the source-only rule.
