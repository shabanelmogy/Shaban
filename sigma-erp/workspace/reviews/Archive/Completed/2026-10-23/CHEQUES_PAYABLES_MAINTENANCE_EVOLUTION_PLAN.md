| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Cheques Payables maintenance / evolution — 2026-10-06

User request: «راجع : src\app\modules\Banking\ChequesPayables وطبق التعديلات طبقا للوثائق» with five functional screenshots. Implementation is authorized. This freeze covers independent read/editor/import slices; changing the bulk posting-account policy remains excluded pending the owner's answer.

## Existing state, impact and decisions

| Area / owner | Existing state | Classification / target | Evidence / alternatives |
|---|---|---|---|
| Angular ChequesPayables list | ms-lib, no typed paging/filters, obsolete bankName/paymentNo/supplierName fields | Replace with shared list/filter/DataTable; retain audit and payment-method columns | UI1/3–8; Workshop Job list reference; no second screen |
| Angular editor | routed untyped form; tenant/audit/status sent by client; no validation/error cleanup | Refactor into list-owned Create/View/Edit dialog, preserving supplier/customer/contact/branch/maturity inputs | UI13/15–19; fields-only document; maturity posting is a separate domain action |
| PDCPayable service and controller | redundant listing override, missing totalCount, unbounded paging | Refactor to inherited read pipeline and feature filter/order hooks | BE5–9/13; BranchService reference |
| Entity / write VMs | no BatchNo despite import screenshot | Extend with nullable BatchNo, max100, no uniqueness/default/backfill | Reviewer decision (owner standing rule, Master2): minimal new text reference matching cheque-number limit; existing rows remain null. Reject embedding batch in Notes (loses separate content), and silent discard |
| Import | no feature importer or bulk import API | Create shared CSV preview + sequential ordinary Add requests; failed rows retained; saved rows never resent | UI22 shared CSV; existing Add VM is validation/persistence owner; no parallel import backend |
| Maturity | existing single-account and per-bank bulk resolver, payment journals | Keep posting logic; expose existing typed domain actions | Accounting effect remains backend-owned; an account-policy change awaits owner input |
| Print/report/export | screenshot actions, no feature report endpoint | Create complete filtered register using list columns and shared ReportPrintService; Excel uses same applied snapshot | Reviewer decision: smallest existing read owner, not a new financial report calculation |
| Auth / tenancy | AuthGuard, root HttpClient, backend tenant-scoped repository | Keep | No fabricated permissions or client tenant |

Schema impact: BatchNo optional column only; owner runs `Add-Migration AddBatchNoToPDCPayables` before using imports/editor against this API. No migration/snapshot edits. Backend before frontend rollout; no historical rewrite. Rollback application changes only after considering new batch references.

Slices: Phase0/1 discovery+freeze, Phase2 backend/read/grid, Phase3 editor/import, Phase4 existing state actions, Phase5 integration, Phase6 reconciliation. Separate non-overlapping component ownership permits agents after this freeze. Backend/app source was clean in the target feature; other extensive user changes (including dictionaries/Layout/styles/tsconfig) must be preserved.

Verification: source diff, exact property/filter/endpoint parity, EN/AR parity, loading/failure/cancellation and shared-owner comparison. Owner performs build/runtime, every CRUD/state action, partial imports, >100-row export/print, RTL/theme/narrow/keyboard and schema verification. No builds/tests/lint/database/browser/commit/push/deployment by agents.
