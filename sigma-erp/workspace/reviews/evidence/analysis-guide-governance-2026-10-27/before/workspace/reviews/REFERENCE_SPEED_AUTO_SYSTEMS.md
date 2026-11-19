# External functional reference — Speed Auto Systems

| | |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Origin | Moved verbatim from Master block 2 (governance book) during the books completion plan (R5); the governance rule stays in Master block 2 *External functional references* |

### External rental simulation reference — Speed Auto Systems

Sigma Rental features simulate the demonstrated business workflows of Speed
Auto Systems. Use the following demo tenant as an external functional reference
when a Rental requirement asks to reproduce, compare, or complete a workflow:

| Item | Demo access |
|---|---|
| Application | `https://app.speedautosystems.com` |
| Booking workflow | `https://app.speedautosystems.com/Application#/tenant/crs/bookings` |
| Credentials | Held by the owner outside the documentation repository (removed from this guide on 2026-09-28). Ask the owner; never write them into a guide, packet, or review artifact |
| Data classification | Demo account; no real production data |

Treat the application as behavioral evidence for visible fields, terminology,
filters, actions, state-dependent workflows, calculations, reports, and
accounting outcomes. Inspect the complete relevant workflow and its alternate
states when the requested feature depends on them. Use read-only inspection by
default; do not create, change, or delete external demo data unless the user
explicitly places that mutation in scope.

Speed Auto Systems is not implementation authority. Sigma must simulate the
confirmed business behavior through the canonical Sigma Angular and .NET
patterns, current source contracts, reusable controls, validation, RTL/theme
rules, and Sigma accounting architecture. Do not copy its page layout, source
architecture, API contracts, permissions, database design, or journal-entry
structure without confirming each requirement against Sigma source and the
applicable canonical guides. If the reference conflicts with Sigma authority,
preserve the confirmed business requirement using the approved Sigma pattern
and record the conflict or inference in the feature evidence table.
