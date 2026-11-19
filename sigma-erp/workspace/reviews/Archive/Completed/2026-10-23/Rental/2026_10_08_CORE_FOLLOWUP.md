# Rental core frontend follow-up — 2026-10-08

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Bounded ownership: all `RentalQuotation` and `MasterAgreement` frontend files, plus only the `Agreement/components/list` and `Booking/components/list` roots. Existing APIs, action states, payloads, calculations and backend ownership remain frozen. No screenshots or new business requirements were supplied. Source was clean at entry for these owned paths. The repository already contains concurrent user/peer changes outside this ownership; they are preserved.

Recipe drift: the root drift check on 2026-10-08 reports only generated `PHASE-03-detail-write.md` stale. Phase 2/5/6 packets remain usable; current canonical UI blocks govern detail/write behavior. No generated packet is edited.

## Pre-edit conformance and exact evidence

| Concern | Book block | Approved reference / shared owner | Exact target evidence before edit | Disposition |
|---|---|---|---|---|
| Applied list state and routed return | UI10; UI2 screen type | `Workshop/Job/components/list` `restoreStateFromRoute`, `writeStateToRoute`, `returnQueryParams`; shared `readListRoute` / `writeListRoute` | All four owned list components initialize current defaults and navigate to routed editors without serializing the applied filter/page/sort snapshot. Booking print passes only `print`; Quotation print passes only `print`. Agreement/Booking editors already return `route.snapshot.queryParams`, so the list currently supplies nothing to restore. | Implement URL restoration/serialization from the applied snapshot and pass it to Create/View/Edit/Print. Preserve current filter keys/defaults and API requests. |
| Pending discard decision | UI10/28 | `Movements/collectionMovement/components/details` `canDeactivate`; RxJS `defer` plus identity/busy recheck | `RentalQuotation/details.canDeactivate` and `MasterAgreement/create.canDeactivate` set the pending flag, disable the form and open confirmation before the returned Observable is subscribed. Finalizers unconditionally enable the form. | Defer side effects, reject stale/duplicate subscriptions, and restore only the same editable identity after Cancel. |
| Dialog discard freeze | UI10/28 | controlled EditorDialog close pattern and local identity version | `RentalQuotation/master-agreement-dialog.close` keeps the dirty form editable while discard confirmation is pending and accepts without rechecking quotation/request identity. | Freeze during the decision and validate the same visible quotation before closing/restoring. |
| Saved date-only hydration | UI17 | shared `toPickerDate` | Quotation `populate`, MasterAgreement routed create, and Quotation master-agreement dialog build local picker Dates with repeated parse/transport plus `new Date(... + 'T00:00:00')`. | Replace with validated shared `toPickerDate`; transport remains `parseDateValue`/`toApiDate` as already frozen. |
| Money preview rounding | UI19; frozen follow-up | shared `roundMoney(value, 2)` in `financial-number.util.ts` | Quotation owns `private round` and calls it for existing line/document previews. | Reuse `roundMoney` at the same two-decimal precision without changing formulas or payloads. |
| List async lifecycle | UI22/28 | Job list trigger stream; shared loading counter | All four lists use `Subject` + `switchMap`, `defer`, destruction teardown and `finalize`; declared and transport failures are handled. | Retain. Route writes occur from the applied query request path so actions and empty-last-page recovery stay aligned. |
| Layout/table/filter presentation | UI1/3/4/5/6 | Workshop Job list and shared FilterPanel/DataTable owners | Owned lists already use `sigma-route-host`, shared list shell, `form[appFilterPanel]`, stable layout, shared table fill, default 15 and shared paging. | Retain; no SCSS change supported. |

## Frozen contracts touched by the implementation

- List URL state uses the existing frontend filter property names plus `pageNo`, `pageSize`, `sortField`, and `sortOrder`; it does not change request casing or backend keys.
- Empty date range is represented only in the route by `dateRange=all`, so an explicitly cleared applied range is distinct from the current-month default. Hydrated API dates use local `Date` values through `toPickerDate`.
- `false` remains meaningful for Agreement `isComplimentary` and is serialized as text; the true-only switches retain their existing absence/true semantics.
- Editor exit returns the exact incoming query parameters. Quotation View-to-Edit keeps them and preserves `print` only when it was already present; no list filter is rebuilt from draft controls.
- Existing quotation preview formulas and two-decimal behavior remain unchanged; only the shared rounding owner replaces the private copy.

## Final source reconciliation

Integrated by root on 2026-10-09. All four lists restore before their initial applied-filter snapshot and serialize that snapshot through readListRoute/writeListRoute; dateRange=all preserves explicitly cleared ranges and isComplimentary=false survives. Existing filters, enum values, request casing, server paging/sort and exports remain. View/Edit/Print/editor exits carry query state. Quotation/Master guards defer side effects, freeze forms and recheck identity/busy state; root final audit corrected pending-flag release to precede identity-gated restoration. Calendar hydration uses toPickerDate; preview rounding uses roundMoney at existing two decimals.

Root completed UI28 timer/RAF teardown, UI27 invalid-date focus, and Quotation master-dialog global loader pairs. Root also freezes the rejection reason during discard confirmation. Full scoped diffs, named exports, standalone registrations, conflict/whitespace checks were inspected. Independent core_final_audit (gpt-5.6-sol) reports no remaining concrete defects after root integration. Syntax/template parsing is not compilation. Runtime/navigation/input/visual/RTL/theme acceptance remains owner-pending; see the 2026-10-09 follow-up section of RENTAL_FEATURE_REVIEW.md for current verification and unrelated shared-reader risk.
