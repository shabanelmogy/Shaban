# Journal register — posting badges/filter and source navigation

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Frozen contract: JOURNAL_STATUS_SOURCE_DOMAIN_API_CONTRACT_FREEZE.md, including
the later limousineSingle registry clarification. Initial Journal/Ledger
comparison was source-read-only; subsequent owner requests explicitly authorize
badges/filter, opening movement source and next-row actions. Other existing
report changes and working-tree edits preserved. No screenshot for this slice.

## Existing-state comparison and scope

Both reports read JournalVoucherDetail. Ledger requires one account, includes
only posted nonvoided live journals, adds pre-period opening balance and running
balance. Journal is a paged line register across accounts, optional account
filter, no opening/running balance, and previously included every live journal
state without showing it. That population ambiguity is now explicit with badges
and the new filter; default still shows all states. Journal is not a second
Ledger and not a complete balanced-entry view when account/line filters apply.

Observed but NOT changed: Journal flattens lines without grouped voucher totals;
it has no branch/cost-center filters. Both methods use existing inclusive date
comparisons against date-only end input, risking final-day time exclusion;
vehicle matching differs (Ledger matches No/Description and returns Vehicle=null,
Journal matches SubLookUp/Description). Ledger original-currency limitations
are already related to backend19's deferred exchange-rate item18. Journal's
existing full-result materialization before grid filtering/paging remains.
These are not claimed resolved by this bounded status/source request. No actual
company data was inspected. No new source defect was inferred from runtime.

## Final contract reconciliation

| Path | Producer and consumer | Source result |
|---|---|---|
| Posting state | GetJournalsAsync projects PostingStatus from parent JV, voided precedence; JournalLine typed string union | posted iff IsPosted and not IsVoided; unposted iff both false; voided iff IsVoided irrespective of IsPosted. Badge tones success/warning/danger. |
| Filter | Journal reactive form postingStatus → appliedFilter → existing toFilterParams → Filters[postingStatus] | Empty/absent all, accepted strings normalized; other strings return IsSuccess=false. SQL predicate precedes materialization/count/page. Reset clears status. |
| Column filter and paging | DataTable status filterOptions stable values; GridFilter.Apply on projected PostingStatus | Exact raw status before paging. Source/navigation metadata excluded from grid filters. Existing page1 reset/count/1–100 clamp retained. |
| Output | Existing fetchAllPages with snapshot → dataTableExportRows | Full matching Excel rows, translated badge text included. Existing all-state or selected status retained on every page. Journal still has no new Print action. |
| Source identity | JournalVoucherId plus SourceKind/SourceId; JournalReportSourceResolver | Ten source families, tenant-scoped live reverse FKs, distinct current-page journal IDs, no number parsing/no per-row query. Zero/multiple/unsupported sources leave metadata null. |
| Original navigation | journalOriginalSourcePath/journalMovementPath; voucherNo DataTable.link | Allowlists known routes and positive identities; invoices reuse invoiceViewPath/INVOICE_ROUTE_REGISTRY. Unknown keys cannot access object prototype routes. |
| Fallback | Actual JournalVoucherId → /JournalVoucher/details/:id | Existing voucher detail when original unavailable, deleted, unsupported or ambiguous. Accessible label distinguishes original source from voucher fallback. Missing voucherNo uses real journal ID display. No navigation creates/posts data. |
| Source invoice discriminator | Resolver matches InvoiceProfiler subtype/Module/InvoiceCreatingType precedence | Rental, lease, advance tax, workshop/miscellaneous, limousine bulk/single, equipment and transportation select correct owners. Unknown core type remains fallback; no default-rental guessing. |
| Layout | Journal form six-track template; sigma-field--full action wrapper | Six regular fields, then existing four actions on next full row; no blank auto track or reserved caption. Shared1250px three/640px single fallback preserved; no CSS change. |
| Guide | New Journal topic in ACCOUNTS_GUIDE | EN/AR, /Journal, all states versus posted-only Ledger, clear/reset, source fallback, filtered partial entries and complete Excel. Required notes supplied; reader/menu reused. |

Grid/DTO match: date,accountCode,accountName,contact,type,voucherNo,postingStatus,
plateNo,description,debit,credit are displayed/exported; journalVoucherId,
sourceKind,sourceId are minimal navigation metadata. No raw IsPosted/IsVoided
duplication, tenant/audit/write inputs or ListVM inflation. Existing paged
Results<JournalsLineVm> and GET route retained. No AutoMapper change because
this read model uses an explicit projection. No new entity/EF/schema/migration.

## Changed files and conformance

Backend: AccountReportsService.cs GetJournalsAsync only for this slice;
JournalsLineVm.cs/JournalsRequestDto.cs; new JournalReportSourceResolver.cs,
JournalReportSourceCandidate.cs and JournalReportSourceReference.cs, each named
type in its own AccountServices file. Existing larger AccountReportsService diff
belongs partly to earlier owner-authorized statement work and was preserved.

Frontend: Journal models/journal.ts and new journal-source-navigation.ts;
Journal component TS/HTML; EN/AR journal vocab; ACCOUNTS_GUIDE; one explicit
runtime entry in tsconfig.app.json, no broad include or spec source entry.
Existing Invoice route registry and source modules inspected, not modified.

| Concern | Owning reference | Final conformance |
|---|---|---|
| Report read | BE3/9/17; existing GetJournalsAsync/controller | Same typed wrapper, paging/tenant boundary, status filtered before paging; bounded page source enrichment |
| Badges/link | UI5/6; DataTableStatus/CellLink, dataTableCellText/export | Shared status rendering, stable filter values, native link guard and accessible label; no private badge markup |
| Filters/actions | UI4/20; shared global report strip and StaffStatement full-row actions | Existing full grid span/template API, no feature CSS; reactive form/busy/errors remain |
| Routing | Existing owning feature routes and invoice registry | Router via root provider; source-derived allowlist only; no new route/permission API |
| Guide/translation | Master7/UI23, GuideTopic/GuideReader | Both languages, registered accounts guide/module sidebar unchanged |

One bounded sol worker owned backend after contract freeze; root owned frontend,
source-route discovery, guide and integration. Separate files permitted parallel
work without merge risk. Root then added confirmed single-limousine mapping
after worker completion and reviewed all new resolver types and final diffs.

## Source verification and pending owner acceptance

Reviewed new SDK type inclusion/global usings: all new resolver types share
SiGma.Business.Services.AccountServices with consumer; EntityBase source families
come from existing Business GlobalUsing and project references. Repository.Query
applies subscription and live-row filters; no source read writes. EF projection
uses existing inheritance predicates/casts as InvoiceProfiler; cancellation
tokens propagated. Controller maps typed failures to400 as before. Interface/
constructor/DI unchanged. No speculative dependent-namespace fixes.

Root source reasoning (not executed tests): false/false→unposted, true/false→
posted, either/true→voided; each filter is disjoint, null includes all. Repeated
lines from one JV receive one consistent source; same displayed No on different
records does not affect matching. Cross-tenant/deleted source candidates absent;
two candidates fallback. Unknown route keys fallback, never inferred from No.
Known limousineSingle uses its existing registry owner. Source resolution runs
after page slice and is independent of status/grid membership and counts.

Scoped git diff --check and merge-marker/namespace/typed DTO review passed.
No builds/tests/lint/browser/DB/migrations/snapshots/commits/push/deployment.
No canonical/skill change: these are feature-specific decisions under existing
patterns; final recipe Check all8 OK. Applied0/1/2/5/6; no editor/action phase.
No Missing business contract remains. Runtime/provider/visual proof pending.

Owner checks: compile both projects; browse all three states and combined
status/column/account filters across pages and Excel; reset/clear/error paths;
all source kinds, duplicate/missing/deleted source fallback, positive navigation
IDs and correct invoice owners; actions row in desktop/narrow, keyboard, EN/AR,
RTL/themes. Check EF inheritance SQL translation and large-ledger performance.
Source modules retain existing write guards; UI navigation is not authorization.

Suggested owner commits (stage only this slice):

- Backend: `feat(journal): expose posting state filters and verified movement sources`
- Frontend: `feat(journal): add posting badges source links and separate action row`

## Owner-reported inheritance compilation correction — 2026-10-23

Owner compiler reports TS2415: JournalComponent privately redeclared router,
which BaseComponentService already provides as protected readonly. Removed the
duplicate field and now-unused Router import; openMovement continues through the
same inherited router. Root checked the actual base declaration and remaining
subclass fields against it (loading, activatedRoute, subscriptions are not
redeclared). No shared base, route, status/source contract or guide behavior
changes. TierS producer-type correction; scoped diff and whitespace reviewed.
Recipe Check all8 OK. No builds/tests/lint/runtime/browser/DB/migration/commit.
Owner compilation verification remains pending. Suggested scoped frontend
commit: `fix(journal): reuse inherited router for source navigation`.

## Owner-reported undefined badge — 2026-10-23

Observed owner text: journal.postingStatuses.undefined. This establishes that
the badge callback received an absent postingStatus; it does not establish the
actual journal's posting state. Current backend GetJournalsAsync sets the
closed status for every projected line and controller/service use that same
response. Shared DataTable's lazy body passes the original row to statusOf;
there is no feature mapping that removes this field. Actual runtime payload
was not available: root requested one response row asynchronously. An older
running backend or another response mismatch remains an inference, not a
verified cause. No runtime or database access authorized/performed.

Bounded source correction: replace interpolated badge key with explicit
posted/unposted/voided cases in postingStatusBadge and a neutral, translated
Status unavailable fallback. EN/AR key added and current accounts Journal guide
explains that unavailable is not Unposted. Screen and Excel share the same
callback. API status union, saved data and filters remain unchanged; unavailable
is a presentation fallback, not a new accounting state or filter value. No
silent defaulting from a missing value to an unposted state.

Owner must verify the running API response has postingStatus and restart the
updated backend if the running version lacks the added field, then rerun the
report. Root did not claim the runtime cause fixed without that evidence.
TierS source repair, no delegation. Type export DataTableStatus checked in
shared owner; diff/whitespace reviewed, recipe Check all8 OK. No builds/tests/
lint/browser/DB/migration/commit. Suggested scoped frontend commit:
`fix(journal): handle missing posting state without exposing translation keys`.
