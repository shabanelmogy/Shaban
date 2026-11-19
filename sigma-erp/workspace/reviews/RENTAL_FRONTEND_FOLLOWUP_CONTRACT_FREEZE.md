# Rental frontend follow-up — 2026-10-08

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

User requests review of `src/app/modules/Rental` and documentation-confirmed implementation. This handoff extends the existing Frozen RENTAL_MAINTENANCE_EVOLUTION_PLAN and CORE_UI/AUX_UI/WRITE_UI handoffs without changing their business/API decisions. No new screenshots or business requirements supplied. Eight live roots are in scope; backend contracts are evidence only.

Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`. Rental was clean at entry. Sidebar, UserGuide reader, EN/AR vocabularies and tsconfig already contain unrelated owner changes; preserve them. Only directly related shared wiring/content may change. Backend/schema/AutoMapper/calculation ownership and permissions remain unchanged. Source-only execution boundary applies.

Recipe -Check on 2026-10-08: PLAN00, phases00/01/02/04/05/06 match; PHASE03 is stale. Use the canonical detail/write blocks; do not edit generated packets. Required skill: sigma-screen-refactor.

## Shapes and source evidence

Agreement/Booking/Quotation retain routed aggregate editors; MasterAgreement retains frozen create/view fields. Lists follow Workshop Job. TariffCard uses UI13 controlled modal composition (the current canonical correction replaces the historical Fleet modal citation). RentalTariff retains the dense configuration dialog exception, DriverTimeSheet the operational workspace, Planner the grouped timeline exception. Existing backend shapes and all grid/ListVM/filter/write/action contracts remain those in the previous handoffs and discovery tables, subject to current-source confirmation.

| Concern | Book | Actual reference/shared owner | Target finding and permitted fix |
|---|---|---|---|
| Pending discard | UI10/28 | Movements/collectionMovement DetailsComponent.canDeactivate; RxJS defer and ConfirmationDialogService | Agreement/Booking guards currently open confirmation and freeze controls before subscription. Defer opening, recheck identity/busy state on subscription/acceptance, preserve canceled edits and intentionally disabled rates. Apply equivalent confirmed findings in other in-scope editors after audit. |
| Calendar hydration | UI17 | shared date-utils.toPickerDate / current parser | Booking document dates and Agreement delivery context locally concatenate T00:00:00. Adopt validated shared date-only hydration, keeping local datetime controls unchanged. |
| Stable row identity | UI14 | Workshop Job editor, shared EditableRows | Agreement print form loop tracks $index. Track control object; standalone print tracks charge object, preserving possible repeated charge types. |
| Money presentation/previews | UI14/19/24 | shared MoneyPipe and financial-number.roundMoney | Agreement owns a private two-decimal rounding copy and print amounts use number pipe. Reuse shared owners at the same existing precision; tax/quantity percentages retain numeric display. No financial formula or write-contract change. |
| Layout/states | UI1/3/13/22 | Workshop Job list/editor, shared EditorDialog/StateMessage | Preserve shared container-fill shell, fixed actions/scroll owners, error ownership and existing print document layout. Other findings require current source evidence. |
| User guide | Master7; UI23/29 | UserGuide GuideSection/GuideTopic, GuideReaderComponent and existing authored module guides | Rental lacks module content. Create bilingual eight-topic guide from final source and register once at /UserGuide/rental and Rental sidebar. Child dialogs remain in parent topics. |

Action-state/API redesign, historical unsupported MasterAgreement fields, new tariff business rules and unrelated modules remain excluded. No persisted data removal, permissions or accounting decisions are introduced. Existing backend totals remain authoritative; frontend previews omit calculated request totals.

Source-backed amendment before the affected edits: Agreement Deposit still has a private amount-to-words converter hardcoding Dirham/Fils. UI19 explicitly requires the shared amountInWords helper with CommonDTO currencyName/decimalCurrencyName/currencyDecimals; Workshop Job invoice-customer.applyCommonSettings is the inspected reference. Reuse SettingsCommonModel/GetMySetting in its existing lookup batch, leave the optional read-only preview blank until settings arrive, and retain entered monetary values on lookup failure/Retry. Extend CommonSettingsService.getMySetting with optional skipErrorInterceptor (default unchanged) so this inline lookup batch remains the sole error owner. This changes generated wording only, not the deposit amount, ledger calculation, requiredness, API payload shape or accounting behavior. Root also freezes the editable controls of the existing action/deposit/upload dialogs during their pending discard decision under UI10, with record rechecks and existing cleanup gates.

Root owns integration, Agreement/Booking editors/dialogs, guide and shared files. Bounded read-only core/aux auditors own nonoverlapping discovery. Implementation delegation, if used, receives exact file ownership after confirmed findings. Final source evidence and reconciliation are appended to RENTAL_FEATURE_REVIEW.md; owner compiler/runtime/visual acceptance remains pending.

## Source-backed continuation amendments — 2026-10-09

Final audit confirms additional UI22 primary-dialog reads/saves lacking global
loader pairs and UI28 deferred callbacks lacking component teardown, including
Quotation nested animation frames. Reuse LoadingService/finalize and
timer/takeUntilDestroyed or cancellable native frames; retain local busy/error
states and record readiness/identity checks. Invalid Void/Delivery-date submit
uses UI27 shared focusField for the sole invalid input. No API changes.

Check-Translations reports all eight sideMenu.rentals Arabic keys absent;
current Arabic source also lacks sideMenu.rental. These are the existing Rental
sidebar and new guide title owners. Add the matching Arabic leaves under the
existing sideMenu (UI23), preserving unrelated vocabulary changes.

The optional Common settings inline-read contract is promoted to UI2/22, the
required skill and history (UI1.94). Canonical blocks remain authoritative;
generated packet regeneration/semantic review is owner-pending.

## Owner amendment: DriverTimeSheet Save validation — 2026-10-09

Explicit owner instruction keeps Save active even when inputs are missing, so
clicking it reveals validation. Remove invalid/pristine/empty-row eligibility
from the button and show the footer before an agreement is selected. Retain
operational loading/saving/discard/read-error gates and the existing invoiced
CanEdit domain lock. Save checks those gates, then marks the typed form touched
and reports missing agreement/rows/driver/hours before any API request.

| Concern | Book/reference | Target decision |
|---|---|---|
| Invalid submit | UI19/27; Workshop Job editor.save markAllAsTouched and shared FieldError/focusField | Validation belongs in save(), not button invalid/pristine gating; show driver row FieldError and focus existing/identified input. |
| Fixed primary footer | UI13; Workshop Job editor footer and PrimaryActionButton public disabled/loading | Keep footer visible on empty selection, use existing busy/business gates only. Operational workspace exception remains. |
| User guide | Master7; existing Rental Driver topic | Document Save validation on click and unchanged invoiced lock. |

No API/payload/domain/AutoMapper/schema or grid-column change. Source-only
verification; no delegation for this small sequential correction. Recipe Check
still reports PLAN00 and PHASE00/02–06 stale, PHASE01 matching; canonical
blocks govern and generated files are not edited.

## Owner follow-up: blank Branch-wise Tariff Settings — 2026-10-09

Status: Frozen. Owner confirms the entire dialog body is blank, rather than an
empty displayed table. UI13 controlled single-section modal and UI14 editable
collection are the selected shape; shared EditorDialog.height/dialogStyle,
EditableCollectionTable.fillHeight/stickyHeader and src/styles.scss
sigma-editor-form are the inspected owning declarations (UI1/13/14/22).
The current settings dialog has no definite height and its plain body/form
wrappers do not join the bounded flex chain. Extend the existing shared shell
with a viewport-bounded height, use sigma-editor-form on both shrinking
wrappers, and let the table frame own row scrolling. This is a source-supported
layout correction; the exact runtime cause and visual acceptance remain pending.
Consolidate the duplicate addDisabled binding so pending decisions stay locked.
The saved-settings-only GET and full-replacement PUT, branch lookup, row
validation and adjustments remain frozen; no implicit rows/default settings.
Update the parent tariff guide topic and report. No backend/schema change,
runtime command or delegation is required.

## Owner amendment: withdraw branch settings temporarily — 2026-10-09

Status: Frozen. Owner replaces further blank-dialog diagnosis with "remove it
for now". Withdraw the Branch-wise Tariff Settings entry from both tariff lists
that carry this identical title (/RentalTariff and /LeaseTariff). UI3 shared
FeatureTitle projects optional actions; removing this header action leaves each
list/grid and its existing vehicle-type editor intact. Neither settings dialog
has a route or another opening caller; its settingsVisible starts false.
Retain the dormant settings implementation, shared service and persisted
settings for this explicitly temporary withdrawal, rather than deleting data
or redesigning tariff calculations. The entry point is the only source change
needed to make both dialogs inaccessible. Update both module guide topics to
remove their settings task and explain temporary unavailability. Other Lease
owner/peer changes remain intact. UI3/13 and Master7/PHASE06 govern; no new
canonical rule, generator drift, runtime permission or delegation is required.
