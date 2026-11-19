# Customer deposits — screen contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |
| Scope | Tier M: finish the customer-deposit list and screenshot-proven actions using the existing financial source owners |
| Authority | Owner: «راجع شاشة Deposts وانشي المتبقى» with Deposit1.png, extend.png, Transfer.png; Master1–5/7; UI list and action-dialog catalog |

## Discovery and decisions

The existing vouchers menu incorrectly points Deposits to `/CashDeposit` (bank cash lodgement). CustomerDeposit has a server controller, source wrapper, financial actions, mapping and DTOs, but no standalone Angular screen. Both scoped repositories were clean. Keep bank cash deposits and all existing financial writers; create `/CustomerDeposit` and change only the vouchers customer-deposit link. UI shape: canonical Job list shell plus type09 shared action dialogs. Backend: existing financial-source wrapper (pattern3 exception), not independent receipt CRUD. No new approval, permission, posting, delete or creation workflow.

Recipe check passed for all eight packets. Applicable packets: 00, 01, 02, 04, 05, 06. Phase3 record editing is not present in the screenshots; no generic editor is introduced. Screenshot metadata: desktop English LTR; role, capture date and version unknown.

| Evidence | Classification | Approved behavior | Representation |
|---|---|---|---|
| Deposit1 | Explicit | Deposit/agreement number, type, customer, date range; All/In-Hold/Expiry Today/Due To Return | Typed shared filter panel; Reset; applied query snapshot |
| Deposit1 | Explicit | Actions, number, type, date, expiry days, customer/code, agreement, status, amount, used, refunded, balance | Shared remote paged table; authoritative count; stable descending Id |
| Deposit1 | Explicit | Report, Used Deposit Report, Excel | Complete matching filtered rows fetched by shared finite all-pages helper; shared report/print shell; used report selects actual usage-positive deposits |
| extend | Explicit | Record number, old/new hold days, Cancel/Save | Shared controlled typed action dialog; current old days from live context |
| Transfer | Explicit | Current/target agreement, amount, Cancel/Save | Shared controlled typed action dialog; target agreements from same customer's live source |

## API handoff

Root: `/api/CustomerDeposit` through existing authenticated controller conventions and root HttpClient.

| Operation | Contract |
|---|---|
| GET Search | Existing SpecificationRequestDto: PageNumber (1+), PageSize (10–100); Filters[depositNo,agreementNo,customerId,paymentMethod,fromDate,toDate,status,expiryToday,dueToReturn,usedOnly]. Blank/null omitted; status0 and false preserved. Return Results<CustomerDepositListVM> with real TotalCount/TotalPages. Stable Id descending; no remote sort/filter promises beyond the explicit screen filters. |
| GET Types | Results<string>: distinct existing source payment-method/type labels; direct operational source, no cache opt-in |
| GET ActionContext/{id} | Result<CustomerDepositActionContextVM>: id, depositNo, expiryDays, agreementId nullable, agreementNo nullable, amount, canExtend, canTransfer; current source data, tenant checked |
| GET TransferAgreements/{id} | Results<DropdownDto>: id/name of agreements owned by the same customer, excluding the current agreement; live operational choices, not reference cache |
| POST Extend/{id} | Existing ExtendDepositVM {newExpiryDays:int32 positive}; retain existing source transition/transaction; return Result |
| POST Transfer/{id} | Existing TransferDepositVM {toAgreementId:positive int32,amount:positive decimal}; current implementation moves the entire source agreement link. Display full source amount read-only and validate exact equality server-side; partial monetary transfers require a separate owner-approved accounting contract. Reject same agreement, foreign customer and existing use/refund history. |

Grid fields beside ListVM: depositNo/DepositNo, paymentMethod/PaymentMethod, date/Date, expiryDays/ExpiryDays, customer/Customer, customerCode/CustomerCode, agreementNo/AgreementNo, status/Status, amount/Amount, used display (`UsedAmount - RefundedAmount`), refundedAmount/RefundedAmount, availableAmount/AvailableAmount. Id, IsVoided, CanExtend and CanTransfer are minimum row-action state. Keep existing source identities where another source consumer is verified; otherwise remove excess list fields. Backend owns amount, consumed total, refund residual and available balance. Refund residual = consumed total minus live CustomerDepositUsage total; no new persisted money or schema.

Due To Return is a read-only maturity bucket: nonvoid InHold/Expired with positive balance and source date + expiry days on/before server today. Expiry Today retains InHold and equality to server today. Opening-balance source date uses the same CreatedAt fallback as the existing mapper; PDC date/agreement must match its actual source. Date ranges use inclusive days (exclusive next-day upper bound). Do not mutate financial state from a filter.

## Reference and shared-owner conformance

| Concern | Book | Reference/shared owner | Target |
|---|---|---|---|
| Route/list geometry | UI1/3/6 | Job list; sigma-route-host/list-page/list-panel/header/table; FeatureTitle/DataTable | Same host and flex/scroll chain; no feature skin |
| Filters | UI4/16/17/19 | Job list; FilterPanel, date directive, FieldError | Stable layout, labelled controls, Reset, busy and validation |
| Actions | UI7/13/19 | Job close-job; EditorDialog, confirmation service | Record subtitle; typed controls, dirty discard, pending write exit protection |
| Cache | UI2 | CustomerService cacheSelect; ReferenceLookupBindings | Finite bootstrap then once-bound watch, selection retention, context clear, Retry/teardown |
| Loading | UI22/28 | LoadingService + Layout host; StateMessage for overlay reads | Global list/export/write, local auxiliary/dialog read, exactly one visible owner |
| Reports | UI20/21/8 | Shared ReportPage/print owner, DataTable, dataTableExportRows | Complete applied scope; preserve failed read errors and Retry |

## Limits and verification

### Handoff correction — 2026-10-26

Actual public-contract inspection found that the existing `DropdownDto` exposes `Id`, nullable `Value`, and nullable `No`, not `Name`. The TransferAgreements response is therefore `Results<DropdownDto>` with JSON `{id,value,no}`; the target selector renders/filters `value`. This corrects the earlier descriptive `id/name` wording without introducing a competing DTO. UI and backend implement the same corrected handoff. Nullable source labels in row/action TypeScript contracts match the actual backend nullable strings.

UI17's normal initial/Reset date default is the current month; an explicitly cleared range remains all dates through the `dateRange=all` route marker. This is a view/filter default, not a restriction on stored history. Search transport adapts the shared `pageNo` serializer to the existing Search endpoint's exact `PageNumber` binding, while retaining `pageSize` and `Filters[key]`.

The actual controller uses `[Route("[controller]")]`; all operation URLs above are relative to `environment.baseUrl + 'CustomerDeposit'`. The earlier `/api` prefix was descriptive and is not hard-coded or required by this controller. Source reconciliation removed unused declared list `CustomerId`, ReceiptId, PDCReceivableId, OpeningBalanceDepositId and JournalVoucherId after confirming no consuming screen uses them. Canonical BE3's existing ListBaseVm inheritance is retained; its inherited plumbing is the known BE19 backlog, not silently redesigned in this screen task.

Use/Refund/Journal/delete/add/edit server operations are inventoried but not exposed by these three captured states; their financial workflows are retained with their current owners, not redesigned. Approval and access restrictions are not inferred. No schema, migration, database, build, tests, lint, browser, commits or pushes. Source-only reconciliation, performance/index proposals, bilingual in-app guide and owner manual checks are required in the feature review.
