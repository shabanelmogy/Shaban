# Bills — down-payment frontend and comprehensive source audit

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |
| Scope | Bounded frontend workstream; root owns integration, backend, user guide and final reconciliation |

## Authority and contract

Read canonical AGENTS, sigma-screen-refactor digest, UI screen08 financial document and screen09 action dialog, their action/editor/date/validation/feedback/cancellation owners, current Workshop Job editor/close-job sources and shared EditorDialog/FormSection/DataTable/FieldError/DatePicker sources. Root froze BILLS_DOWN_PAYMENT_AND_FULL_REVIEW_CONTRACT_FREEZE.md after its all8 recipe check. Preserve all unrelated dirty files. No migrations, snapshots, builds, tests, lint, browser, runtime, database, commits, pushes or deployment executed.

## Implemented down-payment UI

- `BillInstallments` adds exactly canPayDownPayment, downPaymentOutstanding nullable, downPaymentPaymentId nullable and downPaymentPaymentNo nullable. No editable financial read field enters an Add/Update body.
- New `models/down-payment.ts` contains typed target and `{requestId,date}` only. BillService posts to `Bill/{billId}/loan/down-payment`; the actual Result.id is validated as a positive safe integer before emitting a payment identity.
- New standalone `components/down-payment` uses the current shared EditorDialog with translated screen title and record subtitle, readonly full saved down-payment amount and saved recovery bank, required local-calendar payment date, FieldError and StateMessage. Form freezes and global loading balance cover success, false Result, HTTP error, cancellation and destruction. Early date validation returns for null before reading a required signal input. Same attempted date retains the request id for retry; changing an attempted date rotates it. Busy/stale/closing guards and dirty discard keep the parent workflow controlled.
- Saved installments' narrow terms pane shows outstanding value (`—` when unknown), actual source-owned PV number (`—` if none), compact Pay down payment when the server flag permits it. Zero outstanding with no source-owned PaymentId is labelled covered by existing allocations, never asserted as a cash payment or assigned a synthetic PV. No synthetic EMI, interest, bank or amount input was introduced.
- Child visibility participates in parent inert/close/page gates. Success reloads the saved plan, emits changed plus actual paymentCommitted, and existing outer list/details defer their refresh until installments closes. Lifecycle pending hint uses only canPayDownPayment, preserving backend eligibility ownership; positive amounts without a safe action retain the generic review message.
- Two new runtime TypeScript files each occur once in the existing explicit tsconfig application files list. No include root or spec entry was added. New labels exist under the Bill EN/AR vocabulary only.

## Confirmed comprehensive-audit findings corrected

| Finding | Source evidence and correction |
|---|---|
| Installment Pay reused an idempotency key after the user changed the attempted payment date | Existing backend request replay binds date. `installment-payment.component.ts` now preserves the id for same-date retry and rotates after changing the previously attempted date. No payment-policy change. |
| Initial loan terms allowed DownPayment >= BillTotal locally | Existing `LoanPaymentPlan.ValidateTerms` rejects that. Added inline downPaymentBelowTotal validator/message; server remains authoritative. |
| Manual loan rows allowed Interest >= EMI locally and displayed nonpositive principal | Existing `LoanPaymentPlan.ApplySchedule` requires positive principal. Added row-group positive-principal validator, shared inline error under interest and `—` for invalid editable principal preview. Historical readonly data is retained. |
| Manual Add could exceed the existing600 installment ceiling | Existing domain and header limit600. Add handler/button now stop at600; CSV's existing limit retained. |
| Loan-table pagers counted bills | Screenshot and templates confirmed wrong noun. Saved/prepared/archived/replacement row pagers now count installments; revision pager counts revisions. Main Bill list/report pager retained. |

## Audit inventory and retained contracts

| Surface | Source review outcome |
|---|---|
| List/grid/filters | Shared bounded shell/filter/table; current-month range, date-basis radio, all five types, supplier/vehicle/branch/status/approval/id/discount/search, applied snapshots, page/sort restoration and tenant/user-owned memory fallback retained. |
| Columns/ListVM | Exact visible scalar list: id,no,billType,approvalStatus,isVoided,supplierBillNo,purchaseOrderNos,date,supplierBillDate,supplierName,supplierCode,totalAmount,dueAmount,status,createdBy,branchName,vehicles,discount; only canApprove/canUnapprove/canVoid/canAllocate/canAllocateSupplierDebit/canViewJournal/canViewInstallments are additional action-state fields. No nested editor/tenant payload. |
| Report/export/print | Shared all-pages fetch rejects partial failures; translated DataTable exports, captured report filters, fixed report modal actions, saved tax report and ReportPrintService retained. |
| Create/update/view | Five numeric types, routed shared editor/tabs, explicit standalone imports, full-snapshot inputs, no client authoritative tax/totals/tenant fields; saved readonly values retained. No schema-suppression workaround. |
| Lines/GRNs/documents | Shared EditableRows and collection projection, required typed controls, integer quantity, money scales and preview tax owner; selected GRNs with supplier/branch/type request cancellation, missing receipt handling; DocumentUploadTracker save/discard/cleanup-only retry retained. |
| Approval/UnApprove/Void/Journal | UI derives visibility from backend flags; confirmations or typed reason/date form; both failure channels and paired loader; terminal void rule and conditional correction policy retained. Journal uses real linked read values. |
| Ordinary and supplier-debit allocation | Existing typed source/target identifiers and amounts, local required/range/scale validation, current balance reads, dirty refresh/discard and source selection retained. No down-payment cash fabricated by allocation UI. |
| Loan plan and saved installments | Readonly financing placeholders with no supplied source remain `—`; FlatRate retains original label; actual Paid links and server summary/status/eligibility remain authoritative. Existing direct next-eligible Pay retained. |
| Reschedule/settlement/history | Frozen request bodies and preview version, invalidation on form changes, exact prepared-input comparison, explicit required agreed interest including0, readonly saved histories/actual PV retained. |
| Routing/security | `/Bill` root routing is authenticated in its parent; feature routes retain canDeactivate. No invented authorization API. Historical separate `/BillDetail` frontend route observed; root checked no corresponding backend generic mutable BillDetail service/controller. Route removal stays outside this bounded change. |
| Error/loading/cancel/stale/refresh | Source-only review of all12 feature templates and25 non-test TS files; no swallowed HTTP-error callback, any, toISOString date transport or DataTable fillHeight found. Existing fillHeight uses are EditableCollectionTable's real public input. |

## Shared conformance evidence

| Concern | Canonical owner and actual reference | Target match |
|---|---|---|
| Routed editor/tabs/scroll | UI1/13; Workshop Job editor; shared editor/tabs/form-section | Existing Bill shell retained; down-payment uses same shared form/body/scroll classes inside its shared dialog. |
| Action modal | UI7/13; Workshop Job close-job; shared EditorDialog inputs/outputs | Translated title/subtitle, explicit edit mode, contentPadded, controlled primary/close/escape/shown events. No local modal CSS. |
| Field validation/date | UI17/19; actual FieldError and DatePicker | Required date and before-Bill error, local date transport, calendar overlay closed on shown, standard parser and inline error. Amount/bank readonly. |
| Table/action state | UI6/7; actual DataTableColumn/link/input declarations | Only real public fill input; backend flag gates action both in template and handler. |
| Feedback and stale responses | UI22/28; actual LoadingService/freezeFormState + close-job behavior | One mutation success interceptor, inline failures suppress duplicate error toast, balanced global counter and destroy/version/identity checks. |
| Theme/RTL/responsiveness | UI24/25; shared owners | No new feature styles, colors, DOM query, viewport shell calculation or deep overrides. Existing user-requested narrow terms/wide schedule grid retained. |

## Source checks and limitations

- TypeScript `createSourceFile` syntax parsing only:27 files (25 feature non-test files plus EN/AR); zero parse diagnostics. Angular `parseTemplate` only:12 feature templates; zero syntax errors.
- JSONC parsed; each new runtime entry exactly once. Literal Bill translation scan resolves345 complete literal keys in both vocabularies; one dynamic `bill.editor.` prefix intentionally excluded. No duplicate Bill vocabulary property keys.
- Scoped tracked Git whitespace check passed; direct source whitespace/merge-marker scan also covered41 TS/HTML/SCSS files, including untracked files, with zero findings.
- Read complete current sources of affected untracked components/models (Git diff omits them), complete tracked service/config diffs and corresponding Bill vocabulary additions. Root owns comprehensive repository-wide scoped diff reconciliation; unrelated dirty translation hunks preserved.
- Owner compilation/template type checking, browser/visual/RTL/theme/short-height behavior and backend/API integration are not certified by parser checks. Root/backend worker owns additive schema/migration handoff, source financial proof, in-app guide and final project status.

## Owner verification handoff

Verify positive/zero/downpayment already covered by external allocations, nullable unknown gap, source-owned actual PV display, bank/date failures, same-input retry versus changed date, Paid EMI preservation, server status/lifecycle flags after payment and deferred outer refresh. Also check DownPayment==Total, Interest==EMI/>EMI,600-row ceiling and correct loan/revision pager nouns in EN/AR. Check narrow/short-height/RTL/theme and cancel/error paths. Suggested frontend commit message: `feat(bills): add source-owned loan down-payment action and tighten loan validation` (suggestion only).
