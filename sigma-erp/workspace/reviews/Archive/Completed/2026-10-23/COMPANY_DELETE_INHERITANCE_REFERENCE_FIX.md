# Company delete inheritance reference fix

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and cause

Owner reports Company delete fails with "used in Company". Company derives
from Partner; their configurations map separate tables. Shared InUseAsync
enumerates references to the entity and each base type, and counted EF's
primary-key inheritance link as an external usage. The derived row represents
the company being removed and must not block itself. The installed EF Core
10.0.9 metadata documentation confirms IReadOnlyForeignKey.IsBaseLinking().

## Change

Service.cs skips foreignKey.IsBaseLinking() in the shared usage filter.
External business references, business self-references, owned-row exclusions
and aggregate soft deletion keep their existing rules. CompanyService and
frontend contracts require no change; no migration. BE 0.69 block 8, skill
checklist/history and changelog updated together.

## Verification

Source/whitespace and book-reference checks passed. Build, runtime, browser
and database commands were not run. Owner should restart the backend and try
deleting an unused company, then confirm a company/driver referenced by an
agreement remains blocked with the actual referencing entity named. Individual
uses the same helper and should be checked too. Date-entry and dialog-size
follow-ups are recorded separately. Generated packets are stale and require
owner regeneration/semantic review. No subagents used for this one-condition
fix. Suggested backend commit: fix inheritance links in delete usage checks.
