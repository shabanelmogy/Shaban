# Rental write UI lifecycle handoff — 2026-10-06

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

## Source-backed clarification — 2026-10-06

Agreement's existing vehicle selection auto-fills vehicle type and make/model. `VehicleListModel` lacks its required make/model identity, so a generic list or label-only selector would regress that behavior. Reuse the existing typed `BookingService.getOptions()` vehicle/car-model/driver metadata (`BookingVehicleOptionDTO` includes the required IDs), retaining Agreement's own other selectors and existing assignments. This reuses the live Rental lookup producer; it changes neither the write DTO nor server calculations.

Root approved evidence `Rental/WRITE_DISCOVERY.md` RW01–RW05. Existing Agreement/Booking APIs, full-snapshot child identity, server calculations and state rules remain unchanged. UI17 local date/time transport, UI10 routed dirty discard, UI18 upload tracker and UI22/28 cleanup/error lifecycle govern the confirmed fixes.

Every routed exit passes one controlled dirty confirmation; pristine/View exits silently, save/load/upload/cleanup/pending confirmation prevents competing exits. Confirmed discard awaits uploaded-but-unsaved cleanup; existing stored originals remain retained on discard. Navigation proceeds only after required cleanup completes. Successful aggregate save followed by removed-original cleanup is a composite workflow: retain failed paths for retry and never resubmit an already-saved aggregate. Reuse DocumentUploadTracker and the existing guarded-editor/shared lifecycle owners wherever available; no new staging API or ownership contract. A required cleanup failure retains the editor with actionable retry.

Booking deposit and Agreement document upload dialogs gate competing Close/Escape/discard with pending signals and finalize; recheck current state after confirmation. Dialog mode/padding/title/subtitle and date/control presentation follow current shared owners.

Dates are confirmed local date-only/local date-time API inputs; use toApiDate/toApiDateTime, with real-date validators and masked calendar for single date/no time. Backend parsing/fields remain unchanged. Typed lookups use exact owning selector contracts rather than generic paged entity graphs; historical labels remain source-supplied, absent labels empty.

Routed editor presentation and child controls also consume the core Frozen UI handoff. Root owns shared translation/wiring/config changes; write worker owns Agreement/Booking editor/child/models/feature route files. Peer owns list/services. No backend/schema/migration edits. Source-only verification and owner runtime/cleanup/RTL/theme/print acceptance pending.
