# Limousine Trip Billing Contract Freeze

| Status | Owner verification pending |
|---|---|
| Frozen | yes |

## Scope

- Move the TripBooking grid `status` column immediately after `no`.
- Complete the finished-trip billing handoff to the shared Vouchers Invoice workflow.
- Preserve the existing partial-invoice model and server-owned tax/amount allocation.

## Evidence and selected shapes

- Frontend list: `TripBooking/components/list/list.component.ts`, typed `DataTableColumn<TripBookingDTO>[]` and `ActionList<TripBookingDTO>[]`.
- Frontend invoice entry: `Vouchers/Invoices/Invoice/components/list/list.component.ts`, where invoice type is selected from the existing dropdown.
- Backend transition: `TripBookingService.FinishCoreAsync` sets `TripBookingStatus.Finished`, charges and tax.
- Backend billing boundary: `LimousineInvoiceService.CandidatesAsync` and `GenerateAsync`; existing `LimousineBillingService` owns remaining-balance validation.
- Canonical guidance: UI blocks 5–7 and 22–25; backend blocks 5–8 and 15; packets Phase 01, 02, 03, 04 and 06 after recipe `-Check` passed.

## Frozen decisions

| Concern | Decision | Evidence |
|---|---|---|
| Grid order | `no`, `status`, then existing business columns; actions remain the shared first column | User request and UI block 5 |
| Invoice action | Show `Generate invoice` only when `status === Finished` and `amount > billedAmount`; open the shared `/Invoice` screen with Limousine Single type and trip context | TripBooking DTO exposes status/amount/billedAmount; the Vouchers Invoice route already exists |
| Eligibility | Candidate reads and generation accept only `TripBookingStatus.Finished` trips with positive remaining gross balance | User requirement and FinishCoreAsync state transition; backend must enforce the invariant |
| Financial ownership | No client total or tax calculation changes; `LimousineBillingService` and existing invoice generator remain authoritative | Existing billing service and backend pattern 15 |
| Persistence | No entity, DTO storage, or EF schema changes | All changes are filters, action wiring, translations and guide text |

## Action-state contract

| Action | Source state | Target/effect | Backend enforcement | Failure/refresh |
|---|---|---|---|---|
| Generate limousine invoice | Finished, remaining gross > 0 | Opens invoice candidate editor; Generate creates one or more invoice parts | Candidates and Generate reject non-Finished trips; remaining balance is revalidated by existing billing writer | Existing candidate/error handling; invoice list refreshes on return; direct trip list action does not mutate |

## Unresolved requirements

None for this scope. Runtime, browser, database and owner visual acceptance remain pending under the project execution boundary.
