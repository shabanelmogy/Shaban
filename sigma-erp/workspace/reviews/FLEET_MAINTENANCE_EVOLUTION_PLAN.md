# Fleet business comparison and evolution plan

| Item | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Fleet frontend guide and source-supported Fleet business gaps |
| Evidence date | 2026-10-08 |
| Implementation status | Documentation only; no new business API or accounting behavior introduced |

## Purpose

Fleet currently contains the master data, preventive service definitions, service bookings, append-only service logs, alerts, accidents and reports. Several menu entries expose a screen shell without a producer contract. This plan records the closest established ERP model without presenting a proposal as an implemented feature.

## Current source-supported cycle

1. Vehicle types, source codes and vehicles establish the master record.
2. Service items and Vehicle Service definitions establish reusable preventive thresholds and child checklist rows.
3. Alerts identify due work; Service Bookings carry Pending → Confirmed → Closed.
4. Service Log records the performed date, mileage, items, notes and amount. The source does not enforce a booking-to-log link, so the recommended operating sequence records the log before closing the booking.
5. Daily Service Logs report the stored operational data.
6. Accidents record damage context and charges, but do not decide liability, invoice posting or repair completion.

The source does not establish a real ServiceChecklistItem1 producer, a repair producer/history response, an external fine/toll/Darb importer, a GPS location producer, a maintenance-order aggregate, a technician/capacity workflow, or automatic vendor/customer/GL posting for service amounts.

## Comparison and recommended target

| Area | Current Sigma evidence | Odoo/SAP comparison | Recommended target for a later frozen contract |
|---|---|---|---|
| Preventive plan | Vehicle Service stores mileage/month thresholds and checklist children | Odoo logs scheduled or performed services and odometer; SAP supports counter/performance-based maintenance | Keep a reusable definition with last reading, next due reading/date, and an explicit overdue rule |
| Planned work | Service Booking has Pending/Confirmed/Closed, without an enforced execution link | SAP separates notification/order from completion confirmation; Odoo distinguishes scheduled and performed service records | Add a request/order and require execution evidence before closure only after state, assignment, reschedule and cancellation rules are approved |
| Execution evidence | Service Log is append-only and records performed values | SAP completion confirmation records performer, dates, materials, costs and counter readings; Odoo records vendor, cost and odometer | Preserve immutable execution data and link it to the planned work and vehicle |
| Cost boundary | Amount is stored; posting ownership is unspecified | Odoo can link a service to a vendor bill; SAP captures internal/material/service costs in maintenance processing | Decide whether the amount is operational only, creates a vendor bill, creates a customer charge, or posts to GL |
| Accidents/repairs | Accident is available; repair/history producers are missing | Odoo supports accident/service stages and repair management | Define damage → repair request/order → completion, with responsibility, parts, warranty and cost ownership |
| External charges | Fines, tolls and Darb screens have no approved producer/matching contract | Comparable ERP integrations require source identity and reconciliation before posting | Require provider credentials, source transaction key, vehicle/agreement match, idempotency, review state and posting policy |
| Location | Tracker has honest empty state | Fleet products depend on a location provider and timestamped readings | Freeze provider, identity mapping, timestamp, stale threshold, polling/push, retention and consent |

## Open decisions

The following remain Missing under Master Guide block 4 and must be frozen before source implementation:

- repair and work-order state machine, workshop assignment and completion evidence;
- whether service, accident, fine and toll amounts are operational values or accounting transactions;
- external provider authentication, import window, source key, duplicate handling and reconciliation;
- GPS provider, freshness, retention and consent;
- whether maintenance counters are date-based, mileage-based, both, or condition-based;
- who can approve, close, void or reverse a financial result. The current app has authentication but no separate authorization service.

## Documentation handoff

The in-app Fleet guide is SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/fleet-guide.ts, registered in the existing reader and under the Fleet sidebar. Available topics describe current routes; unsupported producers are marked unavailable. The guide includes the recommended plan-versus-execution comparison and the open decisions above.

## Sources

- Odoo 19, [Services](https://www.odoo.com/documentation/19.0/applications/hr/fleet/service.html): scheduled/performed services, vendor, cost and odometer, plus service stages.
- Odoo 19, [Odometer analysis](https://www.odoo.com/documentation/19.0/applications/hr/fleet/odometers.html): regular odometer readings support maintenance and audit.
- SAP S/4HANA, [Completion Confirmation](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/e72f747389b340229f7fa343975bfa57/18f4b853dcfcb44ce10000000a174cb4.html): execution timing, performer, costs, materials and counter readings.
- SAP S/4HANA Cloud, [Find Maintenance Notification](https://help.sap.com/docs/SAP_S4HANA_CLOUD/2dfa044a255f49e89a3050daf3c61c11/e994a057b4010322e10000000a44147b.html): filtering notifications and assigning them to maintenance orders.
