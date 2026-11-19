# Dashboard frontend implementation notes

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-19 |
| Scope | Dashboard consumer, typed snapshot transport/model, Dashboard-only EN/AR keys and existing in-app guide |

## Delivery and conformance

The existing Dashboard exception remains: shared route/list shell, FeatureTitle, FilterPanel, SummaryCards KPI owner and current DashboardCard semantic summary tables, with one vertical dashboard scroll owner. Presentation metadata has no sample counts or branch rows. New screenshot-backed lease, limousine, requests, WIP and estimate sections consume server keys. Missing/null measures stay em dash with translated explanation; nullable branch names use the unavailable caption. Hired rows are explicitly agreement counts by kind.

| Concern | Canonical/reference source | Actual implementation |
|---|---|---|
| Shell/title | UI1/3; existing Dashboard, Job list | sigma-route-host/list page/panel/header and FeatureTitle retained; header Refresh uses shared secondary button |
| Filters | UI4; FilterPanel | typed own/rental defaults; four ownership/fleet choices; automatic reads and explicit Reset refresh; stable inline layout |
| KPI owner | UI24; SummaryCard public value/format/hintKey | readonly SummaryCard[] computed; unavailable values text; workshop from vehicles.WORKSHOP, agreements rental+lease, approval total unavailable if any category lacks source |
| HTTP/lifecycle | UI1/2/22/28; Job.bindListQueries, Result, apiErrorMessage | root HttpClient; exact Snapshot query params; skip-error header; both failure channels; defer/switchMap/finalize; foreground loader and quiet background reads |
| Reusable real time | frozen contract; shared RealtimeService | watch('dashboard') connected/changed notifications audited 400ms; background in-flight triggers reduced to one trailing refresh; filter/manual triggers cancel old HTTP |
| Session isolation | shared observeAuthToken/readAuthToken | auth/storage/microtask token observation cancels HTTP, clears old data and starts new session read; success/error guarded by captured token; no credential logging |
| Guide | Master7; existing UserGuide reader | existing dashboard topic and /UserGuide/dashboard registration retained; actual filters, UTC days, tenant-wide counts, unavailable sources and retry/stale semantics documented bilingually |

Reads reconcile every 60 seconds (including UTC day transitions/missed events). Same-filter failures retain last values with stale status; filter changes immediately clear prior-filter snapshots. Background activity cannot continually cancel HTTP under sustained writes. Component subscriptions/timers use takeUntilDestroyed and destroyed guard; shared transport owns socket lifecycle.

Root amendment: vehicles.IDLE excludes NotReady for the ring while idleVehicles table includes all six statuses. All displayed vehicle-status groups can therefore enter the disjoint distribution ring. Labels can wrap for long statuses/Arabic instead of clipping.

## Exact count keys consumed

- vehicles: HIRED_OUT, NRM, WORKSHOP, NOT_READY, BOOKED, TOTAL_LOSS, FOR_SALE, IDLE, REPLACEMENT, SOLD, DEFLEETED, ALL_ACTIVE_PLUS_DEFLEETED, UNKNOWN_STATUS. Vehicle total uses snapshot.vehiclesTotal.
- bookings: NEW, CONFIRMED, DUE_CHECK_OUT_TODAY, OVERDUE_CHECK_OUT.
- rental-agreements and lease-agreements: OPEN, OPENED_TODAY, DUE_CLOSE_TODAY, OVERDUE_CLOSING, CLOSED_TODAY.
- workshop: MAINTENANCE, REPAIR, ACCIDENT_REPAIR, INSPECTION.
- nrm: NRM_STAFF_MOVEMENT, STAFF_CAR, SOLD_CAR_CUSTOMER_MOVEMENT, NRT, NRM_CUSTOMER_MOVEMENT.
- fleet-type: RENTAL, REPLACEMENT, STAFF, TOTAL.
- limousine: NEW, DISPATCHED, STARTED, FINISHED_TODAY, CANCELLED, NO_SHOW.
- customer-requests: OPEN, OPENED_TODAY, CLOSED_TODAY.
- jobs: DAYS_0_2, DAYS_3_5, DAYS_6_8, DAYS_9_10, DAYS_OVER_10, TOTAL.
- job-estimations: PENDING.
- due-approvals: COMPANIES, LEASE_QUOTATIONS, RENTAL_QUOTATIONS, RENTAL_MASTER_AGREEMENTS, LEASE_MASTER_AGREEMENTS, PURCHASE_REQUESTS, PURCHASE_ORDERS, INVOICE, RECEIPT, CREDIT_NOTES, DEBIT_NOTES, BILLS, PAYMENTS, JV, JOB_ESTIMATIONS, ASSET_DISPOSE.

Each listed suffix is appended to its literal card ID with a dot. No translation keys are synthesized: presentation metadata contains the full translation key; only the count-dictionary lookup derives its suffix. Backend agent confirmed IDs/suffixes, nullable approval categories and five additional disjoint vehicle statuses. No unresolved producer/consumer mismatch found in this workstream; root owns final full-stack comparison.

Tables consume the frozen idleVehicles/openAgreements/hiredVehicles typed shapes. Stable row identities use branch ID (one unassigned branch group) or agreement kind; no index tracking remains. Numbers/totals are backend values, no frontend business formula added; KPI sums only complete authoritative measures.

## Verification and owner handoff

Scoped diffs and directly imported public owner contracts were read. Source search confirms no seeded numeric metadata or sample rows. Check-Translations.ps1 -Block DASHBOARD_UI: en126/ar126, missing0/0, case-only0. No build, tests, lint, browser or database action performed.

| Responsive interval | Source expectation | Acceptance |
|---|---|---|
| >=1200px | existing 12-track cards; third/quarter/half/full spans; two wide radio groups in shared four-column inline filter grid | owner visual pending |
| 768–1199px | lead and table cards full; other cards half; shared narrow filter disclosure | owner visual pending |
| <=767.98px | cards full; one dashboard vertical scroll owner | owner visual pending |
| <=720px | shared single-column filters; radio options wrap; Reset retained | owner visual pending |
| <=575.98px | existing ring stacked above metric list | owner visual pending |

Owner should verify compilation, rapid filter/reset/filter sequences, initial/manual failures, same-tab re-login and cross-tab logout, long-running reads during continuous events, 60-second recovery, disconnect/reconnect, tenant isolation, all breakpoint boundaries/intermediate widths, Arabic, themes and unavailable classifications. No schema/migration impact from frontend.
