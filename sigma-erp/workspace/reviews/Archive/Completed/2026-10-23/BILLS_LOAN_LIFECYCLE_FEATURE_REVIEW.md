# Bills — loan lifecycle implementation review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Plan | BILLS_LOAN_LIFECYCLE_MAINTENANCE_EVOLUTION_PLAN.md (Frozen) |
| Contract | BILLS_LOAN_LIFECYCLE_CONTRACT_FREEZE.md (Frozen) |

## Manifest and evidence

Owner requests implementation of the best proposed separation between installment Pay, Reschedule and Early Settlement; reference program may contain mistakes and logical validation is mandatory. Screenshots221133/2211333 prove loan-balance/settlement form content and an action label, not a correct schedule, reschedule implementation, accounting rules or per-vehicle attribution. Prior owner-approved full-payment rule and current explicit authorization govern new accounting; conservative financial limits are recorded in Frozen contract. No unresolved principal writeoff/fees/rate amendment is implemented.

Scope: Bill source-owned loan schedule revision/settlement, related original-plan/EMI/domain/EF/read DTO/profiles/service/controller/guards, saved installments UI/action/history, transport/models/explicit Angular entries/translations and owning guide. Main Bill list/filter/report/export remain unchanged except authoritative parent refresh. Very dirty application repositories include prior owner/peer work; no cleanup/revert/migration edits permitted.

Selected shapes: financial document UI08/BE15, controlled nested action forms UI09/13, read schedule/history through shared DataTable/UI5. Actual approved action-dialog reference is Workshop/Job/close-job; shared EditorDialog/FieldError/FormSection/LoadingService/confirmation and current typed Bill payment flow inspected. No generic CRUD for revisions, no permission API and no separate menu/page.

## Reference conformance and decisions

| Concern | Owning block/reference/shared owner | Target decision |
|---|---|---|
| Domain action | BE15 / original Bill InstallmentPayments and resolver | Keep principal liability, interest expense and recovery bank ownership, idempotent PV/link/principal allocation; settlement reuses that engine |
| Typed action dialog | UI09/13, actual Job close-job, shared EditorDialog | Separate reschedule/settlement modes, title plus record subtitle, readonly server preview, valid input/dirty/closing gates |
| Grid/schedule | UI5, shared DataTable declarations/template | Keep existing ordinal/date/EMI/interest/principal/status/PV/directPay, active rows only; history contains actual archived/new row generations |
| Number validation | BE15 / LoanPaymentPlan domain and FinancialNumberPolicy | Principal conservation, nonnegative bounded explicit interest, floor/last remainder, no zero-principal row, exact gross/scale/storage bounds |
| Version and persistence | BE15 source transaction / existing UoW allocation then PR lock | Append-only revision/FKs, fingerprint replay, stale current-source hash, all settlement changes atomic |
| Loading/error | UI7/22/28 / current Bill Pay form | One global counter with finalize, inline declared and HTTP errors, retained draft/retry, no duplicate toast |
| Lifecycle | existing Bill correction/source guards | Revision history blocks destructive generic correction; paid history immutable; flag-only Void unchanged |
| Guide | Master7, existing Bills topic in Vouchers reader | Explain steps, limits/history, source versus cash and separate loan status from Bill balance |

Action inventory: existing Pay retained; new Reschedule Prepare/Confirm and Settlement Prepare/Confirm supported; read Revision History supported. Job close-job domain-specific invoice creation is Not Applicable (no Job closure/invoice creation). No generic edit/delete/archive-row action or asset settlement added. Main Bill actions/approval/Journal/Allocation are not reimplemented.

API, read/write and action-state matrix is the companion Frozen contract. Derived amounts/flags/audit/status are server-owned, input payload contains only requestId/version/date/reason and count/first-date or agreed interest. Effective schedule header updates are domain-owned; no reprice of original Bill/VAT. No gratuitous generic overrides or ReverseMap; new computed read fields assigned/ignored only as required.

Phases0/1 discovery/freeze complete,2/3 scoped reads/forms,4 source domain actions,5 typed transport/parent refresh,6 integration/source reconciliation. No broad unrelated screen rebuild. Initial all8 recipe checks pass. Backend worker inherited model owns backend; frontend worker inherited model owns frontend/translations; bounded financial auditor gpt-5.6-sol read-only; root owns contract/docs/guide/integration. Disjoint ownership reduces wall-clock time on independent stacks; root reconciles all output.

## Final reconciliation

The implementation matches the Frozen action/read/write contract. Owner migration needed `AddBillLoanScheduleRevisions`, following existing installment payment link schema. Agent never generates/edits/applies migrations or snapshots. No build/test/lint/browser/runtime/database/commit/push/deploy commands. Source syntax/diff/XML checks do not establish compile/runtime/visual correctness.

Documentation maintenance: BE15 adds Audited loan schedule revisions, with skill digest and revision-history row in the same task. The original payment contract has a later-scope pointer rather than a silent rewrite. Generator refreshed phase01-domain-api, phase03-detail-write and phase04-domain-actions; all8 final drift checks pass. Changed BE15 dependency hash matches current source rules, and approved InvoiceService/Job/shared reference roles remain unchanged; unrelated pre-existing canonical/template hash differences are preserved. No generated file edited manually.

### Producer/consumer and financial reconciliation

| Slice | Final source evidence | Result |
|---|---|---|
| Read/action state | LoanPaymentPlanDetailAsync → LoadSavedInstallmentsAsync → saved summary + PopulateLoanRevisionHistoryAsync → PopulateInstallmentPaymentValuesAsync → PopulateLoanLifecycleValuesAsync | Exact same active row generation and server flags in viewer; original unknown history remains a read/review state, no fabricated Paid/PV |
| Prepare | Four exact controller/interface/typed frontend method routes match contract; PrepareLoanChangeAsync validates source, date, reason, version, interest/count and real capacity | Read-only response before/after/rows with current precision, no cash/revision reservation |
| Revision write | LoanCommitAsync allocation→PurchaseRequest unique-write locks → CommitLoanChangeCoreAsync tracked owned plan/active rows → ApplyRevisedActiveTerms → append revision/archive unpaid/create replacements | Paid row ids/dates/money/PVs unchanged; original principal/rate/finance terms retained; effective header totals domain-owned |
| Cash settlement | Same commit calls extracted SaveInstallmentPaymentAsync inside existing outer transaction | Original supplier principal debit + agreed InterestExpense debit + recovery-bank gross credit, real Payment/link/principal-only pair and Paid transition; all intermediate saves roll back together on failure |
| Exact capacity | Existing state proves actual header/detail ownership and effective allocations; lifecycle requires remaining scheduled principal == PrincipalCapacity | No min/trimming/implicit down-payment/overpay. Generic next-Pay weaker capacity rule does not become lifecycle eligibility |
| Replay | Retained unique revision/request fingerprint, full saved source/history proof, active source and exact current capacity; settlement verifies real replacement EMI/link/PV | Same request returns original durable result, conflicting reuse rejects409, no extra cash. Missing interest cannot silently waive interest |
| Dates/rounding | SavedInstallmentSummary verifies effective count/calendar distinct dates/first-header identity; domain PrepareRemainingSchedule checks precision/storage and positive principal/EMI, floors shares/exact remainders | Logical inputs and current historical generation validated before archival; selected date/period and prior payments/revisions revalidated |
| Version | LoanVersion hashes current rows, payment evidence, revisions, source/capacity and MoneyDecimalPlaces | Concurrent payment/allocation/revision and precision changes cannot commit the old displayed distribution |
| History | Actual CreatedByRevisionId/SupersededByRevisionId, generation membership proof, saved before/after amounts and real row ids | Replaced Unpaid rows retained, active mapper/report queries exclude them. Later Paid states do not rewrite original generation terms |
| Loan state | Full payment-history state supports all-paid case before current cash-role validation; loan status checked separately from Bill settlement | Settled only from real paid proof and zero reconciled loan remainder/capacity; no equality between Closed and loan Paid |
| UI | BillLoanChangeComponent and BillLoanHistoryComponent use shared controlled EditorDialog/DataTable/FieldError; direct Pay kept | Preview invalidated by input changes, exact request comparison before commit, stable same-input retry id, busy/inert/discard/destroy/stale guards and both inline failure channels |
| Parent refresh | New changed:void viewer event for Pay, Reschedule and Settlement; list/details mark refresh pending, refresh on outer close | No fake PaymentId for a reschedule; actual paymentCommitted remains actual PV identity only; no child unmounted by premature parent reload |
| Correction/source guard | BillsWithoutCorrectionDependencies checks retained revisions alongside existing retained payment/DN history; no public plan/EMI mutable controller found | Bill edit/UnApprove/reapproval cannot overwrite revised source; original flag-only Void policy preserved |

Mapping decisions: only computed read values use additional Ignore assignments in LoanPaymentPlanProfiler, then service-populated values. LoanEMI revision FKs map by ordinary read names. No new ReverseMap or unnecessary generic CRUD override introduced. Explicit domain-action methods and controller routes are justified by the new state transitions; unrelated existing controller/service overrides are preserved.

### Grid/read fields, routes and scope

Main Bills grid, filters, export and report contract are unchanged. Active installments grid remains ordinal, date, EMI, interest, principal, status, actual paymentNo and existing direct canPay button. New saved-plan fields are only the rendered loanStatus, canReschedule/canSettleEarly, actionVersion/moneyDecimalPlaces needed by action form and revisionHistory used by History. A revision row displays revisionNo, kind, date, reason, createdAt, createdBy; id selects it. Its before/after summaries display principal, interest, amount, emiNo, firstDate, endDate. Archived/replacement rows display ordinal, actual saved id/date/principal/interest/EMI/status/paymentNo; revision FKs prove history ownership. No tenant or client-writable derived balance field is added.

Existing feature `/Bill` and Vouchers guide reader `/UserGuide/invoice` stay; no new route/menu/provider. New runtime TS entries are explicit in tsconfig.app.json (model and two standalone dialogs), no broad include/spec registration. No permission mechanism is invented; server visibility is presentation, backend revalidation remains authoritative.

### Files changed

Backend repository `F:/My Work/Sigma/SigmaBackend`:

- New `SiGma.Business/Services/VouchersServices/BillService.LoanLifecycle.cs`, `BillService.LoanHistory.cs`; extended existing `BillService.Installments.cs`, `BillService.InstallmentPayments.cs`, `BillInstallmentPaymentState.cs`, `BillService.Unapproval.cs`.
- New `SiGma.Helpers/Models/Vouchers/LoanScheduleRevision.cs`, `SiGma.Helpers/Enum/LoanScheduleRevisionKind.cs`, `LoanStatus.cs`, `SiGma.DataAccess/Configuration/LoanScheduleRevisionConfig.cs`; extended LoanEMI model/config and LoanPaymentPlan domain.
- New six Bill loan action/preview/result/summary/row VMs and LoanScheduleRevisionDetailVM; extended LoanPaymentPlanDetailVM and LoanEMIDetailVM.
- Extended LoanPaymentPlanProfiler, IBillService, BillController, two active-EMI reads in LoanReportService, and GeneralMessage.resx/ar-SA (seven new lifecycle keys).

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- New `models/loan-lifecycle.ts`, `components/loan-change/loan-change.component.ts/html`, `components/loan-history/loan-history.component.ts/html` under `src/app/modules/Vouchers/Bills/Bill`.
- Extended existing models/installments.ts, services/bill.service.ts, saved installments TS/HTML, parent list/details TS/HTML, EN/AR bill.loanLifecycle keys and explicit tsconfig runtime entries. The readonly loan-plan HTML labels saved FlatRate as original, while editable original-plan labels remain unchanged.
- Root updates `src/app/modules/UserGuide/content/bills-topic.ts`, covering separate actions, prepare/confirm, interest/principal/date/count limits, down-payment/capacity mismatch, immutable history, stale retry and separate loan status. Existing guide reader/menu only.

All unrelated prior owner/peer edits, earlier migration files and snapshots preserved. Some files are already untracked from earlier Bill work; tracked scoped Git diffs and final new-file source were reviewed separately rather than treating absent Git diff as verification.

### Audit and source verification

Independent final financial source audit is CLEAR. It initially found four gaps, all corrected and rechecked: replay relied on weak/partial proof; omitted settlement interest defaulted to zero; invalid legacy dates/count could be archived into an immediately invalid revision; currency precision was absent from stale-preview version. Root additionally corrected early required-input validation access in the action dialog, proposed settlement interest account validation when old next EMI has zero interest, and preservation of ordinary zero-interest Pay behavior. No accounting runtime execution is claimed.

Root syntax-only verification parsed eleven TypeScript sources (including vocabularies and guide), five Angular templates plus the readonly loan-plan template (six total), and JSONC runtime registration with zero syntax errors. Forty-six directly scanned translation keys exist in EN/AR; frontend worker also reconciled all forty-nine new top-level lifecycle keys including status group. Both backend resource XMLs parse with no duplicate keys and all seven new lifecycle keys resolve in both. Scoped frontend/backend/docs whitespace checks pass except informational existing line-ending warnings; thirteen new backend sources and new frontend sources were separately checked for whitespace/merge markers. All8 final packet checks pass; changed BE15 hash is regenerated and approved InvoiceService/Job/shared reference roles remain unchanged.

Owner compilation, EF translation/schema, transaction/race behavior and browser/visual/keyboard/RTL/theme acceptance remain pending. No compiler/build/test/lint/browser/database/migration/snapshot/commit/push/deploy was run. Suggested migration/commits and owner cases are below.

## Acceptance matrix (owner execution pending)

| Case | Expected result |
|---|---|
| Valid no-paid or partially-paid reschedule | Old unpaid generation archived, Paid rows/ids/dates/amounts/PVs unchanged; exact remaining principal and interest distributed into positive new rows; no payment/JV created |
| Count0/fractional/over600 or more rows than representable principal units | Validation fails before mutation; no zero-principal rows or altered history |
| Money precision/storage limit, negative/NaN/nonfinite UI number, exact remainder | Invalid inputs rejected, backend decimal/storage constraints authoritative; final rounding remainder matches totals without negative rows |
| Settlement agreed interest0 or full remaining interest | Full principal conserved, gross=principal+chosen interest, one source-owned PV/JV and principal allocation, active settlement EMI Paid and real PV visible |
| Negative/excess/overprecision interest or principal discount/extra payload | Reject invalid input; principal always server-derived and never client-authoritative |
| Schedule principal differs from effective Bill capacity (including unrecorded down payment/external allocation) | Reschedule/Settlement unavailable and direct POST rejects; never trim principal or fake settled status |
| Draft, Voided, unknown legacy approval, malformed/shared journal or orphan Paid PV | Historical view remains where valid; no fresh lifecycle/cash mutation or fabricated reference |
| Same prepared input/request sent twice after response loss | Original durable revision/PV result returned, no extra cash/revision; conflicting key reuse rejected |
| Another Pay/allocation/revision changes source after Prepare | ExpectedVersion mismatch409, entered form retained; authoritative re-Prepare required |
| Concurrent Pay/Settlement/Reschedule/Void | Allocation then PR serialization, one winner/current-state revalidation; no double spend or Paid-row archival |
| Closed operation/payment period, invalid account/role or save failure | Entire revision/archive/newrows/PV/link/allocation/status transaction rolls back |
| Successive reschedules then settlement | Each generation attributable by actual revision FK; previous histories/read summaries retained; only current unpaid generation contributes to due/report/Pay |
| All installments actually paid | Loan Settled only when valid source links and Bill capacity zero, no fresh lifecycle/Pay action; Bill settlement remains an independent display |
| Cancel/dirty close/HTTP or declared failure/parent refresh | No commit on Prepare/Cancel; failed form and stable request retained; success reloads viewer and parent after outer close without fake PaymentId |
| EN/AR/RTL/dark/narrow/keyboard | Shared controls/read tables retain accessible labels, focus/escape/busy boundaries, compact layout and one internal scroll owner |

Suggested commits only: backend `feat(bills): add audited loan rescheduling and early settlement`; frontend `feat(bills): add loan lifecycle preview and history dialogs`; docs `docs(finance): document immutable loan schedule revisions`. No commits performed.

## Owner schema handoff

Suggested commands only, not executed:

```powershell
Add-Migration AddBillLoanScheduleRevisions -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
Update-Database -Project SiGma.DataAccess -StartupProject SiGma.ServerAPI -Context SiGmaDbContext
```

Inspect the new revision table, required fingerprint/reason lengths, money columns, unique tenant+plan+revisionNo and tenant+requestId indexes, Restrict Bill/plan relations, and two nullable EMI revision FKs with Restrict deletes. Existing rows keep null revision FKs and receive no invented historical revisions. Ensure earlier source-owned installment payment link schema and existing Bill lifecycle schema are already present or included correctly in the owner's pending migration sequence. Apply schema before deploying these new readers/writers, then compile and execute the acceptance matrix. Review artifacts/skill remain local outside application Git roots until the owner's documented instruction-layer move.

## Follow-up: reported active CS0246 diagnostics (2026-10-21)

Scope: the owner's pasted Visual Studio Error (active) list for LoanStatus,
LoanScheduleRevisionKind and the new BillLoan action/result/summary VMs.
Source-only investigation found all reported declarations present and public,
with matching namespaces, existing consumer imports/global imports and the
expected project-reference chain (Helpers -> ViewModels -> Business/API).
Both SDK projects use default source globbing without exclusions.

Read-only MSBuild item evaluation (`-getItem:Compile`, no build target) succeeded
for Helpers and ViewModels. The two enum sources and all six new BillLoan VM
sources are included in the evaluated Compile items. This is project-inclusion
evidence, not successful compilation. No missing using or project registration
was established, so no speculative application-source change was made.

The diagnostics are consistent with stale Visual Studio design-time/reference
state after externally added files, but this remains an inference. Owner next
step: reopen/reload the solution and run Rebuild; inspect Build Output rather
than only the active IntelliSense error list. If errors persist, the first
actual build diagnostic is needed to identify the originating failure.
No cache deletion, build, test, lint, runtime, database, migration, snapshot,
commit, push or deployment action was performed. No schema change is needed
for this diagnostic follow-up; the previously documented feature migration
requirement remains. No subagents were used because this was one bounded,
sequential diagnostic workstream.

## Follow-up: Bill GetList SQL208 (2026-10-21)

The owner supplied an HTTP500 GetList log with SqlException Number208. Its
serialized exception omits the actual SQL message/object name; exact failing
object therefore remains unconfirmed without runtime/database access.

Source evidence: BillService populates list action values through
ReadBillCorrectionEligibilityAsync, whose BillsWithoutCorrectionDependencies
query references LoanScheduleRevision and BillInstallmentPayment. The former
is explicitly mapped to table LoanScheduleRevision. Scoped migration source
search finds AddBillInstallmentPaymentLinks but no LoanScheduleRevision table,
revision migration or two new EMI revision FK columns. The latest lifecycle
schema handoff remains outstanding in repository source. Missing
LoanScheduleRevision schema is the leading explanation for the new list error;
missing unapplied earlier schema or a different target database remain possible.

Remedy stays the existing owner schema handoff: generate/review
AddBillLoanScheduleRevisions against SiGmaDbContext and apply pending migrations
to the API's actual target database. Do not remove the retained-history guard or
swallow SQL208 to make the list appear healthy. No source edit or migration/DB
command was executed; the prior migration boundary remains in force.

## Follow-up: installment action discoverability (2026-10-21)

Frozen presentation-only clarification: keep the existing server-owned canReschedule
and canSettleEarly visibility rules and show History only for saved revisions.
Use the shared FormSection description to explain Draft, Voided, Settled,
review-required or missing lifecycle response data when actions are absent.
Eligible records get a short pointer to the header actions and when History
appears. This does not loosen eligibility or add a payment/accounting transition.

Conformance: UI7 keeps unavailable actions hidden; UI22 explains the empty action
state; UI24 uses existing secondary buttons; shared FormSection owns description
and header projection. Existing viewer/action wiring is a financial-document
viewer with nested typed action dialogs (screen08/09), not generic CRUD.
All8 recipe checks passed before use. Only the existing viewer TS/template,
EN/AR keys and owning user-guide text are changed. No independent workstreams
justify delegation for this small sequential change.

Presentation follow-up implemented source-only: the shared installment section
now renders a short EN/AR lifecycle description. Missing response fields are
reported as unavailable rather than being silently treated as an ordinary
ineligible record; Draft, Voided, Settled and review states get appropriate
non-specific guidance. Eligible state points to the existing header actions
and explains that History appears only after a saved change. Can* flags and all
backend eligibility/accounting contracts are unchanged.

Verified frontend service GET Bill/{id}/loan-payment-plan -> controller ->
LoanPaymentPlanDetailAsync -> PopulateLoanLifecycleValuesAsync; header projection
matches the actual shared [form-section-actions] selector. Source confirms the
buttons are conditional, but the owner's actual running response/assets were
not inspected, so exact live absence cause remains pending. Updated existing
UserGuide content at bills-topic.ts under /UserGuide/invoice. No new routes,
DTOs, migrations, shared styles or permission APIs. Four TS files passed
syntax-only createSourceFile parsing and the template passed parseTemplate;
no typecheck/build/runtime acceptance is claimed. Scoped whitespace check passed
(existing line-ending warnings only). Prior dirty changes preserved. Owner:
restart API using latest code/schema, refresh frontend, open saved installments
and read Loan status/description; verify eligible header actions and retained
history after commit. No build/test/lint/browser/database/migration/snapshot/
commit/push/deploy action was run. Suggested frontend commit only:
fix(bills): explain unavailable installment lifecycle actions.
