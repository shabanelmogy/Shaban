| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |

# Shared summary cards — frozen presentation handoff

Owner authority: one reusable application shape, documented fixed rules, adoption in FollowUpReport, DebtCollection, Customers/Alerts, BalancesSummary and ReceivableAgeAnalysis; card height/width suit each screen and content. Latest owner choice prefers Dashboard over both earlier report card designs. This supersedes the FollowUpReport freeze's global insights-only implementation and DebtCollection read-only reference boundary for this bounded UI extraction.

## Discovery and decision

DashboardCardsComponent is a page-local composite for charts, metric lists and tables, not a generic application summary owner. The Dashboard KPI strip is inline markup with page-local SCSS. Extract that actual KPI strip into `shared/components/summary-cards/SummaryCardsComponent` and adopt it in Dashboard as well as the five requested customer screens. Do not make reports import a page or generate a second copy of its design. The larger Dashboard chart/table composite retains its existing content and layout.

## Frozen shared contract

- `app-summary-cards` takes a readonly typed `SummaryCard[]`: stable id, translation label key, authoritative display value, Bootstrap Icon, approved accent; optional number/money formatting, translated suffix, hint/params and secondary value. It fetches nothing, derives no totals, changes no business state and has no feature-specific colors.
- Single visual owner: Dashboard KPI's 10px radius, 1px shared border, shared surface with 9% accent wash, 3px logical-start accent, 44px icon with 14% wash, 14px/16px padding, 12px gap and 1.6rem value. Palette uses existing sigma/Bootstrap theme tokens. Preserve logical layout, both themes, readable wrapped labels, tabular values and text access to truncated amounts.
- Width is container-responsive through auto-fit columns and the public `minCardWidth` input (190px default). Height follows content and equal row stretching, no feature-owned fixed height. Public `density` selects comfortable or compact shared dimensions (compact: 10px/12px padding, 32px icon, 1.35rem value, 8px gap). Features may place or bound the component host but never override card internals, colors, padding, radius or fonts.
- Optional selectable mode uses native buttons, disabled/busy guard, aria-pressed and visible focus, emits only the selected stable id. Customers/Alerts maps that id to its existing status filter and keeps page reset and counts scope intact. Static cards have no click affordance or tab stop.
- Counts use number formatting; monetary values use shared MoneyPipe, retaining authoritative rounding/two Latin decimal digits; BalancesSummary keeps absolute magnitude and translated Dr/Cr suffix. Existing labels, ordering, values and twelve effective aging-period labels remain unchanged. No accounting/status formulas or transport changes.
- Print uses compact white cards, neutral borders/text, no decorative icons/wash/stripe, wrapping amounts and hints, and break-inside avoidance. FollowUpReport and ReceivableAgeAnalysis keep current full print flow; DebtCollection retains its no-print cards. Existing active tabs, arrays, pagination, export, busy/error/invalidation and routes remain unchanged.
- FollowUpReport and DebtCollection use full panel-width shared cards; FollowUpReport keeps Details/Summary full width and title/filter alignment. ReceivableAgeAnalysis uses compact cards with smaller public minimum width for twelve existing totals. BalancesSummary bounds its single main balance card and uses responsive three-card summaries inside its existing statement dialog. Alerts keeps four selectable status cards in its existing list inset.

## Application rule and evidence

Latest owner instruction: “اى شاشة اى كان نوعها تستخدم نفس المكون المشترك”. UI 24 owns the application-wide summary/KPI/total-card rule for every screen type (list, report, dashboard, editor and dialog); UI 20 owns its report usage, and the preamble and skill list the component and allowed layout inputs. New or reviewed summary-card work uses this component, passing content and public layout inputs only. Existing consumers migrate when explicitly in scope. Accounting values retain their money/Dr/Cr presentation and financial calculation ownership; the component does not reclassify them as operational counts. General form sections, editor shells and tables retain their separate shared owners.

| Concern | Book / source evidence | Shared owner / target conformance |
|---|---|---|
| Existing shape | UI 24/25; Dashboard `dashboard.component.scss` KPI strip | Extract actual values above; six consumers import the shared component |
| Report scope | UI 20/21; existing FollowUp/Debt/Balances/Aging freeze/reviews and source | Preserve data, monetary formatting, print and request contracts |
| Interactive summary | UI 26/27; Alerts summaryBadges/statusCounts/setStatusFilter | Shared native button emits id; existing feature mapping retains semantics |
| Bounded layout | UI 1/3/20; report/list shells and Dashboard scroll region | Placement only in features; no page scrolling or local card palette |
| Documentation | Master 5; owning UI blocks and skill learning protocol | Promote only after source reconciliation; regenerate packets through generator |

Source-only scope. Build, tests, lint, browser/app, database, migration, commit, push and deployment commands remain prohibited; owner visual/runtime acceptance is pending.

## Source-conformance sizing refinement

The owner's flexible-height instruction also covers a bounded grid screen with many or wrapped cards. Auto-fit alone can stack twelve Aging cards or four captioned FollowUp cards beyond the available panel height at a narrow width. Add an optional numeric `maxHeight` public input (pixels, absent by default). The shared list owns its own bounded vertical scroll, keyboard focus and visible focus when this input is supplied; feature code does not override internals. FollowUp, DebtCollection and Aging use 180px; Alerts uses 160px. Dashboard and the Balance statement dialog retain natural height in their existing scroll regions. Print removes this bound/overflow and keeps all cards. This is a presentation sizing decision, not a new page scroller or any changed output scope.

## Owner single-row Aging refinement

Owner: “محتاجين مسافة تحت الكروت ولو امكن يكونوا صف واحد”. Add public `layout='grid'|'row'` (grid default). Row presentation retains readable card width and scrolls horizontally within the shared card region instead of shrinking twelve monetary values across the page. ReceivableAgeAnalysis selects row, minimum200px, maxHeight180px, and adds12px bottom separation on the component host only. The row is keyboard-focusable. Print changes row presentation back to a wrapping grid and releases all scroll bounds, preserving twelve cards/values/labels. Other consumers retain their shared default grid.

## Owner correction: all cards visible and smaller figures

Owner reported “اخر كارت خارج بره الشاشة” and requested “وصغر الارقام شوية”. This supersedes the horizontal-scrolling single-row decision above. Shared row layout now fits the actual number of cards into equal `minmax(0,1fr)` columns within the host at wide container sizes; below1100px it wraps automatically using the public minimum width. No horizontal card rail or off-screen last card. Add shared `dense` density (8px/10px padding,24px icon,6px content gap,1.05rem value, smaller label), with vertical icon/copy arrangement to preserve readable space inside narrow tiles. Aging opts into dense,row,min140,max180; the12px bottom separation stays. Other consumers retain comfortable/compact. Full value/DrCr title and print wrapping remain. This is a scoped owner choice expressed through the shared public API, not per-screen internal CSS.

Owner subsequently requested bottom separation in DebtCollection too. Its shared component host receives12px margin-block-end, matching Aging; card internals and all data/actions stay unchanged. The reusable placement rule is12px separation from a following grid where the parent gap does not already provide it, never double a pre-existing gap or change the shared card internals.
