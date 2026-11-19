# TRANSPORTATION Frontend Contract Freeze

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Frozen editor and discard contract

| Editor | Shape | Pending decision | Restore rule | Payload/API impact |
|---|---|---|---|---|
| Transaction | list-owned dialog | `freezeFormState` around `confirmDiscard` and deferred route guard | Restore only when visible and unfinished; preserve dirty/value state | None |
| TransactionItem | list-owned dialog | Same | Same | None |
| TransportationAgreementItem | list-owned dialog | Same | Same | None |
| TransportationInvoice | list-owned dialog | Same | Same | None |
| TransportationAgreement | list-owned dialog with editable child collection | Same plus `EditableRows.freezeParentOnConfirmation=true` | Same; row helper rechecks identity and `canMutate` | None |
| TripSheet extra trip | list-owned dialog | Same | Same | None |

## Route and compatibility decision

Existing compatibility routes (`create`, `view`, `edit`, and legacy `details`)
remain in place because current source and menu/deep-link consumers use them to
enter the list-owned dialog. They are recorded as a compatibility exception to
the dialog-only route recommendation; this task does not remove URLs or change
navigation behavior.

## Handoff

The frozen contract authorizes the scoped frontend implementation and final
source reconciliation. Runtime, browser, and owner visual acceptance remain
pending under the canonical verification rules.

## 2026-10-09 renewed review handoff

This append records the current request to review `src/app/modules/Transportation`
and implement documented fixes. The earlier handoff remains historical. The
implementation scope is frontend source plus its owning user guide; backend
producers are read for factual compatibility only.

| Confirmed repair | Frozen behavior and source evidence |
|---|---|
| Agreement pending exit | Capture id, mode and editor version; use one deferred subscription, visible/unfinished/busy checks before and after the decision, and shared `freezeFormState`. Keep dirty state until successful Save or actual close. UI10/28; current Agreement guard marks pristine inside its decision and checks only id. |
| Standalone item pending exit | X/Cancel/Escape delegate to the same `canDeactivate` decision as route navigation, with id/mode/version gates. UI10/13; current Item duplicates an immediate confirmation in `requestClose`. |
| Retry during pending exit | Invoice/Item detail and lookup reads cannot start during discard; detail reload cannot overwrite a dirty form. UI10/28; current public retry methods omit these gates. |
| Agreement list response | Use server TotalCount and page metadata; if a nonempty result has become shorter than the requested page, request the actual last page. Bind existing `transportationAgreement.pageReport` and suppress an empty-success message when a request failed. UI6/22; current list lacks these bindings/recovery. |
| Agreement lookup errors | Preserve safe declared/HTTP errors through `apiErrorMessage` and existing inline translated error owner. Successful partial options remain available for Retry. UI22; current catchError discards all server messages. |
| Agreement modal identity/focus | Screen name remains in title; existing translated agreement-number label plus saved identifier is its subtitle. `focusOnShow=false`; close controls reflect detail/lookup pending state. UI13/17. |
| Item clock input | Remove `dateNumericInput=false`; the existing shared DatePicker owns numeric clock characters and retains invalid partial values. UI17; time grammar and saved precision remain in shared time-utils. |
| User-guide coverage | Cover all seven screen identities with bilingual authored topics, operational routes, actual prerequisites/actions and current backend limitations. Master7. |

No endpoint, field nullability, required set, financial formula, permission,
schema, compatibility alias or action-state transition changes are frozen by
this handoff. Source-supported read fixes may be appended after bounded discovery
and before their implementation. Material producer defects remain reported,
not converted into invented frontend business rules.

### Bounded-discovery additions, before implementation

| Repair | Frozen contract |
|---|---|
| Transaction/TransactionItem Int32 filter | Replace duplicate signed Int32 validator arrays with existing `int32ValueValidator`. Keep optional empties and -2147483648..2147483647, all filters/queries/payloads unchanged (UI19). |
| Scalar close state | Transaction/TransactionItem/Invoice/Item shell closeDisabled includes their actual pending detail/lookup state, matching the guard (UI10/13). |
| TripSheet calendar year | Reuse toPickerDate for a parsed month, shift with Date.setMonth and retain parseMonthValue's 0001..9999 transport bounds. Query uses existing currentMonthRange(date). Repair that shared helper with setFullYear so valid years 0001..0099 are preserved instead of coerced to 1901..1999 (existing UI17 full-year invariant). |
| TripSheet numeric date-time | Remove the explicit DatePicker numeric-guard opt-out; DateTime validator, wall-clock payload and saved time precision remain unchanged (UI17). |

Root owns the shared date helper and its owning documentation synchronization.
Exclusive parallel ownership: Transaction/TransactionItem agent owns their
two list TS and two detail HTML files; TripSheet agent owns only its list TS
and detail HTML. Backend contracts were traced read-only; no producer change
is required for these frontend repairs.

TripSheet extra-trip detail source has the same duplicated immediate discard
path and retry-during-decision gaps as Item. Freeze the same one-decision
id/mode/version contract for it; root owns its detail TS, agent owns detail
HTML closeDisabled/numeric guard. Both Transaction list templates omit
showEmpty on declared/HTTP failure: root owns their two HTML bindings to
`!errorMessage()` (UI6/22). The existing Transportation guide is registered in
the reader but its sidebar link is absent; add one `/UserGuide/transportation`
entry using existing `userGuide.title`, keeping the current menu and unrelated
sidebar edits (Master7).

Literal-key source reconciliation confirms existing English
`sideMenu.transportation` and `sideMenu.transportations.{transportationAgreements,tripSheet,transportationTrips}`
have no Arabic counterparts. Add exactly these Arabic leaves in the current
sideMenu block (UI23), preserving unrelated vocabulary changes. No key rename.

Final UI17 conformance binds `focusOnShow=false` in both Transaction editors
(their shared date controls already prevent focus-open). Agreement identity
uses a bilingual `transportationAgreement.recordSubtitle` with `{{no}}`, rather
than concatenating an identifier into its translated label. All three remain
on the same EditorDialog shell and keep its defaults.

### Owner correction: Transportation guide menu name (2026-10-09)

Frozen: the owner's sidebar-label correction supersedes the generic
`userGuide.title` choice above. Use `userGuide.transportationMenuEntry`, with
EN `Transportation Guide` and AR `دليل النقل`, following the existing
Customers/Workshop module-specific guide entries and UI23 bilingual ownership.
Keep `/UserGuide/transportation`, icon, order and styling unchanged. No API,
domain, content or other module menu change is authorized by this correction.
