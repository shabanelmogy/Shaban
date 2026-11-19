# Limousine Trip Billing Final Reconciliation

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

## Scope and phases

- Applied Phase 01 domain/API, Phase 02 read-grid, Phase 04 domain-actions, and Phase 05 integration/runtime concerns, then reconciled with Phase 06.
- Phase 03 detail-write was applied only to the existing invoice candidate editor because the change adds the trip-number filter; no new editor shape was introduced.
- No screenshot or external visual evidence was supplied.
- Recipe drift check passed for `plan-00-maintenance-evolution`, `phase-00-discovery-evidence`, `phase-01-domain-api`, `phase-02-read-grid`, `phase-03-detail-write`, `phase-04-domain-actions`, `phase-05-integration-runtime`, and `phase-06-final-reconciliation`.

## Final source contract

| Contract/path | Final source evidence | Status |
|---|---|---|
| Trip grid column order | `TripBooking/components/list/list.component.ts`: `no`, `status`, then existing business columns; shared actions remain automatic | Confirmed |
| Status filter | TripBooking status dropdown serializes as `Filters[status]`, route state restores it, and `ApplyTripBookingFilters` validates enum values before filtering | Confirmed |
| Invoice action | Same component shows `tripBooking.invoice` only for a finished row with a number and `amount > billedAmount`; it opens `/Invoice` with Limousine Single type, trip number and pickup date context | Confirmed |
| Eligibility read | `LimousineInvoiceService.CandidatesAsync`, plus legacy TripBooking candidate endpoints, filter `TripBookingStatus.Finished` and remaining gross balance | Confirmed |
| Eligibility write | `LimousineInvoiceService.GenerateAsync` rejects any selected trip whose status is not Finished; existing billing service still owns balance, precision and tax allocation | Confirmed |
| Navigation | Vouchers keeps the existing `/Invoice` screen as the only invoice entry; invoice type is selected from its dropdown and no standalone limousine invoice menu item was added | Confirmed |
| Schema | No entity, EF configuration, DTO storage or migration change | Confirmed |

## Frontend/backend reconciliation

- Frontend `TripBookingDTO.status`, `amount`, `billedAmount` are sufficient for visibility; backend `TripBookingListVM` already supplies these values.
- The invoice editor sends only `invoiceDate` and selected `tripBookingId`/`totalAmount`; no server-owned totals or tax were added to the payload.
- Candidate filter casing remains `Filters[tripNo]`, matching the existing `SpecificationRequestDto` and `FilterHelper` lookup.
- Successful finish refreshes the TripBooking list through the existing mutation path, so the invoice action becomes available from the refreshed Finished row. Invoice generation keeps the existing list refresh on return.
- Backend and UI failure paths reuse existing result/error handling; the new backend message has English and Arabic resources.

## Guide handoff

- Content: `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/limousine-guide.ts`.
- Reader: existing `GuideReaderComponent` already registers `LIMOUSINE_GUIDE`.
- Menu/route: existing `/UserGuide/limousine` entry; Vouchers keeps the existing `/Invoice` entry and the guide documents the Limousine Single dropdown workflow.
- Topics updated: Trip bookings and Limousine invoices, including the Status filter, Finished eligibility, remaining-balance limits, and the separate receipt/settlement boundary.

## Verification and owner checks

Source-only checks completed: scoped `git diff --check`, column-order scan, action/filter/status/translation scans, and separate frontend/backend complete scoped-diff review. Builds, tests, runtime/browser verification, database commands, migrations and deployment were not run under project instructions.

Owner should verify: finish a trip, confirm the refreshed row shows Generate invoice, confirm the invoice editor is prefiltered to that trip, generate a partial invoice, confirm the remaining amount and action visibility update, and confirm an unfinished trip cannot be invoiced through a direct request.

No migration is required. Suggested commits: `SiGmaAngularFrontEnd: feat(limousine): complete finished-trip invoice handoff`; `SigmaBackend: fix(limousine): restrict invoice generation to finished trips`.

Subagents were not used because this was a tightly coupled two-column/workflow change with shared frontend/backend contracts and overlapping review ownership. Prohibited commands were not run.
