| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-26 |

# Monthly Posting — frozen implementation handoff

Scope: implement screenshot-backed Prepare/Excel/Post over existing
ProvisionOccurrence. Owner supplied MonthlyPosting.png as the answer to the
posting-versus-report decision. This supersedes only the earlier deferral for
this page; definition Save remains nonfinancial. No application/database
execution, migrations, commits or unrelated source changes.

## API / source / numeric contract

Authenticated root /MonthlyPosting, dedicated IMonthlyPostingService with
PrepareAsync and PostAsync; SDK includes source and existing DI scan registers
the service. Do not add generic CRUD. All responses use Result<T>/Result.

GET prepare?month=yyyy-MM → Result<MonthlyPostingPreviewVM>:
month:string, previewKey:string(64), rows:MonthlyPostingRowVM[],
legacyCount:int, canPost:bool, moneyDecimalPlaces:int, currencyCode:string|null.
Row: occurrenceId:int, provisionId:int, provisionNo:string|null,
title:string|null, firstDate:DateTime, lastDate:DateTime, dueDate:DateTime,
amount:decimal|null, posted:bool, journalNo:string|null, issue:string|null.
No tenant/audit/client-editable finance fields in the preview.

POST post {month:string, previewKey:string(64)} → Result (Id optional).
On success frontend reloads Prepare; lost-response Retry only reads, never
repeats the mutation automatically. Server recalculates everything; no IDs,
amounts/accounts/dates/status/tenant supplied by client. Strict real month;
full calendar bounds via CalendarMonthBounds (December9999 inclusive supported).

Read selected month's actual live occurrence rows with tenant/live parent and
owned live template lines. Complete bounded array: maximum200occurrences and
10000template lines; fail explicitly before returning/writing on overflow.
Deterministic due-date/provision/occurrence order. LegacyCount counts active
tenant live definitions with no live scheduled occurrences; warning is explicit
and does not fabricate rows or block independently proven sources.

Prepared numeric amount is the sum of monthly template debit, never multiplied
or divided by months. Require >=2 owned live one-sided positive lines, matching
positive debit/credit totals, valid representable money and base-currency scale.
Source subtype must be JV or JVProvision, dates/order/schedule ownership and
active source valid. Effective posted owned journals remain posted rows; amount
uses retained posted journal debit total when available. Any other retained
journal link or legacy root journal/lease-owned schedule is a blocking issue;
no recreation/repost or link overwrite. Expose localized issue text with null
unproven amount where needed. No broad catch returning empty success.

## Explicit Post transition and integrity

Post means the user's final approval of all eligible unposted prepared rows.
Confirmation names month and number of pending rows. No separate editable
document or unsaved draft screen is introduced. It is not ordinary Save.
All posted -> idempotent success with no new entries; any issue blocks the
entire operation. Mixed posted/unposted snapshot must still match the full key
before any mutation. Fingerprint covers tenant/month, currency/scale, complete
source IDs/versions/fields/lines, journal identity/state and all read values;
serialize deterministically and invariantly. No financial-policy cache.

Lock order: JournalVoucherAllocation → Provision → ProvisionOccurrence using
existing ExecuteUniqueWriteAsync, one outer explicit transaction. Re-read and
validate after locks; template writers already acquire Provision.
Provision activation is already explicitly rejected by its existing service
override; preserve that unsupported-operation contract. Existing authorized
Add/Update/Delete writers acquire the Provision lock; no activation writer is
introduced for this screen.
One generated source-owned JournalVoucher per occurrence, with VoucherType JournalVoucher,
saved source subtype (JV or JVProvision), date=DueDate, base currency and null
branch (no template branch contract). Lines copy exact account/partner/job/
sublookup/description/debit/credit, with internally assigned child No to avoid
per-line document-number lookups. Genuine journal No remains resolver authority.
Use the resolver to save/post with all its period/reference/cost-center/money
guards; approval state/history are server-derived and reflect explicit Post.
Link tracked occurrence only within that same transaction. Mark semantic audit
Posted through the existing action context; preserve captured history. Exceptions
and failed Result roll back all intermediate saves. No fallback partial success.

Root integrates occurrence JV identities into both general-JV source guard
(including deleted history) and JournalReportSourceResolver source-kind
provision/root provisionId. Avoid counting the same occurrence root identity as
duplicate navigation provenance; genuinely shared/different sources remain
ambiguous and non-navigable. Generated JV edit/post/unpost/delete stay forbidden
through general JV. No financial schema/enum/AutoMapper change required.

## UI / loading / cache / guide

Route /MonthlyPosting lazily loads own workspace; showPageLoading:true,
sigma-route-host, shared editor workspace shell, no page scroll. User picks
current month; no implicit preparation/post on initial open. Form uses shared
FilterPanel inline labelled actions, typed month picker with bound mm/yy,
validation and Reset=current month+clear snapshot. Prepare, Excel and Post;
Post only from a valid current snapshot with canPost and unposted rows, disabled
while busy. Grid columns exactly provisionNo,title,firstDate,lastDate,dueDate,
amount,posted with minimum identity and optional explicit issue column.
Shared boolean/status formatting, Money/date types, local complete-array paging
and Excel same complete snapshot with translated columns. No hidden per-page
posting or client-calculated ledger values. Shared confirmation before Post.

All HTTP reads/writes are direct operational, no reference cache/lookup inputs.
One subscribed global loading owner paired with finalize and cancellable read
version fences/teardown; suppress local table masks and keep busy/aria-busy,
one feedback owner (inline errors via X-Skip-Error-Interceptor, global mutation
success). Keep errors/Retry. Tenant/user/branch-context change clears snapshots
and cancels stale reads; writes remain guarded by root transport policy.
Reset/month edit invalidates current preview. Export performs no extra HTTP.

Backend worker owns new backend DTO/interface/service/controller files only.
Frontend worker owns new MonthlyPosting feature + own vocabulary and guide
topic files only. Root owns router, locale registration, compilation entry,
guide registration/old wording, backend resources and existing JV integration.
No overlapping writes. Phases5/6 and complete scoped diff remain root-owned.
