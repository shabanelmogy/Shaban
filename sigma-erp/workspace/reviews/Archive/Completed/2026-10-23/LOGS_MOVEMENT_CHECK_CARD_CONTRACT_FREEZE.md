# Logs Movement Check Card handoff

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Authority | User requested Actions → Check Card after Documents fixes; screenshot 111.PNG |

Actions receives a separate translated Check Card item for the five sources already supported by View. It opens the existing shared viewer in print-preview mode, using the same detail source adapters. No new route/API/domain action. A pure report child renders a typed presentation model assembled from the existing normalized details and row.

Screenshot 111.PNG is functional evidence: Print, movement/type/reference/vehicle/contact fields, Check Out and Check In, date/mileage/fuel, exterior/interior diagrams, checklist, driver/branch and customer/staff signature spaces. Layout/controls remain canonical EditorDialog/ReportPrintService and UI21 flow; no CFAO logo is copied. Unavailable phone, saved checklist answers, damage coordinates and signatures stay blank. Checklist catalog fallback supplies labels only. Append the screenshot's additional visible fallback labels (lighter, fire extinguisher, tires, oil level, interior/exterior clean) where absent; no checked-state claim.

Root owns Actions wiring, shared print isolation CSS (opt-in class, preserves existing printing consumers), new report model/component, and viewer preview-mode integration after Documents worker handoff. Shared ReportPrintService.createSession owns preparation/cleanup; fixed footer Print disables during load/preparation. Preview shares one dialog-body scroll owner. Printed output contains report content only, white paper/dark text, released scroll bounds and both checkpoint groups. Vocabulary en/ar updated together.

No schema/mapping/permission changes. Source-only verification: action visibility/dispatch, both modes input wiring, source adapters preserved, report data mapping, all labels, shared print lifecycle and isolation, complete scoped diff. Owner must check actual print pages, images, RTL/theme and build/runtime; prohibited commands remain unrun.

## Integration refinement (2026-10-03)

Source inspection confirmed Delivery/Collection/NRM/Workshop detail methods already suppress interceptor errors. Agreement getDetails gains an optional inline-suppression option (default behavior retained for other consumers), and ChecklistItemService gains a typed same-endpoint catalog reader with suppression. Viewer uses these for its existing inline states. No endpoint, list/query or data shape changes; root owns ChecklistItemService, frontend worker owns the Agreement service option.
