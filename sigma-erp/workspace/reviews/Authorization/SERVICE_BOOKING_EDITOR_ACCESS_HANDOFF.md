# Service Booking editor access handoff

| Status | Owner verification pending |
|---|---|
| Implemented — source-only | yes |

The create/edit dialog consumes `serviceBookingAccess` through an owner-bound
`AdministrativeDefinitionSession`. Editor reads and local discard decisions are
cancelled on lost access/context, while the mounted body is hidden/inert and
Select portals close. Required AgreementOptions and ServiceItem bootstrap is
local-dialog loading only; save remains on the existing page write owner.

Saved edit details must match the requested identity and remain Pending before
the draft is populated. Save is blocked until required detail/lookups complete,
and sends its HTTP context from the shared write tracker; successful completion
is latched before access-fenced publication. No service, DTO, route, or backend
source was modified.

Source-only checks and behavioural specifications remain pending reconciliation:
this handoff does not claim test/build/runtime execution.
