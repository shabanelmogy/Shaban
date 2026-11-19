# Shared percentage column

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner requests simple percentage-column presentation and documentation, under
the standing shared-owner/extraction rule. Existing PR consumptionPercent and
PO receiptPercent show nullable server percentages with two decimal places and
numeric filters. No shared percentage renderer exists. Extend existing DataTable
and its shared format/export contract; reuse installed PrimeNG ProgressBar.
No separate renderer/library, feature CSS, API or derived business percentage.

Keep source numbers in0..100 units (50 means50%, never multiply fractions).
New column type percentage: visible two-decimal percentage plus a decorative
4px neutral/primary bar at the side, no animation/status thresholds. Unknown or
non-finite values show an em dash and no bar. Clamp only bar fill to0..100;
preserve negative/over100 text and numeric filters/export semantics so source
issues are not hidden. Print omits the decorative bar and keeps the same text.
Existing value callbacks/templates retain priority. Numeric filtering/sorting
and both screen exports use authoritative values; formatting adds no API field.

| Area | Decision / owner |
|---|---|
| Shared grid | Extend DataTableComponent/format with percentage type; UI6/8/24/25 |
| Library control | Keep ProgressBar public value/showValue, host theme variables; installed declaration/source inspected |
| Consumers | Replace PR/PO duplicated percent text callbacks with new type |
| Business/HTTP | Keep list DTO fields, calculations, filters, sort whitelists and endpoints |
| Compatibility | No existing column changes unless declared percentage; old callbacks/templates keep priority |
| Guides | Update existing shared screen guidance read by all module guides |
| Extraction | Reuse DataTable and PrimeNG, no second percentage component needed |

Alternatives rejected: feature-owned cell templates duplicate presentation;
plain badge hides proportion; automatic detection of numeric columns changes
unrelated money/tax/variance semantics. No unresolved material decision or data
change; owner asks for implementation, so continue after this frozen source
contract. No migration. Initial recipe check all eight current; PLAN-00 and
UI6 shared read-table shape selected. Source-only verification, no builds/tests/
lint/runtime/browser/database/commits. No delegation: this is one tightly coupled
format/template/filter chain and two tiny descriptor adoptions.
