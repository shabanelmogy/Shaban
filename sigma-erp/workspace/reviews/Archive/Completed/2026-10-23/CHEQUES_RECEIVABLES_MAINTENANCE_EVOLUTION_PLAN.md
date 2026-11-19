| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Cheques Receivables — 2026-10-06

User instruction: «راجع : src\app\modules\Banking\ChequesReceivables وطبق التعديلات وفقا للوثائق». Screenshots 1–7 establish visible content; guides own presentation. The owner standing rule in Master 2 resolves source-supported missing details. No change to accounting entries, access restrictions or existing data is approved or planned.

## Existing state, impact and decisions

| Area | Existing owner | Classification / target |
|---|---|---|
| List | Angular ChequesReceivables/list + PDCReceivableService.GetManyAsync | Replace ms-lib in place; real count/paging, existing filters, full export/print |
| Record | PDCReceivable entity, Add/Update/Detail VMs | Refactor typed frontend to existing nullable IDs, payment enum and BankName text; retain customer/contact/agreement/branch/maturity inputs |
| Actions | MatureSingle/MatureBulk/ReturnCheque/Resubmit | Keep backend accounting ownership and transitions; create typed action dialogs |
| Import | Shared ImportCsv + existing PDC Add writer | Extend owning PDC API with validated row import; no separate record owner |
| Batch number | Explicit screenshot 7; no source field | Create nullable BatchNo, max100, no invented value/backfill; requires owner migration |
| Shared controls | DataTable, EditorDialog, FilterPanel, date helpers, ReportPrint | Reuse; no feature copies |

Rejected alternatives: keep obsolete bank/payment IDs (incompatible API); use raw screenshot layout (guide conflict); hide Import/Print or add no-op buttons (missing business); put BatchNo into Notes (loses field semantics); import by contact name (ambiguous). CSV uses shared parser/template, not a speculative XLSX importer. ContactCode resolves exact live Contact.No in tenant scope; ContactName is optional verification text, never creates or renames a contact. BatchNo is informational, no uniqueness/accounting meaning inferred.

Import is atomic: all rows must validate before any save. Response contains rowNo/isSuccess/message/id; failed validation returns diagnostics without persisting any row. A successful batch uses one graph save/implicit transaction. No replay/idempotency guarantee is invented; an ambiguous transport failure must require reconciliation before retry.

Rollout: owner runs Add-Migration AddPdcReceivableBatchNo, reviews nullable column and existing null values, applies it before updated API. Restore prior application versions if necessary; no reviewer database steps. Other PDC readers ignore additive BatchNo; list contract retains currently displayed audit columns and payment method, while unused navigation graphs are removed.

Implementation order: freeze → backend read/import boundary and frontend list/editor independently → action/import dialogs consume frozen contracts → root wiring and reconciliation. Verification is source-only; owner checks compilation, migration, forms, all transitions, import validation/atomicity, full export/print, RTL/theme/narrow layout. No builds/tests/lint/browser/database/commits/pushes.
