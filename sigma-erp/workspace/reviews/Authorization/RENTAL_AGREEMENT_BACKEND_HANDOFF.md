# Rental Agreement backend authorization handoff

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Contract | RENTAL_AGREEMENT_ACCESS_CONTRACT_FREEZE.md |
| Scope | RentalAgreement API, linked receipt writes, and private agreement documents |

| Surface | Enforcement and data scope |
|---|---|
| List, grid filters, ordering and detail | The tenant repository owns the live root and the existing Agreement branch scope. Grid filtering, paging, ordering and compatibility navigation reads use the same scalar projection. Related labels and returned keys use same-company live records. Charge projections use live same-company children and stable charge order. Detail and charge DTOs omit unused audit and entity base fields. |
| Update, Delete, Unclose, Void and custom operations | Ordinary users need the actual endpoint grant and RentalAgreement.View. Inherited Create, Lookup and Validate and the two setup reads retain their independent contracts. Upload also needs GetDocuments. Delivery date update also needs GetDeliveryDateContext. The previous master source View and master state checks remain. Activation has no assignable grant and the service returns 405 when reached by a tenant administrator. |
| Branch action readiness | CanEdit, CanDelete, CanVoid, CanUnclose and document CanUpload combine the current state with the agreement vehicle branch transaction scope. A user with branch View can read delivery date context for an eligible agreement. Runtime branch security stays at the repository and write guards. |
| Documents | GET /Media/rental-agreement-document reuses RentalAgreement.GetDocuments and View. It checks the canonical path and a live linked document of an accessible live rental agreement, then streams privately with no-store and nosniff. Generic Media excludes upload and delete of this resource. Failed or replaced files are cleaned up only if no same-company document row claims them, under the RentalAgreement lock used by binding. The static guard also covers old public uploads. Their paths are omitted and eligible agreements accept a new upload. Identity documents retain the CustomerDocument owner and require the accessible agreement customer and the existing document branch scope. |
| Billing history and deposit | The history groups all live contributing receipts in one company-scoped read. The aggregate is returned only when every contributing branch is readable. Rental deposit preserves the expected-deposit limit and checks every branch of receipts counted by its wrapper policy. The source agreement branch and destination receipt branch must both be writable. |
| Receipt Create and Update | Binding a live rental source in transaction scope needs its View grant alongside the receipt operation. A linked DepositReceipt also needs RentalAgreement.AddDeposit and uses the complete readable branch set for its limit. The shared receipt writer validates source and customer under transaction scope and rejects voided rentals. Its settlement lock is held first, then Agreement before source read and through commit. Rental deposit holds settlement, Agreement, then RentalAgreement. Delete and Void retain Agreement then RentalAgreement and do not wait for settlement inside their transition. |
| Delete and Void dependencies | Same-company live linked movements, vouchers, charges, accruals, timesheets and rental invoice rows block the transition even if their branches are hidden. Presence checks under the aggregate write lock return no dependent records. |
| Log | The scoped header read also serves the opening-entry fallback. The log query retains tenant, parent branch and soft-delete constraints. |

Roslyn parsed 17 scoped C# sources. Both resource XML files were checked for the three new exact keys. The five owning project files were parsed and their relevant references and SDK source inclusion were reviewed. The scoped tracked diff passed whitespace checks. The nine untracked sources were read and checked separately.

The endpoint alias and nonassignable activation, canonical private paths, master linkage with the additional Update View prerequisite, and cross-branch billing aggregate are covered in source-written specifications. Test execution, builds, database, storage and browser acceptance remain pending.

The grid uses a count plus one scalar page query. The compatibility navigation list remains unpaged by its existing contract. Billing history uses one root read and one grouped receipt query, so the receipt subtotal and its branch membership come from the same read. Media uses one linked-row existence query plus a file stream. Tenant-prefixed document and rental invoice-item indexes and the Receipt agreement FK are present in the model. Owner query timing and execution plan review are pending for the grouped receipt read and private path lookup. No new index or schema change is proposed before that evidence. The private store uses the existing configured content root.

Suggested backend commit message: Enforce rental agreement operation and branch access.

Independent review clarification, 2026-11-11. The receipt entry wrapper acquires
SalesAgreement, JournalVoucherAllocation and CurrencyWriteLock before the new
Agreement lock. The table's settlement-first wording describes only the order
relative to Agreement. The scoped independent review confirmed no lock cycle
or remaining implementation finding in the examined paths. Runtime concurrency
acceptance remains pending.
