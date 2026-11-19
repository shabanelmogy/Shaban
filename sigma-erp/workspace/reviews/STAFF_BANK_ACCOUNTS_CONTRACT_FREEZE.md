| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Staff bank accounts — 2026-10-03

Owner supplied `C:/Users/user/Desktop/1.png`, asked whether Bank Accounts had been removed, then explicitly requested `ضيفه`. Before-review frontend `1e70a98` has exactly Details/Documents/Salary/Eligibility; backend `de7ca513` Staff Add/Update plus current Staff→MemberPartner→Partner have no bank account fields. This is an authorized addition, not restoration of a deleted contract.

## Evidence and frozen decisions

| Evidence | Classification | Decision |
|---|---|---|
| Bank Accounts between Salary Package and Eligibility | Explicit visible content | Five existing-style step sections; bank step at index3, eligibility moves to4 |
| Name, Routing Code, Branch, Account No, IBAN | Explicit visible fields | Exactly five text fields; Branch is free text, not Staff's employment BranchId |
| Add Row and per-row removal, Save/Cancel | Explicit visible actions | One shared Add Bank Account action, confirmed row removal, existing parent Save/discard |
| Create/Edit/View persistence | Owner instruction + existing aggregate editor | Add child collection to Staff DTOs/domain/mapping/tracked update/detail/delete; no independent endpoint |
| Required markers, IBAN country/checksum, unique account, default account, payroll posting | Not proved | No country/checksum/uniqueness/default/payment rules or ledger effects introduced |
| Field bounds/minimum | Source-backed reviewer selection | Name required as in Bank write-name contract; 100-character fields align BankConfig name/account bounds. Remaining four optional. Zero rows allowed. No requirement to enter a country-specific Routing Code or IBAN |

Existing Bank is a general master (`Name/AccountNo/LocalizedName/TRN`); it does not own employee account rows and lacks Routing Code/Branch/IBAN. Keep it. Create `StaffBankAccount : EntityBase` with server-owned StaffId/Staff navigation and Name/RoutingCode/Branch/AccountNo/IBAN. All strings max100; Name nonblank. Common tenant stamping, concurrency predicate and soft-delete machinery remain authoritative. Add sealed EF configuration and DbSet; restrict physical Staff FK deletion and explicitly include bank rows in Staff's owned soft deletion.

Staff Add `bankAccounts` contains Name and four optional strings, no tenant/owner/audit/identity input. Staff Update contains same fields plus row Id (0 new, retained positive saved). Update null/omitted means keep existing rows for older callers; reviewed frontend always sends a full array, empty clears, omitted saved row soft-deletes. Negative, duplicate, foreign Staff or tenant identities fail OwnsAll. Detail returns only Id plus five fields for live rows ordered by Id. Staff List stays unchanged. Update mapping ignores this navigation, followed by existing ReconcileOwned and one SaveChanges. Add saves the parent graph once; no new transaction helper or independent bank write.

UI: one typed FormArray in StaffFormGroup, shared EditableRows, shared EditableCollectionTable under FormSection (headingVisible=false), one addRequested binding. Reuse validation summary/focus, dirty exit, busy gates and disabled View controls. Name/Branch ordinary text; routing/account/IBAN text with ltr direction to preserve leading zeroes. Payload trims text without coercing numbers or rewriting case. Existing documents/salary/eligibility semantics are retained.

## Reference conformance before implementation

| Concern | Owning block / actual reference | Shared owner / target |
|---|---|---|
| Child table and sole Add | UI14; shared editable-collection-table TS/HTML and IndividualPartner Details document table | Table owns toolbar/rows/default Remove; feature owns typed cells/row handlers |
| Step editor / View / validation | UI12/15/19/27; existing Staff editor + approved IndividualPartner shared-step pattern | StepForm/FormSection/FieldError/FormValidationSummary; add step/specs without a parallel editor |
| Aggregate ownership / snapshots / one save | BE14/8; IndividualPartnerService.UpdateCoreAsync and base OwnsAll/ReconcileOwned/RemoveWithChildrenAsync | Extend existing Staff aggregate core and own-child deletion |
| Mapping / lean DTOs | BE3/4; StaffProfiler and generic Detail projection | One-way child maps, explicit minimal detail, manually reconciled navigation ignored on update |
| Schema boundary | AGENTS.md migration boundary | Owner runs Add-Migration AddStaffBankAccounts and reviews/applies it; agent does not create/run migrations or touch snapshots |

Implementation remains source-only. Build/runtime/database/browser verification and schema application are owner-pending. Root owns this bounded cross-layer addition locally; the shared contract and validation/persistence coupling make a fresh agent handoff unnecessary.

## Implementation reconciliation

Implemented in source: fifth step, typed bank array/factory/validation/focus, one shared Add/default Remove, dirty/busy/View lifecycle, exact five fields, full payload/hydration, new own-file entity/config/three DTOs, Staff collection/DbSet, one-way maps and explicit tracked ownership/reconciliation/deletion. Add omits child identity; Update sends retained Id or0. Live bank reads/ownership loads also require the parent's/current tenant. Malformed null rows, blank names and oversized fields fail the write boundary. Omitted/null bank collection on older Update leaves rows unchanged; an explicit array reconciles the full snapshot.

Final parser/translation and scoped diff/whitespace inspection pass; no build/runtime/database execution. Owner must generate/review/apply AddStaffBankAccounts before using updated Staff detail/update; then verify create/reopen/edit/remove/clear, leading zeroes/IBAN preservation, View locks and foreign child rejection. No migrations or snapshots were written.
