| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Correct Vehicle Status maintenance plan — 2026-10-14

Request: review `Administration/correctVehicleStatus` and apply documentation-supported fixes. Tier M screen with a bounded missing derived-status capability, so PLAN-00 precedes implementation. Authority: Sigma AGENTS; Master 1–8; UI screen09/action lifecycle with UI1 routed-shell exception; backend explicit domain action, not generic CRUD.

## Inventory, impact and gap decisions

| Area / owner | Current behavior / evidence | Decision / impact |
|---|---|---|
| Angular correction list/service/models | Suggested label and write both reuse currentStatus; untyped transport, no error callbacks, overlapping reads | Refactor in place; keep route and three endpoints |
| VehicleStatusCorrectionService / detail VM | Last source among NRM, WorkshopMovement, DeliveryMovement, CollectionMovement; suggestion absent | Extend lean response with nullable SuggestedStatus and CanCorrect; backend owns derivation |
| Agreement / movement models | Agreement.DateAndTime/IsClosed and current vehicle; delivery has historical VehicleId with legacy agreement fallback | Extend source candidates with Agreement; retain delivery identity fallback; no schema changes |
| VehicleStatus | Latest CreatedAt/Id read; correction appends history | Keep append-only history and one save; no rewriting/deleting history |
| Shared components / shell | Approved owners already exist | Reuse FeatureTitle/FormSection/SummaryCards/PrimaryActionButton/StateMessage/FieldError/confirmation; remove local legacy wrappers |
| Administration guide | Existing registered module guide | Extend with one EN/AR correction topic |
| Other writers/readers/reports | Read the same VehicleStatus history; Lease close writes Available, replacement writes Hired/Replacement | Keep all other writers untouched; no accounting/availability engine redesign |

## Options and ambiguity resolution

Rejected: keep copying currentStatus (no correction); arbitrary editable status (bypasses domain ownership); global fleet-state engine (outside one-screen scope); infer terminal/sold/replacement status from an insufficient movement row.
Selected: bounded server suggestion from the latest supported source, with unsupported/ambiguous sources returning null. Reviewer decision under Master2 rule6 / owner's standing decision; source evidence and business reasoning follow.

| Source | Suggestion | Evidence and limits |
|---|---|---|
| Open Agreement | Hired | Agreement.IsClosed and DateAndTime; LeaseAgreementService replacement uses Hired for permanent outgoing vehicle. Closed Agreement alone cannot prove release; null when closed. |
| AgreementDelivery | Hired | DeliveryMovement.Type + current vehicle provenance; same hired agreement meaning. ReplacementDelivery lacks permanent/replacement detail: null. |
| WorkshopMovement | Workshop | Explicit workshop vehicle/date/type owner and VehicleStatusType.Workshop; all defined workshop reasons are workshop movements. Null for undefined/missing subtype. |
| NRM | NRM | NRM owner and defined non-rental enum; only NrmStaffMovement, StaffCar, Nrt, NrmCustomerMovement. SoldCarCustomerMovement cannot authorize Sold: null. |
| CollectionMovement | Available | LeaseAgreementService close explicitly creates collection with `Type=null`; this null type is the canonical ordinary close evidence and therefore maps to Available. Defined ordinary collection types use the same mapping; service replacement with same-time delivery evidence remains an ambiguous tie => null. |
| No source / tied latest sources with different target / latest unsupported source | null | Never default missing information to Available or reuse current status as a suggestion. |
| Current ForSale, Defleeted, TotalLoss or Sold | null | Movement alone cannot safely authorize leaving a terminal/disposal state; no guessed reversal. |

Same-source ordering is date DESC then Id DESC; equal timestamps across sources with identical nonnull suggestion may yield that suggestion, otherwise no suggestion. Last-movement display remains deterministic while CanCorrect is false for ambiguous evidence. Report unsupported cases as an explicit capability limit, not an invented state.

## Implementation and verification

1. Freeze read/action/UI contracts; root owns integration and all reviewer decisions.
2. Backend bounded action and frontend page can proceed independently after freeze, no overlapping files.
3. Reconcile DTOs/results, imports, routes, translation parity, guide, complete scoped diffs and whitespace.
4. Owner runs compilation and real interaction/persistence/RTL/theme/responsive checks. No builds/tests/lint/browser/database/migrations/commits/push/deployment authorized.

No entity/EF edits, migration/backfill or historical-data rewrite. Additive response and request assertion are compatible with old request status as a legacy assertion; details in the frozen handoff. Residual movement-writer concurrency is disclosed: no fleet-wide lock claimed.
