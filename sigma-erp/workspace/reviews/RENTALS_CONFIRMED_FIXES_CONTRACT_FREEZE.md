# Rentals confirmed fixes — 2026-10-26

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Authorization | Owner: «عدل الملاحظات» — implement confirmed findings R01–R12 from RENTALS_FULL_STACK_REVIEW.md |

## Frozen corrective scope

This handoff extends the existing Frozen Rental maintenance/CORE_UI/WRITE_UI/FRONTEND_FOLLOWUP contracts. Current menu still resolves eight Rental roots. Rechecking source confirms the reviewed consumers/producers; all eight recipe packets pass at task entry. Existing user/shared/customer/receipt/dashboard changes remain untouched. The backend/frontend repositories are separate; Rental feature source is clean at entry. Root owns integration, complete scoped diff review and final report. Implementation continues through reconciliation and bilingual guide handoff, without a further approval step.

| Findings | Frozen repair and preserved authority |
|---|---|
| R01 | Filter calculator children by the root tenant and live `IsDeleted != true`, matching the existing editor. Preserve root default-card/daily/type selection and pricing formulas, legitimately multiple rates, tax/numbering authority and historical saved contracts. Replace the confirmed four-sibling single-query fan-out with bounded split/projected reads if source-compatible. No deletion/backfill/schema action |
| R02 | Both parent route guards delegate to the actually mounted main editor or branch-settings child. Reuse one deferred subscription-owned dirty decision, busy/identity recheck and frozen form restoration; cancel keeps draft/disabled state. Existing write navigation protection stays independent |
| R03 | Planner excludes voided rental agreements from operational HIR reservations; retains closed historical intervals, existing live/tenant predicates, clipping and booking priority |
| R04/R07 | Quotation restores initial URL grid into applied snapshot. Quotation/Master lookup loading/errors are separate from grid errors, and Retry reloads failed lookups. Exact list/filter/page/export contracts remain unchanged |
| R05/R11 client | Planner uses one last-successful request/range/result snapshot for headers/caption/cells. Editing filter draft does not relabel old data. A captured successful query may display its own range even if draft changes during request; failure cannot combine new range with old results. Zoom reprojects the displayed interval. Preparse intervals/precompute per-slot status once per successful data/zoom snapshot; preserve HIR preference and current slot-boundary semantics. No full-fleet truncation/date cap/paging contract change |
| R06 | Saved source-supplied driver/customer/type/staff labels merge into initial option arrays only; preserve selected IDs and active new-choice eligibility. View need not depend on edit-only choices when its returned labels suffice. Never fabricate absent labels or remerge prior-context detail labels from later cache watches |
| R08 | Required routed bootstrap feeds mounted ReferenceLookupStatus page scope, overlapping grid count until all required reads finish. Body-appended dialog reads use one local shared StateMessage and suppress table mask; use no hidden page count for that dialog-owned read. EditorDialog's existing save foreground is retained. Optional source-customer currency context reads need explicit loading/error/Retry if consumed; no silently swallowed failed reads. Existing error, disabled, aria-busy and cancellation remain |
| R09 | Approved Customer/Branch/Country/PaymentMethod exact selectors delegate to their real sources. Finite successful bootstrap precedes once-bound ReferenceLookupBindings/watch with same URL/inline feedback identity, selected-ID/current-row getters, context clear, retained refresh silence/error/Retry and DestroyRef teardown. Common settings remains finite singleton with no document-policy watch. Other direct references/options/tariff/policy/operational reads stay direct, without new eligibility or socket |
| R10 | Driver workspace consumes freshly returned per-row CanEdit as well as existing option metadata before enabling edits/Save. Backend still rechecks invoiced. Preserve owner's Save-active-on-invalid/pristine rule. Do not invent voided-time-sheet policy |
| R11 server | Project only latest VehicleStatus per vehicle on server with CreatedAt DESC then Id DESC and existing null/tenant/live semantics. Existing latest-state index is retained. Narrow confirmed whole-entity Master/Driver option overfetch if exact labels/flags/contracts preserved; no parallel EF on one DbContext. Composite Booking/options retains richer frozen metadata; avoid new endpoints/caching without separate contract |
| R12 | Both quotation master-existence action flags use writer-equivalent tenant/live scope. Retained soft-deleted draft master no longer blocks valid current actions. Existing approval enums/transition graph unchanged |

## Shapes, references and source conformance before edits

Agreement/Booking/Quotation: routed aggregate editor, Workshop Job list/editor UI02 reference. MasterAgreement: retained create/view exception. TariffCard: controlled shared modal. RentalTariff: frozen dense dialog. DriverTimeSheet: operational workspace. Planner: frozen grouped complete timeline. Actual shared declarations inspected: ReferenceLookupBindings.bind retains selected options and clears explicit null context; ReferenceLookupStatus uses page default/dialog token; EditorDialog body portal/save progress; BranchTariffSettings.canDeactivate uses deferred confirmation/freeze. No new wrapper/palette is needed. UI1/2/6/10/13/15/16/22/28/29, BE2/7/8/17/18 and Master4/5/7 govern; applicable PHASE00–06 packets have passed drift check.

## Ownership and parallel handoffs

- Core UI worker owns `modules/Rental/{Agreement,Booking,RentalQuotation,MasterAgreement}/` frontend files only. Implements R04/R06/R07/R08/R09 and supplemental contact/source-customer read lifecycle. No shared/guide/vocabulary/backend edits; request coordinated missing capability from root.
- Auxiliary UI worker owns `modules/Rental/{RentalTariff,TariffCard,DriverTimeSheet,RentalPlanner}/` frontend files only. Implements R02/R05/R08/R10/R11 client. No shared/guide/vocabulary/backend edits.
- Backend worker owns `SiGma.Business/Services/{TariffCalculateService,RentalPlannerService,RentalQuotationService,RentalMasterAgreementService,DriverTimeSheetService}.cs` only; implements R01/R03/R11 server/R12 and exact compatible projection optimizations. No DTO/entity/configuration/snapshot/migration/controller/base/reference edits.
- Root owns shared BranchTariffSettings cache adoption, guide/vocabularies if required, documentation, integration and final reconciliation. Agents are not alone in the working tree, must preserve peer/user changes and never revert them. No overlapping file edits.

## Verification and exclusions

Source-only diff, imports/types/DTO/route/translation/namespace and loading/cache lifecycle review. Builds/tests/lint/browser/database/migrations/commits/push/deployment remain prohibited. No EF/schema change/index implementation; reviewed conditional index proposals remain owner-measured hypotheses. Runtime visibility, SQL translation/actual plans and cold/warm timing remain pending with the reproducible conditions in the source review. No new tariff formula, financial/approval migration, permissions, destructive data change or historical master field redesign. User guide updates cover final actual behavior before handoff. Findings apply established rules; promote book+skill only if a verified new reusable rule/capability is needed.
