# Movements current frontend contract freeze — 2026-10-09

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Scope | Angular src/app/modules/Movements and its existing module user guide |
| Evidence | Current services and backend Add VMs/filter producers; historical MOVEMENTS_FRONTEND_CONTRACT_FREEZE.md and LOGS_MOVEMENT_* frozen contracts |

This handoff reaffirms the 2026-10-07 frontend contract without rewriting that historical record. The owner requests review and implementation according to the documents for the Angular path. Backend producers are read-only evidence; no endpoint, persistence, business workflow, accounting, permission or schema change is authorized by this handoff.

## Frozen decisions

- UI01 list with controlled modal: Collection, Delivery, Custody, Workshop, WorkshopMovement, NRM. WorkshopMovement retains its single document collection. Reference list is Workshop/Job; modal is the actual shared EditorDialog public contract and UI13 composition. Logs is an operational paged read/report exception with the existing six-tab viewer and Check Card, preserving its five source adapters and atomic document upload.
- Backend shape: existing normal entities (BE13), WorkshopMovement document child contract (BE14), Logs report exception (BE17). Exact services, inherited controllers and Add VMs remain unchanged. Existing backend shortcomings stay report-only.
- Preserve historical column, filter, detail/write, action and route matrices. Current producer evidence confirms nullable string mileage for Collection/Delivery/NRM and signed nullable Int32 mileage for Custody/WorkshopMovement. No extra ranges, fields, lifecycle states, authorizations or unsupported sorting.
- Retain Create/View for movements; existing Collection Delete, Workshop Edit and selected Custody/WorkshopMovement/NRM Print. Logs View/CheckCard/Report/Excel and existing eligible document uploads remain. No new Edit/Delete/activation on other movements.
- Calendar range filters use shared date utilities and applied snapshots; movement DateTime preserves local wall-clock transport. Lists retain actual server paging/counts and complete applied-result exports.
- Fix only verified conformance/functional defects under UI1–11/13–19/20–29 and Master5: public shared owners, typed forms, controls/errors/loading, cancellation/identity gates, controlled close/unsaved state, temporary freeze preserving intentionally disabled controls, and readable source. A new material contract conflict stops only its affected portion and is reported to root.
- Temporary pending decisions/requests reuse shared freezeFormState where appropriate; no feature-owned clone of the disabled-state traversal. Inline reads/mutations retain their declared interceptor suppression and one feedback owner. Preserve failure values and dirty state.
- Guide completion: update existing UserGuide/content/movements-guide.ts after final implementation, including all seven screens, actual actions/prerequisites/validation and EN/AR content. Keep existing /UserGuide/movements registration/menu link; root owns shared/translation/guide files.

## Execution boundaries

Initial recipe -Check passed all eight packets. Phases 0–6 apply within the frontend scope; backend phase establishes read-only contracts. No new maintenance/evolution plan is required: existing owners and workflows are fixed, and no redesign is proposed. No supplied screenshots or unresolved business decisions are used.

No Movements source was dirty at discovery. Frontend already has unrelated Limousine, Workshop/Job, HRM, guide reader, route, sidebar and vocabulary changes; backend has unrelated Job/Payroll/Limousine changes including owner migrations/snapshot. Preserve all. Do not modify reference modules or backend, run builds/tests/lint/browser/database/migrations/commits/push/deploy/Graphify/Sigma MCP, or edit generated packets directly.

Independent ownership after freeze: Delivery/Custody; Workshop/WorkshopMovement/NRM; Collection. Root owns Logs, guide, shared integration, complete diff review and final reconciliation. Each worker records actual before/final reference comparisons in its own review handoff and reports requested translation/shared changes for root integration.

## Source reconciliation addendum — 2026-10-09

Current outer paths are case-sensitive /collectionMovement and /logsMovement (src/app/pages/routing.ts); the guide's former uppercase links were stale. The reader already registers MOVEMENTS_GUIDE, but the Movements sidebar group lacked a guide entry. Added /UserGuide/movements under that existing group; no route/reader rewrite required. This corrects the earlier discovery assumption that the menu link already existed.

WorkshopMovement Save is a composite UI22 operation: POST plus required tracker cleanup. Retained the existing request/response payload and cleanup API; use the already-supported X-Skip-Success-Toast header for that POST and the root MessageService for one backend-message toast after successful cleanup. Failure retains cleanup Retry and never repeats the successful POST. This is feedback ownership under the frozen shared-owner correction, not a business/API change.

Nine stale existing spec scaffolds are corrected to import their actual movement component exports. No test added, assertion changed or test executed; compiler/provider/runtime verification remains with the owner. Final decisions, source checks and guide acceptance are recorded in MOVEMENTS_CURRENT_FEATURE_REVIEW.md.
