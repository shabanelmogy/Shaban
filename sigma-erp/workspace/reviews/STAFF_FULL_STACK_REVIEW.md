# SIGMA FULL REVIEW - Staff

Review date: 2026-07-30  
Scope: `src/app/modules/Staff/Staff` plus its direct .NET CRUD, salary, mapping,
validation, repository, and delete-reference paths  
Reference: the supplied Staff grid, Actions menu, Revise modal, and Staff form
screenshots  
Build/tests/migrations: not run, per the owner instruction

## Review result

The Staff slice was reviewed and fixed against:

- `F:\Shaban Documents\Shaban\sigma front\SIGMA_FRONTEND_REVIEW_GUIDE.md`
- `F:\Shaban Documents\Shaban\sigma front\SIGMA_BACKEND_REVIEW_GUIDE.md`
- `F:\Sigma\PROJECT_MAP.md`

The grid/action/revision flow and the direct frontend/backend Staff contracts
are now aligned. Unsupported screenshot fields were not added as fake
frontend-only controls.

## Screenshot acceptance status

| Area | Result |
|---|---|
| Grid columns | Actions, Code, Name, Mobile No, Email, Designation |
| Grid toolbar | Search, In-Active Staff Only, Report, Export to Excel |
| Actions button | Existing blue gear button retained; icon and text are white |
| Action order | View, Edit, Revise, Delete |
| Revise modal | Applicable From Date, Basic, calculated Gross, Transportation Allowance, House Allowance, Normal/Holiday overtime |
| Create form | Details, Documents, Salary Package, Eligibility |
| Salary create | Editable components; Gross is calculated from Basic + Transportation + House |
| Salary edit | Existing salary is read-only in the editor; effective-dated changes use Actions > Revise |
| Notes | Added through Angular DTO/form, Staff Add/Update/Detail VMs, and existing `MemberPartner.Notes` |
| Validation color | Blocking validation is red; amber remains only the transient focused-invalid highlight |
| Step icons | Active/completed step icons remain white |
| Report destination | The Staff grid Report button opens `/StaffBalancesSummary`; individual report screens remain deferred until their screenshots are supplied |

## Endpoint and payload status

| Operation | Endpoint | Status |
|---|---|---|
| Grid | `GET /Staff` | Server paging, exact `TotalCount`, active/inactive filtering, expanded search |
| Detail | `GET /Staff/GetByWithNavigationsId/{id}` | Optional navigation mapping is null-safe |
| Create | `POST /Staff` | Core fields, address, documents, eligibility, notes, and initial salary package |
| Update | `PUT /Staff` | Contract mismatch after the requested reverts: `UpdateBaseVm` again requires `SubscriptionId >= 1`, while the Staff frontend currently omits it |
| Delete | `DELETE /Staff?id={id}` | Expanded operational, HR, payroll, account, quotation, and workshop reference guards |
| Load salary | `GET /Staff/{staffId}/SalaryPackage` | Added |
| Revise salary | `PUT /Staff/{staffId}/SalaryPackage` | Added with tenant ownership, date, and non-negative amount validation |

## Resolved findings

### STAFF-FS-01 - Server-owned update fields

Open after the requested reverts.

- Angular Staff update payloads no longer send root or child `SubscriptionId`
  or `No`.
- Repository `Update` and `UpdateRange` reuse the authenticated-tenant graph
  assignment used by `Add`/`AddRange`.
- `UpdateBaseVm` again exposes and validates client-provided `SubscriptionId`
  as required with a minimum value of 1. The current Staff frontend omits it,
  so update requests will fail model validation until the contracts are
  realigned.
- The shared base update path no longer loads through the tenant-scoped
  repository and no longer restores root/child identity and audit fields,
  because `Service.cs` was reverted on request.
- Staff validates address, document, and eligibility IDs belong to the Staff
  aggregate before update.

Follow-up remains required before calling this finding resolved: align the
frontend update payload with the restored backend contract, and decide whether
tenant-scoped loading and server-owned identity/audit preservation should be
restored in the shared update path.

### STAFF-FS-02 - Revise action and salary workflow

Resolved.

- The row menu order is View, Edit, Revise, Delete.
- The screenshot-style Revise modal is implemented.
- Initial salary is accepted on Staff create.
- Effective-dated revisions are stored as salary-package rows.
- Gross is server-calculated from Basic, Transportation Allowance, and House
  Allowance rather than trusted from the browser.

### STAFF-FS-03 - Null-safe detail mapping

Resolved for Branch, Department, Role, Shift, Reporting To, Nationality, and
Sponsorship. Missing optional lookups now map to empty values.

### STAFF-FS-04 - Delete-reference coverage

Resolved for the inspected direct references:

- reporting manager
- attendance
- overtime
- leave
- documents
- salary packages
- eligibility
- Staff timesheets
- Staff opening balances
- quotation and rental quotation sales person
- partner/agreement/booking/job/invoice sales-person references
- workshop Job Labour and Job Estimation Labour
- debt-collector references

The API remains the authority; the frontend confirmation dialog is not treated
as a delete guard.

### STAFF-FS-05 - Atomic update

Resolved in the existing shared service pattern. Root changes and collection
reconciliation now execute in one database transaction, and child failure
rolls back the root change.

### STAFF-FS-07 through STAFF-FS-12

Resolved:

- In-Active Staff Only is applied by the server; unchecked defaults to active
  Staff and checked shows inactive Staff.
- Staff list returns exact `TotalCount`.
- Search includes first/middle/last name, code, email, and phone fields.
- Date-only controls serialize as `yyyy-MM-dd`, without `toISOString` timezone
  shifting.
- Backend validates name lengths, enums, DOB/joining/confirmation order,
  contact formats, document date order and required values, eligibility years,
  reporting self/cycles, duplicate email/mobile, and salary revision values.
- Angular adds modest phone validation and employment-date validation.
- Grid, detail, dropdown, upload, save, delete, revision, and export failures
  now show user-visible messages.

### STAFF-FS-14 and STAFF-FS-16

Partially/mostly resolved:

- Staff designation labels/options are centralized in one Angular file and
  match the current backend enum order.
- Tabs now expose tab IDs, `aria-controls`, an associated `tabpanel`,
  `aria-labelledby`, and active-tab focus order.
- Arrow/Home/End keyboard behavior is still an optional accessibility
  enhancement; it does not block the current Staff workflow.

## Intentionally pending contract decisions

These are not frontend bugs that can safely be guessed:

1. Bank Accounts: no direct Staff bank-account entity, ViewModel, relationship,
   or endpoint exists in the inspected backend slice.
2. Payment Mode: no accepted Staff backend field or enum contract exists.
3. MOL Personal Number: no accepted Staff backend field, format, uniqueness
   rule, or persistence contract exists.

They are therefore omitted from the Angular payload and form. Add them only
after the backend owner defines their types and business rules. This prevents
displaying controls that silently lose data.

The create/edit/view editor remains a routed bounded workflow instead of being
converted to the old screenshot modal. The salary Revise workflow is a real
modal. Converting the whole editor to an overlay is a presentation decision
and does not change the Staff contract.

## Database change requiring owner action

No migration was generated or applied.

The backend model now requires an EF migration for:

- `SalaryPackage.ApplicableFrom` (`date`, nullable for existing rows)
- nullable `Staff.DateOfConfirmation`, if the current database column is still
  non-nullable

The owner should create and review that migration before running the updated
salary flow.

## Deferred Staff report review

Only the grid Report destination is wired. Visual and behavioral review of
these screens is deferred until their individual screenshots are supplied:

- Staff Statement
- Staff Balances Summary
- Staff Alerts
- Staff Duty Schedule
- Staff Overtime

## Owner-run acceptance checklist

1. Open Staff and confirm the screenshot grid columns and toolbar.
2. Verify unchecked In-Active Staff Only shows active Staff and checked shows
   inactive Staff.
3. Verify a 42-row dataset shows an exact total of 42 at every page size/page.
4. Open Actions and confirm View, Edit, Revise, Delete in that order.
5. Open Revise and confirm all screenshot salary rows, white Save icon, red
   invalid state, calculated Gross, and effective date.
6. Save a revision and reload it through View/Edit and Revise.
7. Create Staff with an initial salary package and reload it.
8. Save/reload DOB, joining, confirmation, document issue/expiry dates and
   confirm no one-day shift.
9. Submit future DOB, invalid date order, malformed phone, negative salary,
   negative eligibility years, invalid enums, and reporting cycles directly
   to the API; confirm rejection.
10. Forge root/child `SubscriptionId`, `No`, and a child ID owned by another
    Staff; confirm ownership and identity remain unchanged.
11. Force a child update failure and confirm the root update rolls back.
12. Attempt delete with each guarded reference and confirm a clear blocking
    message and no partial delete.
13. Check light/dark/system theme, RTL, mobile width, keyboard focus, and
    reduced motion.

## Remaining non-blocking item

`components/list/list.component.spec.ts` still targets an unrelated legacy
component. It should be replaced when the owner next updates/runs Staff tests.
No tests were changed or run in this pass.
