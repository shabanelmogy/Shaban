# Vehicle Charged vs Driven

## Discovery and decisions

The Sigma menu item previously opened the general vehicle page. The supplied image shows the date range, branch and booking vehicle type filters, Search, Print and Excel, and one result group per booking vehicle type. Each group displays its rental count and booked days, with agreement type, rental count, rental days and percentage in the breakdown. The Speed guide and dated screen 49, route R0517 and controller C1082 confirm today's initial search, optional date range, branch/type lookup, all-group Excel and percentage as agreement rentals divided by group rentals. Speed's server-side duration and cohort rules are unavailable. The unrelated Odoo data model cannot verify them.

The owner requested the searchable side-list used by Branch Wise Rented. The owner delegated selection of the data model and authorized experimental data updates. Sigma's booking and rental agreement had no persisted origin link. Deposit or customer/date correlations do not establish that one agreement originated from a given booking. Use a nullable, unique source booking reference. For creation and editable existing agreements, the operator can enter the exact booking number for the same customer. The server requires Booking View for the new reference, respects document branch scope, accepts confirmed/closed bookings with a type and positive duration, validates the reference, and prevents reuse. Walk-in agreements may omit the reference. Once established, the link remains on normal edits.

The report compares linked, non-void rental agreements with confirmed/closed bookings using scoped reads on both records and both type lookups. Branch and dates refer to the booking pickup, and both selected dates are included. Booking days use the saved duration. Agreement days use the recorded agreement period, measured in calendar days with a one-day minimum, consistent with the rental agreement charge-period convention. The agreement type is the type saved on the agreement. These are Sigma rules for the operational report. Missing links cannot be filled from approximate matches.

| Concern | Owner and reference | Implementation |
|---|---|---|
| Report and filters | UI07 / UI20, Daily Revenue and Agreements report forms | Shared report page, action strip, date range, branch and type selectors. |
| Group navigation | UI20 topic 20/04, Detailed Vehicle Utilization Branch Wise Rented | Searchable PrimeNG Listbox with local selection, one visible shared grid, no repeated visible group heading. |
| Counts, days and access | BE17 / BE9, scoped fleet reports | Database aggregates with full results, separate Read/Print/Export grants and scope during every operation. |
| Print and Excel | UI21 / UI8, Detailed Vehicle Utilization | Use the applied report filters and all matching groups. Print keeps each group heading; Excel carries counts, days and percentage as numbers. |

The in-app Reports guide is bilingual. The report and association do not create journal or charge effects. Existing unlinked agreements require a verified source reference to contribute to the report.

## Verification

- Angular development build and changed-file ESLint passed. The two targeted Karma tests verify the actual list search, local selection, full-group print preparation and a numeric workbook round-trip. PrimeNG accepted the Listbox bindings.
- The API Release build and all ten targeted branch-access cases passed. A direct read using the compiled report service against the verified experimental SQL Server database returned 17 visible branches, 7 type options and zero linked groups.
- Applied only migration `20261120182503_AddRentalAgreementSourceBooking` to the verified experimental database after reviewing the EF-generated script. Verified the migration history, trusted foreign key and filtered unique index. The stored totals remained 23 rental subtype rows and 7 booking rows. There was one eligible booking and no same-customer agreement or exact booking number reference in the experimental data. No historical relationship was inserted.
- Live browser review, print preview and verification with a populated real booking-to-agreement sample remain pending.
