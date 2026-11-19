# Cash Deposits — confirmed implementation handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-05 |
| Authorization | User: «راجع : src\app\modules\Banking\Cash Deposits وطبق كل التعديلات وفقا للوثائق المعتمدة» |

## Boundary and authority

AGENTS.md, sigma-screen-refactor skill, Master 2/4/5/7, UI screen 08 and BE pattern 3 apply. Recipe `-Check` passed all eight packets. Phase 0–6 apply to existing CashDeposit plus its owned CashDepositDetail collection. UI reference: Workshop/Job list and editor; shared table/summary/confirmation/print owners. Backend reference: InvoiceService multi-save journal boundary, PurchaseOrder tracked aggregate helpers; actual CashDepositService remains factual authority for account direction and approval policy.

No application builds, tests, lint, migrations, database commands, browser verification, commits or pushes. Preserve existing unrelated changes in both repositories and shared wiring/translations. Scoped CashDeposit source starts clean. Images 4/5 concern CardTransactionBankTransfer; q concerns Movement Check Card: explicit content evidence, outside named scope, no source edits there.

## Frozen read and route contract

- List: Actions, No (view link), Date, RefNo, Description, Amount; retain current Bank, CreatedBy, CreatedAt content. Row type and backend ListVM: `id, no, date, refNo, description, amount, bankName, createdBy, createdAt, approvalStatus, isPosted, isVoided`. Flags are consumed by action availability; unused tenant/base flags and editor lookup IDs/names are excluded.
- Filters: `no` trimmed partial document number; `dateFrom/dateTo` local yyyy-MM-dd inclusive days from one typeable dual-month picker, current-month default; `bankId` (screenshot Account), `branchId` positive nullable lookup IDs. Optional state filters are unnecessary. Shared serialization, CountAsync-before-paging, stable order/tie-breaker, default UI page size 15; backend supplied paging clamped 1..100.
- Routes `/CashDeposit`, `/CashDeposit/create`, `/CashDeposit/view/:id`, `/CashDeposit/edit/:id`; preserve old `details/:id` as redirect to View. Explicit route mode. Routed editor uses shared container-fill shell because totals/approval/posting exist. Dirty navigation uses shared confirmation and route guard.
- Detail `id, no, date, bankId, bankName, refNo, description, paymentMethodId, paymentMethodName, branchId, branchName, amount, approvalStatus, isPosted, isVoided, cashDepositDetails`. Child `id, sourceType, sourceReceiptId, sourcePaymentId, date, voucherLabel, no, description, amount, deposited, dueAmount, depositedNow`. Server-owned totals/snapshots are read-only.
- `GET CashDeposit/GetUndepositedVouchers?excludeCashDepositId=<current edit id>` returns existing UndepositedVoucherDto array in Results. Exclusion validates the current document and excludes its own persisted lines from prior-deposited balance; create omits it. Stable composite source key Receipt:ID/Payment:ID, never array index.
- List report and Excel cover all pages of the applied filter/sort snapshot through fetchAllPages. Row Print and Save and Print use saved View data and the shared ReportPrintService; no invented server report endpoint. No screenshot report contents beyond supported columns are asserted.

## Frozen writes, ownership and transactions

- Header Add: `date, bankId, refNo?, description?, paymentMethodId, branchId?, cashDepositDetails`. Update adds root `id`. Bank and payment method required (existing journal requires the latter). RefNo max100; Description max500. Date required/nondefault; no tenant/audit/status/number/total in writes.
- Child Add: `sourceType` (Receipt=1, Payment=2), exactly one matching positive source ID, `depositedNow`. Update adds saved child `id` (0 for new). Full selected nonzero snapshot, omitted rows removed. No child parent id or source date/number/amount/deposited/description in writes. The backend reloads eligible cash source and persisted previous deposits, supplies snapshots, validates enum/exclusive source IDs, duplicate source keys, sign and absolute due bounds, precision, saved-child ownership, and nonzero selected lines. Do not silently clamp invalid entered amounts.
- Existing Payment amount sign remains the actual source sum; screenshot negative Payments conflict with positive source values. Do not invert historical/current payment semantics without accounting-owner direction. Receipt amount remains its source Amount. Net document must be positive for the existing bank-debit/clearing-credit journal.
- Add/update, remove, approval and void serialize CashDeposit participating writers using existing tenant `ExecuteUniqueWriteAsync<CashDeposit>`; read/recheck inside boundary. Multi-save add/update keep one outer transaction before mutation. Source Receipt/Payment writers do not participate in that lock: report residual cross-service source-change races. No concurrency-safety claim for unrelated writers.
- Update maps scalar inputs separately and reconciles tracked children by saved id with OwnsAll/ReconcileOwned/RemoveDroppedAsync; omitted children leave both collection and persistence before recalculation. Soft-delete cleanup includes deposit children and journal children; do not rely on database cascade for soft delete.
- Draft journal on Save; approve posts and unapprove unposts via existing resolver, open-period/allocation rules retained. No new accounting accounts, tax or numbering rules. Use server money precision/rounding owner for totals and preserve existing persisted column scale. No entity/EF schema additions planned.
- Legacy child CRUD screen has no menu entry and its own backend service has no implementation. Remove dead frontend CashDepositDetail scaffolding/routes/providers only after parent editor consumes the aggregate. Do not introduce independent child writes.
- Bulk AddList/UpdateList must not bypass aggregate rules: route through validated owned operations atomically or reject explicitly using localized unsupported-operation failure; no direct graph map/save bypass.

## Frozen action state and coverage

| Action | Source / target | Contract |
|---|---|---|
| View / Print | every saved state unchanged | saved detail, view route; read failure inline/retry |
| Edit / Delete | not approved, not posted, not voided | backend repeats locks plus allocations; Delete reusable confirmation; successful deletion refreshes applied list |
| Approve | NotApproved(1), not posted, not voided → Approved(0), posted | POST ToggleApproval/{id}; reusable risk confirmation; existing resolver Post |
| Unapprove | Approved(0), posted, not voided → NotApproved(1), unposted | same endpoint; allocations/period checked; risk confirmation |
| Void / Unvoid | existing boolean toggle | POST ToggleVoid/{id}, allocations/open period as existing; risk confirmation; no invented reversing-journal policy |
| Save / Save and Print | editable draft → saved draft | ordinary Save validation, no confirmation; failure retains data; print only authoritative reloaded saved detail |

Job-specific Close, Invoice Customer, Gate Pass, Labour Time, Lubrication and Job creation are Not Applicable: no Job aggregate/dependency here. Invoice approve/credit/allocations are Not Applicable except existing CashDeposit approval/void/linked-JV allocation blockers. No rejection/revise action exists on CashDeposit. AuthGuard exists, no authorization mechanism: mutations are authorization candidates, visibility is presentation only.

## Explicit non-frozen accounting detail

Screenshot 3 Round off has no entity/DTO/account/formula. Exact rule/account asked asynchronously; until answered it is excluded from writes and shown only as zero informational value if retaining screenshot content, Net Total equals the authoritative Amount. No elapsed-time assumption authorizes accounting changes. Existing broader voucher-plan F5 clearing-account replacement and J-1 reversing-void work are reported separately; this handoff preserves current CashDeposit ledger behavior and does not assert those coordinated accounting slices implemented.

## Reference conformance before implementation

| Concern | Book | Actual reference / shared owner | Target decision |
|---|---|---|---|
| List shell/filter/grid | UI1/3/4/6 | Workshop/Job list HTML/TS; styles.scss, FilterPanel, DataTable | same container-fill, stable filters, fill grid; no local chrome SCSS |
| Editor | UI1/13 | Workshop/Job editor HTML; shared shell and FormSection | one pane/header-lines groups instead of Job-specific three panes |
| Lines | UI14 | editable-collection-table, EditableRows | shared table; stable FormGroup identity; readonly numeric badges; selection is domain input |
| Totals | UI24 | SummaryCardsComponent | readonly slim/row/min140/max80, authoritative saved values, previews only while editing |
| Dates/lookups/errors | UI16/17/19/22/28 | DatePickerDirective/date-utils/FieldError/StateMessage/apiErrorMessage | mask single dates, validated range, typed lookup retries, switchMap reads |
| Persistence | BE3/4/8/14/15 | Invoice multi-save boundary, PurchaseOrder and base ownership helpers | owned full snapshot, no client-derived snapshots, explicit journal consistency boundary |
| Feedback/print | UI21/22 | ReportPrintService, interceptor | one failure owner, one success owner; print saved complete data |

## Override audit target

Remove redundant GetManyAsync and GetListAsync navigation-only overrides; list filter hook owns date range, generic mapped scalar fields handle other filters. Inherit scalar list materialization (no navigation joins needed except bankName, so ProjectTo hook justified). Add/Update overrides justified by authoritative snapshots, aggregate/journal. Remove override justified by owned soft-delete/journal cleanup. Bulk overrides prevent bypass of aggregate invariants. Action methods remain real extras. Detail uses inherited deep read unless a projection is needed. Explicit transaction only for multi-save or documented check/write isolation.

## Integration clarifications — 2026-10-05 continuation

- The plan's live/nonvoided-parent deposited-balance rule requires rechecking restored rows before Unvoid: reload each current eligible source and other live deposits excluding this document; refuse restoration if the saved amount exceeds current capacity. This prevents reuse of released capacity without introducing a reversing-journal rule. All participating operations remain under the CashDeposit write lock.
- Round off has no source value. The final UI displays translated pending-rule text, superseding the earlier optional informational zero; no numeric value, write field or print formula is invented.
- Existing Payment nullable source date fallback to server Today is retained as factual compatibility behavior and reported; no historical dates are rewritten.
- Initial recipe check was eight packets OK. Continuation check found PHASE02–05 drift after external canonical-book changes. Those phases use current canonical books; packet regeneration and semantic review are pending with the documentation owner.

## Owner follow-up — 2026-10-06 saved return

Owner reported ordinary Save did not return to the feature's main page. This instruction supersedes the ordinary Save-to-View destination: successful Create/Update Save now returns to `/CashDeposit`, preserving the list filter/page/sort query. Save and Print still uses saved View with print=true and authoritative detail reload. Failed saves retain inputs and remain on the editor. No API/state/transaction contract changes.

## Owner follow-up — 2026-10-06 View details

Owner reports View does not display details. Editor read now uses the existing GET CashDeposit/GetById/{id}, whose CashDepositService.DetailAsync explicitly projects all frozen header fields, reference names and ordered live owned lines. This supersedes the original generic deep-read caller; no new API or DTO is introduced. Read-only rows display the saved response array via the existing shared fill DataTable, rather than the editable FormArray adapter. Edit/Create still use EditableCollectionTable and source selection. The table-area host joins the flex column chain so either shared table owns its row scroll. Print still uses all saved rows. Runtime cause/acceptance remain unverified under the source-only boundary.
