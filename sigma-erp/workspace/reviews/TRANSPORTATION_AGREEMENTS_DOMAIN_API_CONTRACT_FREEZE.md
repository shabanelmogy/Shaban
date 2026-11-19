# Transportation Agreements — frozen correction handoff

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-27 |
| Scope | Tier M; existing TransportationAgreements list/dialog and directly related API |

## Authority and evidence

User requested review and implementation of required fixes. Master1/3/4/5/7,
UI screen01 and UI1–10/13–17/19/22–29, BE2–10/14 apply. Recipe generator
`-Check` passed all eight packets before use. No screenshots supplied.
Canonical UI reference is Workshop/Job list plus shared EditorDialog,
EditableCollectionTable/EditableRows and ReferenceLookupBindings/Status.
Backend pattern2: tracked master/detail without a journal, reference
PurchaseOrderService and base OwnsAll/ReconcileOwned/RemoveWithChildrenAsync.

## Frozen contracts and corrections

1. Keep existing modal editor and guarded compatibility URLs
   `/TransportationAgreements`, `/create`, `/view/:id`, `/edit/:id` and
   `/details/:id` redirect. Existing bookmarks remain supported; these paths
   mount the same list/dialog, not independent routed document editors.
2. GET `TransportationAgreement`: server filters `agreementNo`, `fromDate`,
   `toDate`, `customerId`, `driverId`, `plateNo`, `status` (1 open,2 closed),
   compatibility `isClosed`, reserved `grid`; descending Id, page≥1,
   page size1–100, count before page and identical predicates for export.
   End-date includes the whole selected day. No sorting UI promised.
3. Replace oversized list graph with scalar response and matching frontend:
   `id,no,customerName,customerCode,vehiclePlateNo,driverName,startDate,
   ratePerMonth,ratePerTrip,isClosed`. Grid order after Actions is exactly
   `no,customerName,customerCode,vehiclePlateNo,driverName,startDate(date),
   ratePerMonth(money),ratePerTrip(money),isClosed(status/boolean)`.
   Shared grid filtering must target these actual projected scalars before
   count/page. No list child Items, weekdays, notes or nested entity graphs.
4. GET `GetById/{id}` retains consumed detail wire fields: id/no, startDate,
   customerId/customer{id,name,no}, driverId/driver{id,firstName,middleName,lastName},
   vehicleId/vehicle{id,plateNo}, rates, seven weekdays, notes, isClosed,
   items{id,tripTimes,pickUpLocationId,pickUpLocation{id,name,no},
   dropOffLocationId,dropOffLocation{id,name,no},amount,isExtra}.
   Use bounded no-tracking projection and tenant/live children. Narrow
   agreement-specific response types without altering standalone item screens.
5. POST/PUT retain current client fields and Result envelope: startDate,
   required positive customer/driver/vehicle IDs, nonnegative monthly/trip
   rates, seven weekdays, optional notes≤2000 and full items snapshot.
   Child: tripTimes required within a day, required positive pickup/dropoff
   branch IDs and decimal amount; saved update rows carry id, new rows0/omitted.
   Zero rows remains allowed: source has no minimum. Do not invent a negative
   child-amount restriction or pricing calculation. Tenant/no/audit/IsExtra
   remain server-owned. A saved extra row retains IsExtra during update.
6. Validate every header and distinct branch reference against tenant/live
   scope before writes; validate saved child identity, duplicates and ownership.
   Load tracked update aggregate and map onto retained children; omitted rows
   soft-delete, no detached replacement, no mutation of closed agreements.
   Save once through existing UnitOfWork; no speculative transaction/sequence.
7. DELETE `?id=` uses dependency-aware owned-child soft deletion. Preserve
   existing eligibility except real reference guards; do not invent a closed
   deletion prohibition. POST `CloseAgreement` preserves `{agreementId,
   extraTrips?}` compatibility, validates tenant/live root and optional trip
   references, marks closed once and saves once. Repeated close is a safe
   successful no-op; never append duplicate extra trips on retry. Move nested
   close payload types to their own files and keep JSON unchanged.
8. Ordinary Customer/Vehicle/Branch GetSelect are approved cached reference
   sources. Driver/GetSelect is direct: DriverService has no cache opt-in.
   Keep finite bootstrap then separate successful once-only live watch for
   opted-in sources; retain only selected labels, disable unavailable retained
   editor choices, clear arrays on context reset, preserve values/drafts,
   expose both failure channels/Retry and destroy teardown. No new cache opt-in.
9. List/filter required reads use page loading; body-appended editor detail and
   lookup reads use one local shared indicator. Save/close/delete/export reads
   retain global owner and write safety. Suppress duplicate control/table
   spinners with shared public inputs, preserve disabled/aria-busy/error/Retry.
10. Fix confirmed lifecycle/readability mismatches in touched feature files,
    update bilingual agreement topic in existing transportation guide, keep
    other Transportation screens and user changes out of scope.

## Decisions and exclusions

Authentication exists; there is no permission API. View/create/edit/delete/close
are authorization candidates only. No approval, journal, financial-number,
new scheduling policy, closed-date schema or invoice lifecycle is introduced.
Daily/weekly rate values are existing display previews, never write totals.
TripSheet/TransportationTrips readers remain compatibility consumers; changes
to their generation/billing semantics require their own contract and are excluded.
No entity/EF/schema change is needed for this correction slice. Index evaluation
is a proposal only, not authority to apply schema. No new reusable rule established:
reuse current canonical owners; no book/skill update needed unless new guidance
is actually verified. Builds/tests/lint/browser/database/migrations/commits/push
are prohibited. Root owns final integration and source diff reconciliation.

## Amendment A1 — participating write serialization

Confirmed during implementation, 2026-10-27: TransportationAgreement has no
state concurrency token. A read-then-save closed check alone allows two closing
requests to append extra trips and permits a concurrent edit/delete to race
close. Reuse existing `ExecuteUniqueWriteAsync<TransportationAgreement>` for
update/close/delete so the state read and one save share the existing tenant/type
application lock. This is a justified transaction for a demonstrated race, not
a speculative multi-save boundary. No new lock owner, schema, SQL command
execution by the agent or business state is introduced. The cost is serialization
of participating writes of this type per tenant. Other legacy standalone child
writers do not participate; do not claim protection across those excluded paths.

## Amendment A2 — existing storage bounds

The existing global decimal configuration and current snapshot establish
decimal(18,2) for rates and line amounts. Boundary validation therefore bounds
rates to0..9999999999999999.99 and line amounts to the signed equivalent.
This rejects storage overflow, preserves signed child amounts and changes no
rounding/scale policy or schema. StartDate is required nullable on the request
to reject an omitted date; successful detail remains non-null. The date JSON
shape and frontend payload stay unchanged.
