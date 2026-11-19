# Bank reconciliation — Void and historical balances

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-06 |
| Authorization | Owner: “انا عامة هنا بعمل void مش بعمل قيد عكسى”; accepted latest-first Void and historical saved balances, then “تمام طبق” |

## Outcome, authority and scope

Extend the existing BankReconciliation aggregate and AccountReports service, working reconciliation screen and historical ReconciliationReport. Void retains master/lines/audit and releases matching capacity without creating/reversing/modifying journals. ReconciledBalance becomes the cumulative matched bank-account net through StatementDate; LedgerBalance is the posted nonvoid ledger net through that inclusive day (posted opening-balance JV already included); PendingEntriesBalance is the remaining unmatched net. Completion requires StatementBalance=ReconciledBalance and LedgerBalance=ReconciledBalance+PendingEntriesBalance. Persist actual account identity, bank name and ledger/pending snapshots when completed. Report reads those saved figures and includes void status/history.

Master1–7; BE1/2/3/5/6/8/14/15/17/18; UI7/10/13/19/20/21/22/23/26/27/28/29; PLAN00 and phases0–6 selected after all-eight recipe Check passed. Aggregate is pattern2 with a stateful matching reservation (no new journal), report remains pattern5; UI20/21 with explicit historical row Print/Void exceptions and typed UI13 reason dialog. CashDeposit.ToggleVoidCoreAsync illustrates shared write serialization/reservation release; AccountingPeriodService owns existing open fiscal/month validation. JobCloseComponent/EditorDialog supplies action-dialog shell and RentalAgreementVoidComponent illustrates typed reason/discard lifecycle; no reference business rules/styles copied. Existing source changes from prior tasks retained.

## Existing-state inventory / impact / gap decisions

| Area/owner | Current evidence | Target decision | Impact/phase |
|---|---|---|---|
| BankReconciliation entity/config | StatementBalance, selected-only ReconciledBalance/Difference; no real ledger snapshot/void | Extend with nullable account/name/ledger/pending snapshot, Void audit, domain completion method | schema, historical rows; 1/3/4 |
| BankReconciliationLine/config | Unfiltered unique JV detail; history is permanent reservation | Extend IsReserved defaulttrue; tenant+JV unique filtered IsReserved=1; Void updates reservation=false, keeps historical line | schema/index, safe reuse; 1/4 |
| AccountReports working read | All posted live nonvoid GL lines; all historical reservation IDs; last by bank only | Refactor shared account scope/eligible ledger query; only active reservations; return previousMatchedBalance for preview | DTO+working UI; 1/2 |
| CompleteReconciliationAsync | Compares selected net alone to cumulative bank closing; not serialized | Refactor server cumulative matched net, snapshot actual ledger/pending, verify identity; shared ExecuteUniqueWriteAsync<BankReconciliation> | state/calculation; 1/3 |
| Report read | Pending=statement-reconciled and ledger=statement proxy | Replace proxy with nullable stored snapshots; include IsVoided/CanVoid/HasBalanceSnapshot and status/availability columns | API+grid+output; 1/2 |
| Report Void action | No endpoint | Create POST AccountReports/BankReconciliation/{id}/Void body {reason}; service/interface/typed reason dialog | 1/4/5 |
| Auth/tenancy/UOW | AuthGuard/[Authorize], tenant repositories, ClaimTypes.Name audit, shared per-tenant entity application lock | Keep; server derives actor; complete and Void share lock and one SaveChanges per path | 1/5 |
| Journal writers/opening balances | Posted opening JVs already in ledger; no reconciliation-generated journals | Keep unchanged; no double-counting opening sources or reversal | accounting non-goal |
| Documentation | Previous report contract excludes missing business | Append owner-approved superseding handoff; keep historical exclusions as history | 0/1/6 |

## Options and owner decisions

| Option | Tradeoff | Decision/evidence |
|---|---|---|
| Hard/soft-delete reconciliation | loses explicit status or silently retains permanent reservation | Rejected; owner chose Void |
| Reverse original journals | changes actual movement although only matching was wrong | Rejected; explicit no reversing journal |
| Void master+release reservations | keeps audit/history, original ledger unchanged | Accepted by owner with latest-active-account first |
| Recompute historical report from current mapping/ledger | old output can change with mapping/backdating | Rejected for saved sessions; snapshot at completion accepted |
| Invent snapshots for pre-existing rows | cannot reconstruct past mapping or ledger at approval | Rejected; unknown snapshots remain null with visible legacy availability status |
| Allow older Void ahead of later active session | breaks cumulative matching dependency | Rejected; owner accepted latest-first |

## Frozen contracts and ambiguity register

| Contract | Exact target rule | Status/evidence |
|---|---|---|
| Account scope | Account resolved from payment method for new sessions, persisted BankAccountId thereafter; all active matches for that GL account participate regardless of bank label. Old account identity derived only if saved lines point to exactly one GL account. No current mapping is used to manufacture legacy snapshots. | Derived from GL line owner / approved same-account rule |
| Completion chronology | No active session for same account has a later StatementDate. Equal-date sessions are ordered by Id. Cumulative prior matched amount sums reserved historical line debit-credit once, plus selected eligible rows. No client totals trusted. | Frozen reviewer decision supporting latest-first |
| Empty selection | An empty distinct list is permitted when cumulative matched balance already equals closing balance (including genuine zero); null, duplicate/nonpositive IDs rejected. No fabricated journal line is required. | Reviewer decision under standing rule; same balance invariant |
| Eligible ledger/pending | live tenant JV details, account identity, live posted nonvoid JV, date <= inclusive statement day. Pending=sum eligible IDs not reserved and not selected; ledger=sum every eligible line. Opening sources not added again. Existing active snapshots drifting from current ledger are detected by ledger=matched+pending check and fail instead of inventing differences. | Source AccountReportHelper/working query |
| Snapshot | New nullable BankAccountId FK and BankNameSnapshot, LedgerBalance and PendingEntriesBalance decimal18,2 (private server setters); new completions supply all. ReconciledBalance cumulative, Difference zero. Old snapshots stay null; all three report balance fields null for incomplete snapshots, availability column explains why. Existing stored values retained in database. | Owner approval + no fabricated historical values |
| Void | irreversible IsVoided false->true; only latest active same-account session by date/Id; required trimmed reason max500; server UTC time/ClaimTypes.Name actor. Set all owned line IsReserved=false in one save; never delete lines or modify JournalVoucher. Already-void repeats return success without changing original audit or releasing later matches. | Owner approved; replay safety |
| Period | Completion/Void require the existing open fiscal-year/month policy via resolver; CanVoid reflects unique open fiscal year, no closed month and latest scope. No new role/permission API. | Existing financial period owner, no bypass |
| Reservation | IsReserved nonnull defaulttrue preserves old reservations; new filtered unique index (SubscriptionId,JournalVoucherDetailId) WHERE IsReserved=1 AND IsDeleted=0. Active reservation reads require live matching parent IsReconciled && !IsVoided and live line; Void changes reservation flag only. Shared lock protects participating writers. | BE2/8; new matching lifecycle |
| API read | GET routes/filter keys/wrappers/complete local paging retained. Session adds previousMatchedBalance. Report changes three balance fields to nullable and adds isVoided/canVoid/hasBalanceSnapshot for displayed/action needs. | All current consumers updated together |
| API action | POST AccountReports/BankReconciliation/{id}/Void; route ID positive, body reason only. Result wrapper, token/cancellation passed; local inline failure header, global single success toast. | Frozen before implementation |
| UI | Report five original data columns plus status and balance-availability; Void shown by row.canVoid and idle. Typed EditorDialog reason max500, title and record/date/bank subtitle, dirty discard, one request. Failure retains reason/dialog; success closes and refreshes captured applied filters preserving local page/size. Modal blocks report controls/output. Working preview=previousMatchedBalance+selected net and canReconcile permits valid empty selection. | UI7/13/20; owner action approved |

## Action coverage / transactions / compatibility

| Reference/action | Target classification | Reason |
|---|---|---|
| CashDeposit Void | Supported one-way | release matching reservation without journal effect |
| CashDeposit Unvoid | Not Applicable | irreversible cancellation; start a new reconciliation |
| Approve/unapprove/create/edit/delete/source capacities | Not Applicable | historical report does not own a cash-deposit aggregate or financial journals |
| Print / Excel / Search | Supported | prior complete-response/output contract retained with status |

Complete and Void run inside the existing ExecuteUniqueWriteAsync<BankReconciliation> boundary before validations/reservations. It deliberately serializes participating writes (BE8) despite one graph save. Each success path reaches one SaveChangesAsync and commits the owned transaction; failure does not commit; no hand-written transaction/SQL locking framework added. Ordinary reads use QueryReport; write validation/ownership uses Repository.Query/ExistsAsync.

Migration required, owner-run only: suggest `BankReconciliationVoidAndBalanceSnapshots`. Add columns/defaults and replace old unfiltered detail index; existing IsReserved defaults true, IsVoided false, snapshots nullable. Do not infer/backfill old financial figures. Owner must review soft-deleted historical line/parent anomalies before applying filtered index and validate rollout against current data. No migrations/snapshots/data commands generated or run. Deploy schema before application that selects new columns. Existing external report consumers must accept nullable balance values/new flags; no scoped additional consumers found beyond Angular target. Rollback application/schema requires preserving newly created history and reservations; never blindly drop audit/snapshot data.

## Implementation order, ownership and verification

Integration amendment frozen before its source edit: BE15's existing ConvertToGroupAsync moves every Account FK to the replacement posting child. The new BankReconciliation.BankAccountId FK must join that existing move list (two lines only, root ownership in AccountService.cs); balances/name/date/void history remain unchanged. This preserves matching scope when journal lines and payment-method account links move together. No standalone account refactor is authorized. API XML documentation's three bank-method descriptions are updated with the actual cumulative/snapshot/Void contracts, not unrelated report members.

Navigation amendment frozen before implementation: the new editable Void reason can be lost through route navigation, not just dialog close. UI10/13/26 require its dirty and in-flight lifecycle to cover route exit. Extend the existing `ReconciliationReport.routes.ts` with a typed CanDeactivateFn delegating to the report; the report delegates to its active ReconciliationVoidComponent. The dialog refuses navigation while saving/discard confirmation is pending and uses the existing shared discard confirmation for dirty idle forms. Frontend worker owns this one additional route file; no global guard/reference changes.

1. Freeze this plan and append domain/API amendment; then parallel non-overlapping backend (root) and frontend (bounded worker).
2. Backend entity/config/DTO, working read/complete, Void/interface/controller/report and localized resources. Frontend working preview/model + report model/service/dialog/actions/status/EN/AR.
3. Root integrates/reviews complete own scoped changes, nullable serialization, calculations/reservations/order/replay/teardown/refresh and UI reference conformance. Update feature review with final status and owner checks.

Source-only verification: recipe Check, scoped diff/check and merge-marker/import/type/route/DTO/relevant translation/resource checks. Owner runtime checks: migration/default/index review; first/second cumulative sessions, outstanding signed debits/credits, zero/no-new-matches, later-date rejection; latest-first Void/replay/audit; same-account different bank/method; two concurrent complete/Void attempts; closed month; legacy null snapshots; original JV unchanged; report/page/print/Excel/dirty failure recovery in EN/AR/RTL/themes. Builds/tests/lint/browser/database/migrations/commits/push/deploy prohibited for agents. Snapshot consistency against concurrent unrelated journal edits is an existing wider journal-writer coordination risk; not a claim of global ledger serialization.

## Implementation reconciliation — 2026-10-06

Frozen decisions above are preserved. Source implementation and final reconciliation are recorded in `RECONCILIATION_REPORT_FEATURE_REVIEW.md`, appended owner-approved Void/snapshot slice. All confirmed bounded findings were implemented. Runtime, compilation, schema rollout and owner acceptance remain pending; this is not Closed.

Final legacy identity audit corrected account resolution to a nonempty original-line set with exactly one nonnull account, including historical deleted lines. Shared active-account scoping now governs cumulative sums and chronology; report CanVoid repeats the same rule. Calendar-day ordering followed by Id is used consistently, including legacy timestamps. Both expected period failures (JournalPostingException and FiscalYearConfigurationException for overlapping open years) return localized Results.

Migration rollout detail: EntityBase.IsDeleted is nullable whereas the filtered reservation index includes only IsDeleted=0. The owner must review and normalize historical live NULL line flags to false as part of migration/data rollout so every live reserved line participates in the index; also inspect deleted-parent/live-reserved-line anomalies and release only confirmed inactive reservations. Do not invent old balance snapshots or indiscriminately release historical active reservations. No migration or normalization command was authored or executed by agents.
