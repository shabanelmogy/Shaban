# Job Row Actions Feature Review

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Request | Screenshot `11.png` of the Job row action menu; "start with the clear ones, I will send a screenshot for each of the rest" |
| Screen | Workshop Jobs mixed-source grid (Job + Lubrication Job, `Job/workshop-grid`); routed editors |
| Phases | 4 (domain actions) for Delete; 2/3 consumer clean-up after the owner removed Job approval |

## Evidence `11.png` (Explicit)

View · Edit · Print · Print Gate Pass · Labour Job Time · Close Job · Create Invoice · Cancel Job · Delete · Vehicle Quality Check Report · Log · Add Estimation.

## Action status

| Action | Status | Reason |
|---|---|---|
| View | Kept | Existing routed view |
| Edit | **Fixed** — always shown | It was shown only while `approvalStatus` was NotApproved. The owner removed Job approval (commit `b23ce344`), so the field is gone and Edit had vanished for every row |
| Delete | **Added** | Confirmation (UI 9); Job → `DELETE Job`, Lubrication Job → `DELETE LubricationJob` (existing soft delete). Backend now refuses a Job referenced by purchase, stock, invoice or voucher documents (409) |
| Approve, Reject | **Removed** | Their endpoints were removed with Job approval; not in `11.png` |
| Close Job, Cancel Job | Waiting for screenshot | Needs a Job status (none exists after approval removal) and its lock rules |
| Create Invoice | Waiting | Invoice link is `Invoice.JobNo`; the flow and fields are unknown |
| Print, Print Gate Pass, Vehicle Quality Check Report | Waiting | Layouts unknown |
| Labour Job Time | Waiting | Related to the pending job labour times task |
| Log | Waiting | No Job log exists (only `JobEstimationLog`) |
| Add Estimation | Waiting | Direction and prefill unknown |

## Decisions

| # | Decision | Kind |
|---|---|---|
| D1 | Delete guard: a Job is not deleted while any non-deleted `ProvisionDetail`, `GoodsReceivedNote`, `PurchaseOrder`, `PurchaseOrderDetail`, `PurchaseRequestDetail`, `ItemIssue`, `ItemRequisition`, `ItemReturn`, `BillDetail`, `CreditNoteAccountDetail`, `DebitNote`, `JournalVoucherDetail` has its `JobId`, or an `Invoice` has its `JobNo` | Backend block 8 reference check; reviewer decision (owner standing rule) |
| D2 | Lubrication Job delete keeps its existing unguarded soft delete: no entity references `LubricationJob` | Source search |
| D3 | Approval leftovers removed from the Angular consumers: filter, column, cell template, export column, sort key, route state, enum, models, both services, Job editor read-only rule, Lubrication editor `locked` | Backend removal already committed; consumers must follow (backend block 18 item 5) |
| D4 | Filter grid now has 14 fields; the date range spans two columns so every row stays full at 5 and 3 columns (skill §3.2 divisor rule) | UI 4 |
| D5 | Translations: `job.actions.delete`, `job.deleteTitle`, `job.deleteMessage`, `job.errors.delete` added; approval keys removed (en, ar) | UI 23 |

## Files

- Backend: `SiGma.Business/Services/JobService.cs` (`RemoveAsync` reference guard).
- Frontend:
  - Job: `list.component.{ts,html,scss}`, `editor.component.ts`, `models/{list,details}.ts`, `services/job.service.ts`.
  - LubricationJob: `components/create/create.component.ts`, `models/create.ts`, `services/lubricationjob.service.ts`.
  - Translations: `en.ts`, `ar.ts`.
- Documentation: backend block 18, item 5 (the consumer search includes Angular); backend 0.20; `CHANGELOG.md`; skill §8.2 (8) and its history row.

## Migration

None.

## Suggested commits

```text
SigmaBackend:
fix(job): refuse delete while documents reference the job

SiGmaAngularFrontEnd:
fix(job): restore edit, add delete, remove approval leftovers

- Edit shown for every job; Lubrication Job editor no longer opens locked
- confirmed Delete for jobs and lubrication jobs
- approval filter, column, actions and service calls removed after the backend removal
```

## Owner verification

Not compiled. Jobs list: Edit visible on every row and Edit from View works; Lubrication Job opens editable. Delete asks, removes an unused job, and shows the refusal for a job used by a purchase order or invoice. Filter grid rows are full at desktop and 1250px widths. Arabic/RTL and dark theme.

## Filters review — `12.png` (2026-09-29)

| Screenshot filter | Before | Now | Decision |
|---|---|---|---|
| Job No, Job Estimation No, Type, Date Range, Plate No/Chassis No, Customer, Branch, Ownership, Insurance Company, Sales Person, Labour Type, Item Type | Present | Kept, reordered to the screenshot | — |
| Work Order No | Missing; Job had no work order link | New `Job.WorkOrderId` (optional FK), Work Order dropdown in the Job editor (validated: exists, same customer), grid filter "contains" on the work order number | Reviewer decision (owner standing rule): create the missing relation; a vehicle-based proxy was rejected as ambiguous |
| Status (default Open) | Missing; approval was removed | New `Job.Status` using the existing `Status { Open, Closed }` enum (Work Orders use it), default Open, server-owned; filter defaults to Open; the URL keeps `status=all` when cleared | Reviewer decision; prepares Close Job. Lubrication Jobs have no close workflow and count as Open |
| Created By (dropdown) | Free text | Dropdown of the distinct stored `CreatedBy` values of Jobs and Lubrication Jobs (`Job/options` → `createdByUsers`) | The stored value is the user-name claim; a user list could display a different name |
| — | Record Type | Kept, moved last | Existing behaviour kept (Master 2 rule 4) |
| Buttons Report, Export to Excel Detail | — | Not built | Waiting for their screenshots |

Layout: 16 fields in 4 full columns (2 at ≤1250px, 1 at ≤720px); the date range lost its dead `[showIcon]` (UI backlog 32). Job editor: 11 master fields with Notes in one column, so the 4-column rows stay full.

Also: `WorkOrderService.RemoveAsync` now refuses a work order used by a Job (backend block 8).

**Migration required:** `Add-Migration AddStatusAndWorkOrderToJobs` — adds `Job.Status` (int, default 0 = Open for existing rows), `Job.WorkOrderId` (nullable FK, restrict) and an index on `(SubscriptionId, Status)`.

Suggested commits:

```text
SigmaBackend:
feat(job): add status and work order link with grid filters

- Job.Status (Open default) and optional Job.WorkOrderId, validated against the job customer
- workshop grid filters WorkOrderNo and Status; options return created-by users
- work order delete refused while a job uses it
- requires migration AddStatusAndWorkOrderToJobs

SiGmaAngularFrontEnd:
feat(job): align list filters with the workshop screen

- Work Order No, Status (Open by default) and Created By dropdown; screenshot order in 4 columns
- Work Order field in the job editor; en/ar translations
```

## Edit Job: "Review the required fields and job details." (2026-09-29)

| Finding | Cause | Fix |
|---|---|---|
| Save refused with only the generic banner | A job converted from an estimate has no Sales Person (the estimate carries none) and may have a group with no Job Type (`JobEstimationJob.JobType` is nullable). Both are required by the editor and the backend. The editor showed no field-level message, so the missing field was invisible | Field-level "This field is required." under Date, Completion, Customer, Sales Person, Vehicle and group Type; Save focuses the first invalid field and selects the invalid group (UI 19) |
| Job Details section looked wrong | A group with no type was listed and shown as "Others" (`typeKey` fallback) | Shows "No type"; an invalid group gets a red border and an alert icon in the group list |
| — | Date calendars carried the dead `[showIcon]` | Removed (UI backlog 32) |

The required rules are unchanged: the backend requires `SalesPersonId`, so the user picks a sales person once on the first edit of a converted job. Open question for later: should the estimate → job conversion ask for a sales person?

Files: `editor.component.{ts,html,scss}`, `en.ts`, `ar.ts`. Same frontend commit as the filters.

## Edit Job: Job Details layout and overflowing boxes (2026-09-29)

Cause found in source: the Job editor, the Jobs list and the Lubrication Job editor sized their route host with `calc(100dvh - header - toolbar - footer - slack)`. UI block 1 forbids this: the shell already sizes the route box, and a calc that overshoots it clips the bottom of the page. In the editor, that is the Job Details workspace, its tables and the totals. All three hosts now use the container-fill host (`height: 100%`), closing UI backlog 35 for these screens.

Not changed: the shared `app-editable-collection-table` gives every numeric column `width: 180px`, so the item and labour tables are wider than their declared `minWidth` values and scroll horizontally inside their frame. That is shared behaviour; change it only in a shared-component task.

Not verified in a browser. If the section still looks wrong, a screenshot is needed.

## Action: Labour Job Time — `14.png` (2026-09-29)

Evidence: dialog "Labour Job Time: <job no>", grouped by "Job Type", columns Labour Type ("Designer", a staff profile), Staff, Estimated, Actual, a clock icon; Cancel / Save.

| # | Decision | Kind |
|---|---|---|
| L1 | `JobLabour` gains `StaffProfileId` (FK `StaffProfile`), `EstimatedTimeInMinutes`, `ActualTimeInMinutes` (all nullable) | Owner answers of 2026-09-29 (report task) + standing rule; closes the follow-up task |
| L2 | The "Labour Type" column shows the staff profile: the screenshot's value "Designer" is a profile, not a `LabourType` enum value | Screenshot evidence |
| L3 | Estimated = Labour Tariff `TimeInMinutes` for (profile, job line activity): the job vehicle type set first, then the Default set; recomputed on every job add/update; no tariff row = empty | Owner answer ("from Labour Tariff at save") |
| L4 | Actual is entered only in this dialog (`PUT Job/labour-times`): whole minutes ≥ 0 or empty; every line must belong to the job; a Closed job is refused (409). Editing the job never overwrites it | Reviewer decision |
| L5 | The Job editor labour table gets a Profile column (optional, validated) | Needed for L3 |
| L6 | Action shown for Job rows only; Lubrication Jobs have no labour lines | Source |
| L7 | The clock icon is not built: its behaviour (timer? history?) is not shown | Waiting for evidence |
| L8 | Labour Activities Report now fills Profile, Estimated, Actual and Difference (= estimated − actual, missing actual = 0, matching `10.png`: 1, blank, 1), and the "Actual Time is Greater than Estimated" checkbox filters actual > estimated | Report D2–D5 closed |

API: `GET Job/labour-times/{jobId}` → `JobLabourTimesDto { jobId, jobNo, groups[{ jobDetailId, jobType, serviceName, lines[{ jobLabourId, staffProfileName, staffName, estimatedTimeInMinutes, actualTimeInMinutes }] }] }`; `PUT Job/labour-times` `{ jobId, lines[{ jobLabourId, actualTimeInMinutes }] }`.

**Migration required:** `Add-Migration AddProfileAndTimesToJobLabours` (three nullable columns on `JobLabour`, FK to `StaffProfile`, restrict). Separate from `AddStatusAndWorkOrderToJobs` if that one was already created; otherwise one migration may cover both.

Suggested commits:

```text
SigmaBackend:
feat(job): record labour profile, tariff estimate and actual time

- JobLabour StaffProfileId, EstimatedTimeInMinutes (from the labour tariff on save), ActualTimeInMinutes
- GET/PUT Job/labour-times for the Labour Job Time action; closed jobs refused
- labour activities report fills profile and times, adds actual-above-estimate filter
- requires migration AddProfileAndTimesToJobLabours

SiGmaAngularFrontEnd:
feat(job): add Labour Job Time action and labour profile

- Labour Job Time dialog (app-editor-dialog) from the Jobs row menu
- profile column in the job editor labour table
- actual-above-estimate filter in the labour activities report; en/ar translations
```

## Job Time Logs — `15.png` (2026-09-29)

Evidence: the clock of a Labour Job Time line opens "Job Time Logs: <job no>" with "Add Time — Minutes" and Add, rows of Start Time, End Time and Minutes with a remove button, and "Total Minutes".

| # | Decision | Kind |
|---|---|---|
| T1 | New `JobLabourTimeLog` (JobLabourId, optional StartTime/EndTime, Minutes). A log added from the dialog is plain minutes, so start and end stay empty, as in `15.png` | Screenshot + standing rule |
| T2 | `JobLabour.ActualTimeInMinutes` = sum of its logs, recalculated by the backend in the same save as each add or delete. **Supersedes L4**: the direct `PUT Job/labour-times` and its two VMs were removed; Actual is read-only in Labour Job Time (`14.png` shows it as a value, not an input) | Screenshot evidence |
| T3 | Labour Job Time has no Save (nothing left to edit); Close only. The clock opens Job Time Logs; closing it after a change reloads the actual times | Reviewer decision |
| T4 | Add: whole minutes > 0. Delete: confirmed (UI 9), soft delete. A Closed job shows its logs read-only and the API refuses changes (409) | Reviewer decision |
| T5 | Timer start/stop (logs with start and end times) is not built: no evidence of how a log gets its times | Waiting for evidence |

API: `GET Job/labour-times/logs/{jobLabourId}` → `JobLabourTimeLogsDto`; `POST Job/labour-times/logs` `{ jobLabourId, minutes }`; `DELETE Job/labour-times/logs/{logId}`.

**Migration:** the owner's `20260929045918_add-labourJobTime` already covers Job Status/WorkOrder and the JobLabour columns. The new table still needs `Add-Migration AddJobLabourTimeLogs` (table `JobLabourTimeLog`, FK to `JobLabour` restrict, index `(SubscriptionId, JobLabourId)`).

Suggested commit additions: backend `feat(job): record labour time logs and derive actual time`; frontend `feat(job): add Job Time Logs dialog to Labour Job Time`.

## Action: Close Job — `16.png`, `17.png`, `18.png` (2026-09-29)

Evidence: a job without an invoice closes in two steps ("1 Close Job" summary with Next, then "2 Invoices": Invoice Date, Customer, Details, lines Charges Type / Vehicle / Description / Amount / Tax (%) / Amount + Tax, Add Row, Previous / Save). A job with an invoice shows only "Job Closing" with Save. The summary has one table per job type (Item, Labour, Misc, External Work × Total Charges / Invoice to Insurance Company / Invoice to Customer) and totals without tax, tax, and with tax.

| # | Decision | Kind |
|---|---|---|
| C1 | `POST Job/close` closes the job: `Status = Closed`, new `Job.ClosedAt` (the entered date-time, not before the job date). A closed job refuses Edit, Delete, Close and time-log changes (409); the list hides Edit, Delete and Close for it | Screenshot + reviewer decision |
| C2 | "Has invoice" = an `Invoice` or a `MiscellaneousInvoice` carries the job number (the Job delete guard now checks both) | Source |
| C3 | Without an invoice, the same call raises a **Miscellaneous Invoice** (Module Workshop, JobNo, customer = job customer) through the existing service, then closes the job. The backend computes each line's tax from Tax (%) (round 2). If closing fails after the invoice is saved, a retry takes the close-only path | **Owner decision** (option "Misc Invoice + new workshop types") |
| C4 | New `ChargeTypes` 41–44 `WorkshopItems`, `WorkshopLabour`, `WorkshopMisc`, `WorkshopExternalWork` (appended; existing values unchanged); step 2 offers only these; lines prefilled from the job totals (one per non-empty group), tax % = job rate, vehicle = job vehicle; all editable | Owner decision + reviewer defaults |
| C5 | **`MiscellaneousInvoiceService` journal voucher corrected** to the sales-invoice direction (customer debit, charge credit per line, VAT TaxCollected credit), with all accounts resolved before saving and failures returned instead of thrown. Existing vouchers are not rewritten | **Owner decision** |
| C6 | "Invoice to Insurance Company" is shown as N/A / 0: insurance invoicing is not modelled | Reviewer decision; open question |

**Before first use (owner):** link the four workshop charge types under Link Accounts → Charges Type → Miscellaneous, and make sure TaxCollected is linked. Otherwise the invoice step returns "No linked account found for charge …".

**Migration:** `Add-Migration AddClosedAtToJobs` (nullable `Job.ClosedAt`). If `AddJobLabourTimeLogs` has not been created yet, one migration may cover both.

Suggested commits:

```text
SigmaBackend:
feat(job): close job with workshop invoice
fix(misc-invoice): post the journal voucher in the sales-invoice direction

- GET Job/closing/{id}, POST Job/close; closed jobs locked
- workshop charge types 41-44; invoice raised through the Miscellaneous Invoice service
- misc invoice JV: debit customer, credit charges and VAT; accounts resolved before save
- requires migration AddClosedAtToJobs

SiGmaAngularFrontEnd:
feat(job): add Close Job action with invoice step
```

## Fix 2026-09-29 — Jobs grid UNION failure

`GET Job/workshop-grid` threw `InvalidOperationException: Unable to translate set operations…` at `CountAsync`: `Status` was projected on the `Job` rows only, and the `LubricationJob` rows (joined with `Concat`) did not assign it. The lubrication projection now sets `Status = (Status?)null` (lubrication jobs have no status; the UI shows no Close action for them and treats them as open). Rule added: backend block 18 *Adding a member to a combined projection* (0.23), skill §8.2 (9).
