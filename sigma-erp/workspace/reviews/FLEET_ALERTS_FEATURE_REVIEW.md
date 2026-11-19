# Fleet Alerts — feature review notes

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Origin | Moved verbatim from UI block 6 *One screen, multiple report variants* during the shared-first rewrite (`reviews/Archive/SIGMA_SHARED_FIRST_MAINTENANCE_EVOLUTION_PLAN.md`). Feature-specific decisions do not belong in a canonical block |
| Screen | `Fleet/Alerts` |

## Variant decisions (recorded before 2026-10-01)

For Fleet Alerts specifically, Insurance owns checkbox selection, whole-row
activation, and batch renewal. Services owns checkbox selection for customer
email reminders and one direct per-row Update Vehicle Service button rendered
through the shared table's typed custom-cell contract. Whole-row activation
remains a single-record shortcut to the same dialog; checkbox interaction must
not open it. Do not add a selected-row toolbar edit action, because service
completion updates exactly one row. Keep the circular action within the shared
compact row height; an oversized control must not make Services the only variant
that expands the route page. The direct button must own its click, prevent row
event propagation, and pass the row's normalized positive `serviceId` to the
dialog. Whole-row activation may call the same helper. A missing or invalid
service ID is a visible response-contract error, never a silent return.
Registration, Mileage, and Warranty are
read-only variants. Fleet Alerts opts into a bounded shared table
`scrollHeight` so row overflow scrolls inside the Grid and the paginator stays
visible:
do not reproduce a screenshot checkbox unless a matching mutation or batch
contract is confirmed. Every variant still owns type-specific columns and
screen/export/print parity. The Services dialog records date/time, fuel level,
current KMs, and the due service; opening the dialog must not auto-open its
calendar, while an intentional click on the calendar field or icon must open it.

The general rule — each variant owns its endpoint, columns, sort, export and print, and selection only where a workflow is confirmed — stays in UI block 6.

## Open for its review

- Adopt the shared list shell and `app-data-table [fill]` (UI block 6 exception list).
- Record *Authorization candidates* (UI block 26): batch insurance renewal, service completion.
