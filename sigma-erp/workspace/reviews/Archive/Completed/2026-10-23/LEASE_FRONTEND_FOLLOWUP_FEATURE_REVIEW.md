# Lease frontend follow-up — 2026-10-08 / 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Manifest and initial evidence

User requested review and documentation-supported implementation for `SiGmaAngularFrontEnd/src/app/modules/Lease`. The frozen handoff is `LEASE_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md`; the 2026-10-06 contracts and review fragments remain historical evidence. No screenshots were supplied. Initial Lease Git status was clean. Existing changes in UserGuide reader/Fleet/Sales and unrelated backend Sales/migration files remain user-owned and must be preserved.

Initial recipe check: Phase3 stale; all other phase packets current. Canonical books govern Phase3; regeneration/semantic review remains owner-pending. Applicable phases: 0/1 discovery/freeze, 2/3 scoped conformance, 4 existing action presentation only, 5 guide/wiring, 6 source reconciliation. No business/API/schema change is approved by presentation findings. Final drift result is recorded below; the initial result is retained as historical evidence.

## Reference conformance and confirmed findings

| Concern | Book | Actual reference/source symbol | Shared owner | Initial target comparison and repair |
|---|---|---|---|---|
| Dirty exit and route navigation | UI10/28 | Job editor `requestClose/canDeactivate`; Job routes `preventUnsavedJobExit`; newer canonical pending-decision rule | ConfirmationDialogService; Angular CanDeactivateFn | Agreement routes lack guards; requestClose prompts only on its own button. Make the guard own every routed exit and defer confirmation until subscribed. |
| Pending control state | UI10/14 | Movements Collection/Delivery/Custody pending form disable/restore; canonical UI10 retains intentionally disabled controls | New shared `freezeFormState` extraction | Agreement close/remove decisions only set busy signals, leaving controls editable. Freeze and restore without events/dirty/value changes, skip destroyed editor; preserve Deposit cleanup locks. |
| Deferred UI lifetime | UI28 | Quotation/Master timer(0) + takeUntilDestroyed repair cited by owning block | RxJS timer/takeUntilDestroyed; ReportPrintService | Agreement `tryPrintOnLoad/revealFirstInvalidControl` use untracked setTimeout. Cancel on destruction and recheck loaded identity/readiness. |
| Numeric enum identity | UI16 | `enumOptions` returns actual enum values; backend LeasePreterminationType is 1..6 | shared enum-options.ts | Agreement uses legacy index-based EnumToArrayPipe and +1 compensation. Use real values; preserve existing four voucher subtype choices through explicit numeric contract matching backend 0..3. |
| Saved calendar dates | UI17 | shared `toPickerDate` local-day construction; canonical distinction from DateTime | date-utils.ts | Day-only pickers retain private hydration helpers. Reuse shared day hydration; keep DateTime controls on their wall-clock contract. |
| Guide completion | Master7/UI23 | existing UserGuide `GuideSection`, reader and module sidebar guide entries | UserGuide reader/journey/topic/text pipe | No Lease guide registration or content. Add one bilingual owning-module guide with operational links and child workflows under parent topics. |

Shared-extraction decision: form-state snapshot occurs in independent Lease editors; one helper owns temporary disabling/restoration, each consumer owns identity and cleanup gates. No new business formula, persistence or permission owner. UI10/14 and the skill/history now record the reusable extraction. UI17 and the skill record preservation of full saved calendar years.

Additional source-confirmed comparisons: UI22 requires balanced global LoadingService/finalize with inline Result/HTTP errors; Agreement context dialogs had only local loading and several lacked Retry. UI19's scalar-validators.int32ValueValidator matches backend CostParameter.Order and CostSetting year inputs; the target omitted the transport maximum. UI14 saved-row confirmation must use persisted identity; Clause GUID rows were misclassified by the numeric fallback. UI16's TranslateOptionsPipe owns static dropdown translation; Inquiry/Quotation/Master duplicated translated item templates. Actual approved owners and before/after evidence are recorded in the Documents and Settings fragments below.

## Final reconciliation

Completed 2026-10-09 against the frozen frontend boundary. No material API/business decision remains blocked. This status records implementation and source inspection; it does not declare compiler, runtime or visual acceptance.

### Contracts and phase evidence

- Frozen handoff: `LEASE_FRONTEND_FOLLOWUP_CONTRACT_FREEZE.md`; historical `LEASE_FRONTEND_CONTRACT_FREEZE.md` and the 2026-10-06 Lease contracts remain unchanged.
- Documents grid/filter/detail/action evidence: `Lease/DOCUMENTS_20261009_REVIEW.md` (Inquiry, Quotation, Master).
- Settings/grid/write evidence: `Lease/SETTINGS_20261009_REVIEW.md` (Clause, CostParameter, CostSetting, Tariff, SMS).
- Guide content and direct backend business-rule evidence: `Lease/GUIDE_20261009_REVIEW.md`.
- Agreement retains `models/list.ts` and the historical Agreement contract: displayed no/PO/plate/permanent vehicle/customer name and code/driver/start/end/closed/branch, with existing id/state/can* action data; filters agreementNo/manualAgreementNo/branchId/plateNo/permanentVehicle/isClosed/customerId/salesPersonId/ownership/fromDate/toDate and whitelisted sort. No new ListVM field, query key, column or backend projection.
- Agreement main/detail and action DTOs keep the current client-editable inputs and complete child snapshots. Calculations and state transitions remain backend-owned. Voucher subtype now has an accurate numeric local enum for existing choices0..3; wire IDs and backend contract did not change. Pretermination uses its existing numeric IDs1..6 directly.
- Phase0 evidence and Phase1 freeze preceded independent work. Phases2/3 corrected confirmed source defects, Phase4 covered existing action presentation/recovery, Phase5 integrated guards/providers/UserGuide, and Phase6 reconciled the complete scoped diff. A new maintenance/evolution plan was not required for these bounded conformance fixes.

### Source comparisons

| Comparison | Final source evidence and outcome |
|---|---|
| Supplied functional evidence | No screenshots/video supplied. Existing source and frozen contracts are the evidence; no additional business workflow invented. |
| Grid / List DTO / ListVM | Existing columns, filters, sorting, page/count and complete Excel fetch scope retained; workstream tables enumerate them. Agreement and closed subset keep their shared read contract. Historical projection drift is not an API expansion in this frontend handoff. |
| Filters / query / pager | Existing route query snapshots and backend lookup keys unchanged. Inquiry/Master/Agreement saved ranges hydrate with shared toPickerDate; current-month defaults retained. Lists retain cancellation and applied-filter scope. |
| Detail / Add / Update | Typed forms and DTOs retained. Quotation nullable DateTime rate fields remain dates and untouched saved strings are copied verbatim; derived Agreement totals remain previews and backend results remain authoritative. Int32 validators preserve existing nonnegative semantics. |
| Save / exit / refresh | Agreement, Quotation and Tariff routed editors have one CanDeactivate owner on create/edit/view routes. Deferred one-use decisions recheck identity/readiness, freeze controls and successful Save bypasses discard. Existing mutation/list refresh and success-feedback owners retained. |
| Pending dialog decisions | Agreement actions, Inquiry/stage, Quotation rejection/master, Clause/CostParameter/CostSetting and Tariff branch settings freeze reactive controls while confirming; restore only current editor. Deposit cleanup locks remain in force after a committed receipt. |
| Parent-owned children | EditableRows opt-in freezes the parent; defaults preserve other consumers. Restore is idempotent and gated by row membership/canMutate; deletion re-resolves the row. Clause declares isSavedRow for persisted GUID children; new pristine rows retain existing behavior. |
| Asynchronous tariff preview | Agreement editorLocked includes tariffQueued and loadingTariff. A debounce-queued or in-flight preview cannot replace rows behind an active discard/remove decision. No tariff formula/request contract changed. |
| Action state / auth | Existing can* flags, closed/invoiced/voided restrictions and backend validation retained. AuthGuard remains authentication; no invented permission mechanism. Ordinary provisions remain blocked on Create/Edit; Extend rate period retains its existing supported schedule input. |
| Both failure channels | Existing Result and HTTP inline owners retained. Agreement dialog reads now pair LoadingService with finalize and offer Retry before editable context is ready. Vehicle replacement requires all context/lookups; delivery date requires loaded context before Save. List lookup errors have separate recovery and cannot disappear behind successful grid reads. |
| Lifetime / stale reads | Routed guards defer work; timer(0)/takeUntilDestroyed owns print/focus. Logs cancel previous reads on reload/hide. Existing requestSequence/current identity checks gate modal recovery. |
| Upload / receipt cleanup | Existing PDF/JPEG/PNG storage and cleanup contracts preserved; global document upload loading balanced. Deposit committed/cleaning/error gates prevent duplicate saving and retain cleanup Retry. No storage/schema/accounting change. |
| Shared dates | parseDateValue/toPickerDate construct local days through setFullYear; years0001..0099 no longer acquire the native constructor's1900 offset. Date transport/display pad four-digit years. Year-zero rejection, two-digit manual-year compatibility and wall-clock DateTime handling retained. |
| Enum / translation | Static dropdowns use shared TranslateOptionsPipe and real enum IDs; no index compensation. Corrected Quotation export to existing general.exportExcel and added general.discard in EN/AR for current confirmation consumers. Literal translation references and namespaces resolved in both languages. |
| Layout / accessibility / theme | Existing approved shared page/panel, FeatureTitle, fixed filter/footer and internal scroll owners retained. No feature page-height calculation or custom modal header/style introduced. Responsive/RTL/theme/keyboard/print interaction remains owner-pending. |
| Provider / interceptor | LeaseAgreementService now providedIn:'root'; all nine Lease services use root ownership. LayoutModule's redundant Lease provider/import entries removed. AppModule's existing interceptor-enabled HttpClient remains the owner; no feature HttpClient fork. |
| User guide gate | Typed LEASE_GUIDE:10 operational topics,6 journey steps,8 FAQs,109 bilingual objects; registered in existing reader and one Lease sidebar entry at /UserGuide/lease. Existing Sales/Fleet/Rental guides and changes preserved. Closed subset describes View only and Print inside viewer; Billing history describes totals/received/due. |

### Shared learning and documentation drift

Promoted verified guidance in the same task to owning canonical UI10 (freezeFormState), UI14 (opt-in freezing and saved GUID identity), UI17 (full calendar-year hydration) and `.agents/skills/sigma-screen-refactor/SKILL.md` with dated revision rows. No generated packet or approved reference module was edited. Other concurrent documentation changes remain preserved.

Final read-only Generate-SigmaRecipes.ps1 -Check reports PLAN00 and PHASE00/02/03/04/05/06 stale; PHASE01 current. Canonical sources governed the affected work. The owner must regenerate and semantically review derivative packets. The initial check result above is not the final packet state.

Existing compatibility concern retained: Tariff branch-settings service removes omitted rows under its existing full-snapshot contract. This differs from the general backend no-delete-by-omission guidance; changing destructive backend semantics is outside this frozen frontend handoff and requires a separately approved evolution decision. It was not silently changed or reported as newly introduced.

### Verification performed and pending

Source-only checks after final translation corrections:100 TypeScript files parsed without syntax diagnostics;36 Angular templates parsed without errors; local import paths resolved;756 literal translation references (including5 namespace prefixes) resolved in EN/AR;10 guide routes matched pages/routing.ts;109 bilingual guide objects had nonempty EN/AR values; the3 new runtime files are present in tsconfig.app.json's explicit files list. No broad include or spec entry added. These parser checks do not perform type checking, a build, tests or application execution.

All scoped tracked diffs and new helper/enum/guide sources were reviewed. A bounded independent final audit of root/shared/route integration found a queued-tariff race, which was corrected and re-reviewed with no further actionable finding. Final scoped git diff --check passed; Git emitted line-ending normalization warnings only. No Lease backend diff was produced by this task. No entity/EF/schema change; no migration is required.

Owner verification pending: compiler/type/template acceptance; external route/Back/Cancel dirty exits (one prompt), Cancel preserving values and disabled controls, successful Save without a second prompt; saved GUID row removal; queued tariff preview; hidden/reopened modal identity; lookup/context failures and Retry; deposit committed-cleanup Retry without duplicate receipt; saved dates/months and unchanged Quotation rate precision; guide navigation/EN/AR/print; narrow screen/RTL/light/dark/keyboard behavior. Builds/tests/lint/browser/runtime/database verification were not run under the task's source-only rules.

### Delivery ownership and file scope

Root owns Agreement, shared helpers, integration, book/skill promotion and reconciliation. Documents agent owns Inquiry/Quotation/Master (15 source files); Settings agent owns Clause/CostParameter/CostSetting/Tariff (7 source files) and audits unchanged SMS; guide agent owns lease-guide.ts. Three bounded agents used inherited available models with nonoverlapping ownership after freeze. Settings agent was reused for a bounded read-only integration audit. Root integrated and reviewed all outputs; no subagent declared overall completion.

Changed source scope: LeaseAgreement dialog/detail/list/routes/models/service files; the Documents and Settings files enumerated in their fragments; shared/utils/{form-state,date-utils,editable-rows}; UserGuide/content/lease-guide and reader registration; LayoutModule Lease providers; Lease sidebar entry; EN/AR guide and discard keys; Quotation export key; three explicit tsconfig.app entries. New files are form-state.ts, provision-voucher-subtype.ts and lease-guide.ts. Existing unrelated Fleet/Rental/Sales/shared-style/backend/migration changes remain user-owned and preserved.

No commit, push or deployment was performed. Suggested frontend commit: `fix(lease): guard editor exits and align source contracts`. Suggested instruction/documentation commit: `docs(lease): record shared form state and screen guidance`. No backend commit or migration command needed for this scope.
