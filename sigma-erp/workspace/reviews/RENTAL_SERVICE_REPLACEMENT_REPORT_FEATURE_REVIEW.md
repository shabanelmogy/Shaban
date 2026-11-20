# Rental Vehicles on Service Replacements

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Shape | Screen 07, backend pattern 5, filterless |

## Discovery and frozen contract

The screenshot fixes the column order as Branch, Vehicle, Make and Model, Agreement No, and Out Date Time. It shows one print/export table with no filters. Speed screen 47, R0446 and C1061 confirm an initial read and full-table export. C0547 submits the explicit service and permanent replacement flags. Speed's report query is absent from the client capture. The Sigma menu entry previously opened the general vehicle screen.

Sigma's lease replacement contract and writer preserve the service flag, temporary/permanent flag, outgoing vehicle, departure branch and departure time, and update the lease's current vehicle. The report interprets "on service replacements" as the latest saved temporary service replacement for an open, non-void lease whose current vehicle still matches the outgoing vehicle and belongs to the Rental fleet. An ordinary replacement, permanent assignment, or completed/void lease is outside that population. Select the latest event before filtering its flags. Use the recorded departure branch and date, current vehicle plate/make/model, and agreement number as text. The report reads existing facts and changes no agreement workflow.

| Concern | Owner | Contract |
|---|---|---|
| Read and outputs | BE17, UI20/21 | Auto-load one table; Print and Excel use all rows; shared filterless action strip supplies spacing. |
| Access | BE9, UI26 | Whole-document branch scope through the replacement, lease and vehicle owners. Dedicated Read, Print, Export; outputs also require Read. |
| Dates | UI17 and lease replacement writer | Preserve operational wall-clock departure time. |

## Source reconciliation

| Grid column | Response field | Producer |
|---|---|---|
| Branch | branch | Recorded outgoing branch name, under current branch access |
| Vehicle | vehicle | Outgoing vehicle plate |
| Make and Model | makeAndModel | Make and model labels from the outgoing vehicle |
| Agreement No | agreementNo | Lease number as text, including any leading zero |
| Out Date Time | dateOut | Replacement's recorded outgoing date and time |

The Reports menu under Rentals and Agreements, protected lazy route, Arabic and English vocabulary, and bilingual guide topic point to `/Reports/RentalServiceReplacementReport`. The report uses the shared page, action strip, data table, print session, and read/export state. The first read requires no filter inputs. Local paging limits display rows while both outputs consume the complete server result. There is one direct scoped read per action with no shared lookup request or cache. Print and Export each recheck the applicable grant and context.

Latest replacement selection is part of one projected query. A 50,000-row guard reports an error instead of returning a silently truncated document. The existing replacement index starts with tenant and agreement identity. SQL Server execution plans and timing remain pending. The change requires no schema migration, AutoMapper change, financial calculation or mutation. Runtime acceptance should compare current candidates with an open lease and a later ordinary replacement, then preview print. Speed's older data and a production database were outside execution scope.

Discovery, contract, read grid, access wiring, and reconciliation apply. Write and domain transition phases are inapplicable. The design uses recorded Sigma lease events because Sigma's short-term Rental Agreement has no corresponding persisted service flag. No Odoo source established this Speed-specific inclusion rule. No subagents were used.

Suggested commit messages are `feat(reports): add service replacement report` for the frontend, `feat(reports): read active rental fleet service replacements` for the API, and `docs(reports): reconcile the service replacement report` for documentation.

## Verification

- The Angular development build for project `sigma` passed with the new lazy route.
- The .NET Release build and `dotnet test` filtered to `RentalServiceReplacementReportTests` passed. The fixture exercised the inclusive current service case, superseded same-time event, closed and void leases, permanent replacement, non-rental fleet, changed current vehicle and excluded branch.
- The focused Karma component test passed. It measured the lower toolbar spacing and read back the exported workbook with more than one screen page of rows. It also verified the leading zero and wall-clock display.
- ESLint passed for the 12 changed TypeScript and template files. All 11 bilingual keys, the reference checker, and the eight generated packet checks passed.
