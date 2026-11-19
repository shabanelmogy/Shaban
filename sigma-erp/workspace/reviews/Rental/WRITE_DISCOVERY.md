# Rental write/action discovery

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Rental Agreement and Booking editors, action dialogs, write models/services, and directly related backend contracts; list presentation excluded |
| Verification | Source-only; no build, test, lint, browser, database, migration, commit, or push |

## Canonical shape and evidence

The Agreement and Booking forms are routed document editors. Their small action surfaces (void, delivery date, sales person, deposits, and document upload) are typed dialogs. The applicable owners are Master blocks 3–5; UI blocks 10, 11, 13, 15, 17, 22, and 28; backend blocks 5, 6, 8, 14, and 18; and Phase 03/04 as derivative packets. The packet drift check was performed by the root review and found every generated packet stale except Phase 01, so canonical book rules govern this audit.

| Concern | Canonical owner | Target evidence | Status |
|---|---|---|---|
| Routed editor dirty exit | UI 10/13, Phase 03 | `Agreement/components/details/DetailsComponent.requestClose`; `Booking/components/details/DetailsComponent.requestClose`; route files | Deviates |
| Upload lifecycle | UI 13, Phase 03 | Booking editor `uploadDocument`, pending/removed path sets and save/close cleanup; Agreement document controller atomic replacement | Deviates for Booking editor |
| Typed action dialog close lifecycle | UI 10/11/13, Phase 04 | Booking deposit `requestClose`; Agreement Documents `closeUpload` | Deviates |
| Write payload field ownership | Master 4, BE 3/5/14 | Angular create models/builders; backend Add/Update VMs and calculation services | Matches for calculated totals |

## Confirmed findings and safe corrections

| ID | Severity | Evidence | Concrete failure | Safe correction | Decision status |
|---|---|---|---|---|---|
| RW-01 | High | `Agreement/components/details/details.component.ts:413-416` navigates immediately even when the routed form is dirty. `agreement.routes.ts` has no `CanDeactivate` guard. | Cancel/Close discards a partially edited agreement without confirmation. Browser Back or another in-app navigation also bypasses the component method. This violates the required dirty-exit contract for every routed-editor exit. | Add one feature-owned dirty-exit guard used by Cancel, browser Back, and route navigation. Gate it while saving/loading, use the shared discard confirmation, and allow View/pristine forms through. Keep a single pending-confirmation flag so concurrent exits cannot open multiple confirmations. | Confirmed |
| RW-02 | High | Booking editor uploads immediately to generic `FileUploadService` (`Booking/components/details/details.component.ts:408-442`) and only calls `cleanupPendingDocumentFiles` from the component's confirmed `requestClose` path (`467-490`). `booking.routes.ts` has no `CanDeactivate`; there is no destroy/unload cleanup. | Browser Back, navigation from outside `requestClose`, or destruction after an upload leaves an abandoned file. The form can also be lost without the required discard decision. | Introduce the same routed dirty-exit guard and make all navigation exits pass through it. On confirmed discard, await cleanup of every pending upload before allowing navigation; preserve the editor and show an actionable cleanup error when deletion fails. A backend-owned staged/commit upload API would be stronger, but it is a new API contract and is not required for the bounded safe correction. | Confirmed |
| RW-03 | Medium | Booking editor `deleteRemovedDocumentFiles` fires independent delete subscriptions then clears the set immediately (`details.component.ts:817-822`), and Save navigates immediately after calling it (`392-395`). Delete outcomes are neither awaited nor reported. | Replaced or removed persisted document files can remain orphaned even though the booking save reports success; a failed cleanup is silently forgotten and cannot be retried. | After a successful booking save, run removed-file deletions as a joined operation, retain failed paths, and navigate only after cleanup succeeds or surface a recoverable cleanup error. If record persistence must remain successful independently, explicitly present “saved; file cleanup failed” and retain a retry path. | Confirmed |
| RW-04 | Medium | Booking deposit `requestClose` has no closing/pending signal (`Booking/components/deposit/deposit.component.ts:128-148`). Agreement Documents `closeUpload` likewise starts a new discard confirmation whenever called while the selected file is dirty (`Agreement/components/documents/documents.component.ts:91-105`). | Repeated Close/Escape clicks can create overlapping confirmation subscriptions and duplicate close emissions. The owning list can refresh/tear down while another confirmation is still active. | Add a confirmation-pending signal to each dialog, include it in the locked state, set it before invoking the shared confirmation, and reset it in `finalize`. Re-resolve the current dialog/file state before emitting or resetting after confirmation. | Confirmed |
| RW-05 | Medium | Booking editor records an existing path in `removedDocumentPaths` as soon as the user replaces/removes it (`431-459`). If the user subsequently abandons the edit, `requestClose` clears that set without deleting those existing files (`486-487`), which is correct. However, pending upload deletion is fire-and-forget (`806-815`) and navigation occurs immediately (`488`). | A confirmed discard can still navigate away while cleanup requests are unfinished; component destruction cancels them through `takeUntilDestroyed`, leaving newly uploaded files behind. | Replace fire-and-forget cleanup with a joined, awaited cleanup operation and keep the editor locked until it finishes. Do not attach `takeUntilDestroyed` to cleanup that must finish before the component is destroyed unless navigation is explicitly delayed until completion. | Confirmed |

## Payload and backend calculation audit

| Contract item | Frontend evidence | Backend evidence | Result |
|---|---|---|---|
| Agreement totals/duration/status | `Agreement` create/update payload contains editable inputs and charge inputs but omits `totalCharge`, aggregate total, tax amount, duration, and status (`details.component.ts:644-665`; `models/create.ts`). | `RentalAgreementService.ValidateAndCalculateAsync` rebuilds charge totals and aggregate tax/total, and `ApplyCalculatedValues` persists them (`1600-1653`, `1656-1670`). | Correct: preview-only derived fields are not sent. |
| Booking totals/duration/status | Booking payload contains editable inputs and selected charge rate/excess but omits row total, aggregate subtotal/tax/total, total days/hours, and status (`Booking/components/details/details.component.ts:824+`; `models/create.ts`). | `BookingService.ValidateAndCalculateAsync` rebuilds charge totals, tax, total days/hours and `AddAsync`/`UpdateAsync` assign them (`1249-1302`, `63-71`, `143-150`). | Correct: derived fields are server-owned. |
| Charge detail inputs | Agreement sends user-editable mileage/excess/delivery/collection fields, matching `BookingChargeInputVM`. Booking intentionally sends only rate/included/excess; its backend takes allowed-per-day and excess-rate from the current tariff. | `BookingChargeInputVM` supports the superset; Booking service selects tariff values at `1270-1283`; Agreement service accepts explicitly editable overrides at `1608-1635`. | Compatible; no direct payload mismatch established. |
| Booking document identity | Create sends optional IDs but new rows produce `undefined`; update preserves existing IDs. Backend Add uses `CustomerDocumentAddVM`; Update uses `CustomerDocumentUpdateVM` and rejects IDs outside the aggregate. | `BookingService.ReconcileDocuments` validates duplicates/ownership before mutation (`1305-1343`). | Compatible. |

## Missing or blocked decisions

| Decision | Status | Why |
|---|---|---|
| Whether Booking document files must move from generic pre-save upload to an entity-bound staging endpoint | Missing | Current source proves orphan risk and supports an awaited-cleanup fix. It does not define a new staging token, ownership model, retention period, or endpoint. Do not invent that API during the confirmed-fix pass. |

No other material write-contract decision is Missing. The confirmed corrections above preserve existing endpoints, fields, calculations, and state transitions.
