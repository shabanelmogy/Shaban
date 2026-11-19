| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Dashboard card widths — 2026-10-23

Tier S: owner requests Lease agreements, Workshop and NRM on Dashboard to
have the same widths as the three cards above. No screenshots supplied.
Current API freeze leaves cards as frontend-owned presentation metadata.
UI shape: existing Dashboard operational-card grid, a canonical exception to
ordinary CRUD; backend shape does not apply.

## Decision and conformance before editing

| Concern | Book | Actual reference / shared owner | Target |
|---|---|---|---|
| Width | Master1/5; UI1/24/25 | DashboardCard.span → Dashboard template data-span → dashboard.component.scss grid | Existing third span: 4 of12 columns on screens1200px and wider; same rule as Bookings/Rental agreements and wide-screen Vehicles |
| Card internals | UI24 | DashboardCardsComponent; existing SummaryCards KPI owner stays separate | Keep operational card content and KPI strip unchanged |
| API | Existing DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md | Frontend presentation metadata only | Keep all reads, counts, links, order and business rules |
| Guide | Master7 | UserGuide/content/dashboard-guide.ts; existing Dashboard topic | Add a bilingual wide-screen layout note after source reconciliation |

Lease agreements already inherits third from Rental agreements. Change only
Workshop and NRM from quarter to third. Reuse existing responsive rules:
768–1199.98px uses half width for third cards; below768px uses full width.
Vehicles keeps its existing full-width chart treatment below1200px.
No new shared presentation rule or CSS fork is needed.

No separate freeze file, full-feature plan or parallel agents: two metadata
values in one bounded layout rule, followed by its guide and scoped diff review.
Build, tests, lint and browser/runtime verification are not authorized.

## Final reconciliation

Implemented only the two span changes in
`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/pages/dashboard/dashboard.data.ts`.
Lease inherits third unchanged. The existing template forwards span through
data-span, and snapshot mapping preserves that metadata. All six leading cards
therefore use the same4-column width on the12-column desktop grid. Their total
spans form two complete rows, with the same14px gaps. Existing tablet/mobile,
RTL, theme, content and count contracts stay intact; no CSS was added.

Updated
`F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/dashboard-guide.ts`
with a bilingual layout note in the existing Dashboard topic. The existing
reader registers DASHBOARD_GUIDE; the module guide uses `/UserGuide/dashboard`
and links to `/dashboard`. Existing guide entry is reused; no menu change.

The initial recipe check passed all eight packets; no canonical rule was
changed and regeneration was not needed. Applied bounded discovery,
presentation and reconciliation; backend/grid-data/editor/action phases do not
apply. No new API, DTO, mapping, calculation, permission or schema decision,
and no migration. No material open decisions or screenshot claims.

Reviewed the complete scoped diff in the frontend repository, including guide
wording, and checked whitespace and merge markers. No build, test, lint,
browser, database, migration, commit, push or deployment was run. No agents
were used because this is one small sequential change. Owner verification:
open Dashboard at1200px or wider and confirm the second row aligns with the
first, then check narrower widths and both directions/themes. Source conformance
is complete; visual/runtime acceptance remains pending.

Suggested frontend commit:

```text
style(dashboard): align lease workshop and NRM card widths
```
