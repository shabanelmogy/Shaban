# HRM Payroll Process — frontend implementation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

The frozen payroll contract and its owner-approved historical recalculation continuation own the API/workflow. This agent owns only new `SiGmaAngularFrontEnd/src/app/modules/HRM/Payroll/PayrollProcess` source files. Root owns route/sidebar/translations/user guide and complete integration. No shared source is edited by this agent.

## Before-edit conformance evidence

| Concern | Owning block | Approved source/reference | Shared owner | Target decision |
|---|---|---|---|---|
| Financial workspace | UI screen05, UI1/14 | OpeningBalances details/staff templates | route host, list panel, editor footer | Financial workspace adapted to read-only server figures; DataTable owns rows, no editable collection |
| Title/filter/table bounds | UI1/3/4/6 | OpeningBalances details; Workshop Job list | FeatureTitle, FilterPanel, DataTable fill | shared list shell and ordinary equal inset; no feature stylesheet |
| Month validation | UI17/19/27 | DatePickerDirective/date-utils/FieldError/focusField | structured month mask + shared validator/parser | current month, required MM/YYYY; backend bound year1..9998 |
| Totals | UI14/24 | OpeningBalances staff summary | SummaryCards/formatMoney | server response totals, slim row/min140/max80; no client salary formula |
| Discard/pending state | UI10/28 | confirmation service/form-state; Job CanDeactivate route | deferred confirmation + freezeFormState | Process/Reset/route guard recheck candidate identity and busy state; Cancel retains preview/form |
| API feedback | UI2/22 | OpeningBalanceBatch service, Result wrapper, apiErrorMessage | single interceptor client; inline suppressed errors | Process/Save/history handle Result false and HTTP errors; explicit Retry |
| Historical revisions | owner continuation + UI16 | PayrollRevisionSummaryVm | typed body-appended Dropdown | preview retained while browsing immutable history; Save blocked in historical view |
| Access | UI26 | authenticated shell | AuthGuard | no invented permission API or payment-state mutation |

Recipe drift check: `Generate-SigmaRecipes.ps1 -Check` returned OK for all eight packets on 2026-10-09. Source-only verification; no build/test/lint/runtime/browser/database/migration/commit is authorized.

## Root integration handoff

- Lazy route: `import('./../modules/HRM/Payroll/PayrollProcess/payroll-process.routes').then(m => m.PayrollProcess_Routes)` under the existing authenticated pages routing owner, with frozen path `/ProcessPayroll`.
- Sidebar: the existing HRM Payroll > Payroll Process entry must use that route.
- Runtime files: `src/app/modules/HRM/Payroll/PayrollProcess/payroll-process.routes.ts`; `components/process/payroll-process.component.ts`; `models/payroll-run.ts`; `services/payroll-process.service.ts` relative to this feature. The component is the standalone runtime root if the owner compiler reports it missing from `tsconfig.app.json`; UI29 requires adding only the reported exact root, not a broad include or preemptive roots.
- User guide: describe Month/Process/Save, salary effective dates, current preview vs immutable history, unpaid new revisions, paid settlement indication, policy blockers, server totals, concurrency refresh/Retry, discard confirmation, and separate payment. Root owns the existing HRM guide topic/reader route/menu.

## EN/AR keys required by this frontend

Add one new `payrollProcess` object in each vocabulary. Source search found no existing `payrollProcess` namespace. API issue keys are root-owned and listed below for parity.

```ts
// en.ts
payrollProcess: {
  title: 'Payroll Process',
  subtitle: 'Calculate and save monthly payroll with revision history',
  month: 'Month',
  process: 'Process',
  code: 'Code',
  name: 'Name',
  basic: 'Basic',
  allowances: 'Allowances',
  gross: 'Gross',
  overtime: 'Overtime',
  additional: 'Additional',
  deductions: 'Deductions',
  netPay: 'Net Pay',
  netPayDifference: 'Net Pay Difference',
  totals: 'Payroll totals',
  settlementDifference: 'Settlement Difference',
  history: 'Saved revisions',
  currentPreview: 'Current calculation',
  revisionOption: 'Revision {{revision}} · {{date}} · Net {{net}}',
  processedPeriod: 'Month {{period}} · Overtime {{overtime}}',
  revisionLabel: 'Saved revision {{revision}}',
  paid: 'Paid — locked',
  saved: 'Saved',
  preview: 'Unsaved calculation',
  policyNotice: 'Save records payroll; payment is separate. Leave and absence deductions and mid-month proration are not applied automatically. Affected absence or proration rows block Save until their policy is approved.',
  historicalNotice: 'You are viewing an immutable saved revision. Select Current calculation to return to the latest preview.',
  settlementNotice: 'This payroll has been paid. Changes are shown as differences for a separate settlement workflow; Save cannot change the paid run.',
  paidNotice: 'This payroll has been paid and is locked. Payment and settlement are separate workflows.',
  fixIssues: 'Resolve the issues shown under staff names, then Process again before saving.',
  processFirst: 'Process the selected month before saving.',
  notProcessed: 'Select a month and press Process to calculate payroll.',
  empty: 'No eligible staff were returned for this month.',
  periodRange: 'Select a month in years 0001 to 9998.',
  processError: 'Payroll could not be calculated. Your previous calculation is retained.',
  saveError: 'Payroll could not be saved. Your calculation is retained.',
  historyError: 'Saved payroll history could not be loaded.',
  retry: 'Retry',
  retryHistory: 'Retry history',
  discardTitle: 'Discard unsaved payroll calculation?',
  discardMessage: 'The displayed calculation has not been saved. Continue and discard it?',
  discard: 'Discard calculation',
},
```

```ts
// ar.ts
payrollProcess: {
  title: 'معالجة الرواتب',
  subtitle: 'احتساب الرواتب الشهرية وحفظها مع سجل المراجعات',
  month: 'الشهر',
  process: 'معالجة',
  code: 'الكود',
  name: 'الاسم',
  basic: 'الأساسي',
  allowances: 'البدلات',
  gross: 'الإجمالي',
  overtime: 'العمل الإضافي',
  additional: 'الإضافات',
  deductions: 'الاستقطاعات',
  netPay: 'صافي الراتب',
  netPayDifference: 'فرق صافي الراتب',
  totals: 'إجماليات الرواتب',
  settlementDifference: 'فرق التسوية',
  history: 'المراجعات المحفوظة',
  currentPreview: 'الاحتساب الحالي',
  revisionOption: 'المراجعة {{revision}} · {{date}} · الصافي {{net}}',
  processedPeriod: 'الشهر {{period}} · العمل الإضافي {{overtime}}',
  revisionLabel: 'المراجعة المحفوظة {{revision}}',
  paid: 'مصروف — مقفل',
  saved: 'محفوظ',
  preview: 'احتساب غير محفوظ',
  policyNotice: 'الحفظ يسجل الرواتب، والصرف عملية مستقلة. لا تطبق استقطاعات الإجازات والغياب أو الاحتساب النسبي خلال الشهر تلقائياً. تمنع حالات الغياب أو الاحتساب النسبي المتأثرة الحفظ حتى اعتماد سياستها.',
  historicalNotice: 'تعرض الآن مراجعة محفوظة لا تقبل التعديل. اختر الاحتساب الحالي للعودة إلى أحدث معاينة.',
  settlementNotice: 'تم صرف هذه الرواتب. تعرض التغييرات كفروق لمسار تسوية مستقل؛ لا يمكن للحفظ تعديل الرواتب المصروفة.',
  paidNotice: 'تم صرف هذه الرواتب وأصبحت مقفلة. الصرف والتسوية مساران مستقلان.',
  fixIssues: 'عالج الملاحظات الظاهرة أسفل أسماء الموظفين، ثم أعد المعالجة قبل الحفظ.',
  processFirst: 'عالج الشهر المحدد قبل الحفظ.',
  notProcessed: 'اختر الشهر واضغط معالجة لاحتساب الرواتب.',
  empty: 'لا يوجد موظفون مستحقون للرواتب في هذا الشهر.',
  periodRange: 'اختر شهراً ضمن السنوات من 0001 إلى 9998.',
  processError: 'تعذر احتساب الرواتب. تم الاحتفاظ بالاحتساب السابق.',
  saveError: 'تعذر حفظ الرواتب. تم الاحتفاظ بالاحتساب الحالي.',
  historyError: 'تعذر تحميل سجل الرواتب المحفوظة.',
  retry: 'إعادة المحاولة',
  retryHistory: 'إعادة تحميل السجل',
  discardTitle: 'تجاهل احتساب الرواتب غير المحفوظ؟',
  discardMessage: 'لم يتم حفظ الاحتساب المعروض. هل تريد المتابعة وتجاهله؟',
  discard: 'تجاهل الاحتساب',
},
```

API issue suffixes under `payrollProcess.issues`: `missingSalary`, `invalidSalary`, `ambiguousSalary`, `prorationRequired`, `invalidOvertime`, `duplicateOvertime`, `invalidDeduction`, `absencePolicyRequired`, `negativeNet`. Root owns backend resources and both issue translations. After insertion, run the allowed read-only `Check-Translations.ps1 -Block payrollProcess`.

## Owner continuation: approval, saved View/Edit and operation log

The later contract adds approval state and read-only operation logs. The Process model now matches `isApproved`, `isCurrentRevision`, `approvedAt`, `approvedBy`; an older historical revision is visibly Superseded while its approval audit is retained. Management owns Approve. View/Edit query handoff is `runId`, `mode=view|edit`, `returnTo=/ProcessedPayrolls`; current GET loads the saved snapshot, View disables Month and hides Process/Save, Edit allows explicit Process then Save. Back strips these three query keys and retains the management list's applied filters/page/sort. Complete saved rows use shared Excel export; an unsaved candidate cannot be exported as saved payroll.

Process log visibility joins the busy/CanDeactivate gate and freezes the background reactive form through `freezeFormState`; Close restores the same preview's original enabled/disabled state only after the modal closes. No underlying Process/Save/Reset/history mutation can change the modal identity.

Reusable log import/export: `src/app/modules/HRM/Payroll/PayrollProcess/components/logs/payroll-run-logs.component.ts` exports `PayrollRunLogsComponent`; selector `app-payroll-run-logs`; inputs `[visible]`, `[runId]` (`number|null`), optional `[period]`; output `(closed)`. Its shared EditorDialog is View with no primary action, translated title + separate identifier subtitle, padded560px body and fill DataTable. Complete logs are read-only; Date/time is explicitly UTC, and Result/HTTP failure owns inline Retry. Close/identity changes cancel the read. New runtime root is the log component TS file if the owner compiler reports it missing.

Merge these additional keys into the same new `payrollProcess` object:

```ts
// en.ts
approved: 'Approved',
pendingApproval: 'Pending approval',
superseded: 'Superseded',
approvalDetails: 'Approved {{date}} (UTC) by {{actor}}',
backToPayrolls: 'Back to payrolls',
invalidRun: 'The payroll link is invalid. Return to the payrolls list.',
loadError: 'Saved payroll could not be loaded.',
logs: {
  title: 'Operation log',
  subtitle: 'Payroll {{id}} · {{period}}',
  occurredAt: 'Date/time (UTC)',
  operation: 'Operation',
  revision: 'Revision',
  previousRevision: 'Previous Revision',
  performedBy: 'Performed By',
  previousAmount: 'Previous Amount',
  amount: 'Amount',
  created: 'Created',
  recalculated: 'Recalculated',
  approved: 'Approved',
  empty: 'No operations were recorded for this payroll.',
  loadError: 'The payroll operation log could not be loaded.',
},
```

```ts
// ar.ts
approved: 'معتمد',
pendingApproval: 'بانتظار الاعتماد',
superseded: 'مستبدلة بمراجعة أحدث',
approvalDetails: 'تم الاعتماد بتاريخ {{date}} (UTC) بواسطة {{actor}}',
backToPayrolls: 'العودة إلى الرواتب',
invalidRun: 'رابط الرواتب غير صالح. ارجع إلى قائمة الرواتب.',
loadError: 'تعذر تحميل الرواتب المحفوظة.',
logs: {
  title: 'سجل العمليات',
  subtitle: 'الرواتب {{id}} · {{period}}',
  occurredAt: 'التاريخ والوقت (UTC)',
  operation: 'العملية',
  revision: 'المراجعة',
  previousRevision: 'المراجعة السابقة',
  performedBy: 'المنفذ',
  previousAmount: 'المبلغ السابق',
  amount: 'المبلغ',
  created: 'إنشاء',
  recalculated: 'إعادة احتساب',
  approved: 'اعتماد',
  empty: 'لا توجد عمليات مسجلة لهذه الرواتب.',
  loadError: 'تعذر تحميل سجل عمليات الرواتب.',
},
```

## Final source conformance and verification

| Concern | Final producer/consumer evidence | Source result |
|---|---|---|
| Frozen API/types | `PayrollRun`, `PayrollRunRow`, `PayrollRevisionSummary`, `PayrollRunLog`; service Result wrappers and exact calculate/save/current/revision/log paths | Matches frozen contract + owner continuations; payload only period/expectedVersion |
| Screenshot columns/response fields | Code/code, Name/name, Basic/basic, Allowances/allowances, Gross/gross, Overtime/overtime, Additional/additional, Deductions/deductions, Net Pay/netPay | All9 read-only; staffId identity; issues rendered under Name; netPayDifference conditional10th column on changed saved-run candidate |
| Shared shape | `PayrollProcessComponent` route host; shared list page/panel/header/title/filter; DataTable fill/lazyfalse/paginatorfalse; no feature SCSS | Matched UI1/3/4/6; read-only DataTable exception frozen in feature contract |
| Calendar/feedback | DatePickerDirective mask; Date|string|null, required/monthValueValidator; local year<=9998 bound; shared parser/focus/FieldError | Matched UI17/19/27; invalid Process/Save clicks reveal validation |
| Summary/action region | authoritative seven server totals; optional settlementTotal; SummaryCards slim/row/min140/max80 outside fill table, shared Save button footer | Matched UI14/24; no frontend payroll formula |
| Pending/navigation | deferred confirmation identity gates; shared form snapshot; Process/Reset/Save/history/log freezes; CanDeactivate route | Matched UI10/28; cancelled discard preserves form and candidate |
| Errors/requests | Resultfalse + HTTP errors; skip-error header; inline StateMessage/Retry; Save409 Retry means Process; standard Save success remains interceptor-owned | Matched UI22; all screen reads/saves balance global loader in finalize; auxiliary revisions local only |
| Historical/approval | current preview retained while browsing immutable history; saved rows Excel; superseded+historical approval audit; View hides Process/Save | Matches owner continuation; management owns Approve, no payment/state writer |
| Shared log dialog | EditorDialog View/no-primary/padded560px; title/subtitle; fill complete-array table; switchMap/id-visible guards; both failures/Retry; Close cancels | Matched UI13/22/28; UTC label aligns producer log clock |
| Translations/guide/runtime | exact key sets and shared log export provided above; root integrates dictionaries/sidebar/lazy route/HRM guide | Root-owned final integration/parity; runtime and visuals owner-pending |

All7 new application source files were inspected with Git `diff --no-index` against NUL because they are untracked; scoped `--check` found no whitespace errors (only Git's LF→CRLF informational notices). TypeScript parser: all5 TS files, zero syntax diagnostics. Angular template parser: both HTML templates, zero syntax diagnostics. Scoped scan found no merge markers, untyped `any`, post-ES2018 APIs, date-only UTC conversion, silent error callback, new HttpClient provider or feature-local CSS. Shared exported symbols/input contracts, BaseService/base component members and installed template input owners were source-inspected. These checks do not certify compilation or runtime acceptance.

After root vocabulary integration, a read-only AST path comparison found zero missing used `payrollProcess` translation paths in EN/AR (including the nine issue keys and new `invalidIdentity`). The prescribed `Check-Translations.ps1 -Block payrollProcess` reported zero missing keys/case-only differences. A read-only shared diff noticed extra added `revisionLabel` entries outside this namespace and reported them to root for targeted integration reconciliation; this agent did not edit shared dictionaries.

Files created under `src/app/modules/HRM/Payroll/PayrollProcess`: `models/payroll-run.ts`, `services/payroll-process.service.ts`, `payroll-process.routes.ts`, `components/process/payroll-process.component.ts`, `components/process/payroll-process.component.html`, `components/logs/payroll-run-logs.component.ts`, `components/logs/payroll-run-logs.component.html`. No existing application files were edited by this agent; peer/user changes were preserved.

Frontend phase ownership: root froze Phase1; this agent applied Phase2/3 read/write UI, bounded Phase5 feature route, and source reconciliation of owned files. Approval Phase4, overall Phase5 and Phase6, dictionaries, sidebar and HRM user guide remain root-owned. Backend/mapping/schema unchanged by this agent. Suggested frontend commit: `feat(hrm): add payroll processing with revision history and operation logs` (suggestion only).

Owner verification: compile route/log standalone roots; validate invalid/partial month and years0001/9998/9999; Process/Save empty/blocking/valid rows; no-op saved Process and unpaid changed new revision; Save409 refresh; View/Edit list-state return; old revision Superseded with retained approval audit; paid change settlement indication; complete saved-row Excel after language change; log loading/error/Retry/Close and background freeze; cancel/accept unsaved Process/Reset/navigation; desktop/narrow no-page-scroll, internal rows/totals/actions, calendar overlay, keyboard focus, RTL and dark theme. No build, tests, lint, runtime/browser/database commands, migrations, commits or pushes were run.
