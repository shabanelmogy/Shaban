# Accounts Budget and Journal contract freeze

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Existing contracts and approved fixes

Budget is an editable financial matrix, not a read-only report. `GET AccountReports/Budget` uses `Filters[fiscalYearId]` required and `Filters[accountType]` (Asset=1 default). The complete response contains months and leaf-account rows with accountId/code/name, monthlyAmounts and backend Total. `POST` accepts only fiscalYearId and changed `{accountId,year,month,amount}` entries; no totals. Read/save source: AccountReportsController, AccountReportsService GetBudgetAsync/SaveBudgetAsync and BudgetVm. Preserve changed-cell upsert, signed amount and two-decimal existing input contract. Draft totals remain previews; refresh server data after successful save. Typed controls, shared editable table/summary/title/actions/state/validation, load readiness/retry, safe dirty discard/navigation and applied fiscal-year identity replace the legacy raw table. Mandatory boundary validation checks fiscal-year/account existence, duplicate submitted keys, real months/years and membership in that fiscal year's calendar range before mutation. Reject non-posting/deleted account references; do not invent a new closed-year permission or lock. Use invariant existing MMM-yy labels, since the wire's numeric month/year mapping depends on them. Each named request/response DTO gets its own file in the same layer; wire unchanged.

Journal is an existing paged read: `GET AccountReports/Journals`, `PageNumber`, `PageSize`, existing Filters keys voucherNo/type/chassisOrPlateNo/fromDate/toDate/accountId. Result `Results<JournalLine>` retains date/accountCode/accountName/contact/type/voucherNo/plateNo/description/debit/credit and PageNo/PageSize/TotalPages, adds the already-computed authoritative TotalCount. Normalize number >=1 and size 1..100 (BE9); keep deterministic existing ordering and filtering semantics. No aggregation/formula redesign. Frontend uses typed shared report/grid, current-month local date range, inline failures with suppressed interceptor, latest read, controlled server paging, complete fetchAllPages export and applied filter snapshot. Preserve the existing ten columns; no invented totals.

## Reference conformance

| Concern | Book | Actual reference/symbol/value | Shared owner | Target |
|---|---|---|---|---|
| Budget editor rows | UI14/26/27 | Workshop/JobEstimation shared editable rows, fillHeight/stickyHeader and typed forms | EditableCollectionTable, FieldError/global numeric focus | Typed month controls; no local table/palette |
| Budget summary/actions | UI24/7/22 | shared SummaryCard descriptors and action/confirmation owners | SummaryCards/PrimaryActionButton/ConfirmationDialog | Draft preview only; final success after source reload |
| Journal shell/read | UI20/6/8/17/22 | CustomerStatement bounded report host, typed columns, money/date/export formatting | ReportPage/ReportActions/DataTable/date-utils/list-query | Preserve paged exception and complete export |
| Server boundary | BE3/8/9/17 | AccountReportsService existing producer; Math.Clamp size1..100 | existing controller/service/DTO layers | Validation and truthful paging metadata |

No screenshots, migrations, new entities, permissions or AutoMapper mapping. Root owns implementation and full scoped diff. Legacy JournalVoucherDetail remains an audit item until consumers prove removal safe.

### Source reconciliation amendment

GetBudgetAsync defines leaf by actual children (or level5), not solely AllowChildren. Boundary validation must use that exact existing rule so current childless level1-4 budget rows remain saveable. The earlier shorthand "posting" is narrowed to the source-proven active leaf contract; no new accounting restriction.

Budget month labels contain only a two-digit year, so the original frontend assumed 2000+yy and could save historical centuries into a different year. Add read-only `periods: {label,year,month}[]` alongside existing months; producer derives these from the loaded fiscal year and client uses them for numeric save transport. This is compatible response metadata with no persisted fields, migration or formula change. Dirty tracking compares actual inputs independently of metadata parsing; a missing mapping blocks Save visibly instead of dropping cells.

### Orphan child-root disposition (source evidence)

Symbol/path-specific consumer inventory of `JournalVoucherDetailService`, `Accounts/Journal/JournalVoucherDetail` and route literals found only its own files, one direct route and layout provider registrations. No menu, shortcut, Accounts report, Vouchers consumer or explicit compile root uses it. Its list renders restaurant SKU/category/loyalty placeholders and its create payload exposes audit/tenant fields. Canonical Vouchers/JVs owns journal details under the journal aggregate and remains untouched. Remove this unused frontend scaffold plus only its route/providers; retain backend endpoints and all accounting data. This is source cleanup, not data destruction or a permission change. A duplicate later LinkAccounts route points to HRM legacy and is shadowed by the earlier Accounts owner; remove the unreachable duplicate registration, preserving HRM source.
