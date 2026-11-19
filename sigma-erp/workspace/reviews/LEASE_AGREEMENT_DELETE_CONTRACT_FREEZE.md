# Lease Agreement Delete Contract Freeze

Status: Frozen for the Agreement delete action.

## Authority and evidence

- The Master Guide and canonical backend/UI pattern books own the workflow.
- `PHASE-04-domain-actions.md` is applicable because delete is destructive and
  state-dependent.
- The recipe drift check reported stale generated phase packets. The canonical
  source documents were used; generated packets remain unedited.
- No screenshot defines delete behavior. The user explicitly requested the
  existing application/guide delete behavior.
- `LeaseAgreementController` inherits the canonical controller delete route.
- `SiGmaDbContext.SaveChanges` converts entity deletion into the existing
  `IsDeleted`/audit soft-delete behavior.
- Existing Agreement action mappings already use `IsClosed` and `Invoiced` to
  determine editability; the delete action follows the same state boundary.

## Frozen decisions

| Decision | Frozen contract | Evidence |
|---|---|---|
| Backend endpoint | Reuse inherited `DELETE /LeaseAgreement?id={id}` and `RemoveAsync(int id)` | Controller inheritance and backend pattern block 6 |
| Delete semantics | Soft-delete through the inherited repository/context path; keep `DeletedAt` and `DeletedBy` audit values | `Service.RemoveAsync`, `SiGmaDbContext.SaveChanges`, backend pattern block 8 |
| UI visibility | Show Delete only when the row is open and not invoiced via `CanDelete` | Existing Agreement `CanEdit` state mapping and UI action pattern |
| Server state rule | Permit only an existing, non-closed, non-invoiced lease agreement | Existing Agreement write/action invariants; backend action guidance |
| Server references | Block if any live foreign transaction/history reference exists: Receipt, PDC Receivable, Accident, Vehicle Service Booking, Traffic Fine, Transportation Invoice, Collection Movement, Custody Movement, Delivery Movement, Debit Note, Credit Note, any concrete invoice carrying the Agreement No, opening-balance deposit, or opening-balance customer entry | Current EF model classes, relationship configurations, and AgreementNo consumers |
| Owned children | Do not treat LeaseAgreement documents, discounts, additional charges, replacements, payment instructions, provisions, clauses, pre-termination rules, or booking charges as independent blockers | Current LeaseAgreement child relationships use cascade behavior; backend pattern block 8 |
| Confirmation | Use the shared confirmation dialog with the existing danger/delete pattern | UI pattern block 9 and LeaseQuotation reference |
| Busy/replay behavior | Guard confirmation and request with `actionSubmitting`; clear it in `finalize` | UI pattern block 7 and LeaseQuotation reference |
| Success refresh | Do not emit a feature success toast; rely on the global mutation toast and refresh the current list page, stepping back when the deleted row was the only row on a later page | UI pattern block 7 |
| Failure recovery | Preserve the list and surface the server message for both `isSuccess: false` and transport errors | UI pattern blocks 7 and 22 |
| Schema | No entity/schema change; no migration required | Only an existing list action-state property and service behavior are changed |

## Action-state matrix

| Action | Visible when | Disabled when | Server permits when | Confirmation | Refresh |
|---|---|---|---|---|---|
| Delete Agreement | `row.canDelete` | List/lookups/export/action mutation busy | Existing open, non-invoiced Agreement has no live external references | Shared danger confirmation | Current page, or previous page if the current page becomes empty |
