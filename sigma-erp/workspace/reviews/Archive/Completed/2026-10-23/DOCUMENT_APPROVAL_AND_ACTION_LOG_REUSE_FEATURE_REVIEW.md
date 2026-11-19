| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Reusing approval states and the document action log — 2026-10-22

## Scope and authority

The owner requests reusable documentation for comparable ERP documents, invoices and operational procedures. Canonical ownership is Master block 4, backend block 18 and UI block 7; the sigma-screen-refactor skill is their operational digest. This documentation task changes no application source. The earlier Purchase Order approval/log contract remains the first implementation, not an automatic rollout to every model.

## Per-document adoption record

| Question | Decision to record for each model |
|---|---|
| State mapping | Identify actual saved draft/not-approved, approved and rejected values, including legacy records; the common labels do not rename enums. |
| Approve | Define eligible source state, reason/actor/history, and exactly when accounting, stock or operational effects begin. |
| UnApprove | Define whether Approved can return to Pending and how the real effect is safely removed; block when payment, allocation, consumption, period closure or a dependent document prevents it. |
| Reject | Define Pending-to-Rejected and any explicit Approved-to-Rejected correction, reason and dependency guards. Define a separate Rejected-to-Pending repair if needed. |
| Void/Cancel | Define when an already released effect needs guarded cancellation; no synthetic journal and no reversal journal under the current owner financial rule. |
| Action history | Preserve decision history separately from the generic write log; mark the tracked root with semantic action/reason in its own save. |
| Log coverage | Inventory tracked saves, aggregate child GUIDs and excluded direct SQL/bulk/external writes. Verify tenant-owned root/children and view access before central read. |
| UI | Share one server status/eligibility across approval modal and tab; use the read-only shared Log viewer with a typed feature loader and loading/empty/error/retry. |
| Verification | Owner applies the required audit migration, then checks lifecycle, rollback/retry, tenant isolation, historical metadata-only rows and actual effect cancellation. |

## Source finding that limits the current log

`AuditTrailCaptureService.CaptureChanges` currently includes a `before` value when EF `OriginalValue` differs from `CurrentValue`. For detached `Update`/`UpdateRange`, that inequality does not establish a database-original baseline. The docs now require provenance before a prior value is presented as confirmed; the source implementation still needs correction and runtime acceptance before this guarantee is claimed across models. The interceptor only infers `ApprovalChanged` from `ApprovalStatus`/`ApprovedStatus` and `Voided` from `IsVoided`; other transitions need explicit semantic annotation. Direct SQL, bulk writes and pre-deployment history remain outside this capture boundary.

## Documentation reconciliation

Master block 4 records the shared vocabulary and a document-log decision row. UI block 7 records action eligibility, status surfaces and the shared viewer adoption. Backend block 18 records same-save capture, identity/child read boundaries and the per-model checklist. The skill digest and revision history mirror these rules. Owner migration, source correction, build and runtime checks remain pending; prohibited commands were not run in this documentation task.

The recipe generator refreshed PLAN-00 and PHASE-00 through PHASE-06 because their canonical fingerprints include these blocks. Semantic review confirmed Phase 04 still names the shared confirmation, action-button, quotation and typed-dialog references as presentation references, while Master 4, UI 7 and BE 18 own the new model-specific decisions. Phase 06 remains the final reconciliation packet. `Generate-SigmaRecipes.ps1 -Check` passed all eight packets; the documentation repository's `git diff --check` reported no whitespace error. Its working tree contains unrelated pre-existing documentation changes, which this task preserved.
