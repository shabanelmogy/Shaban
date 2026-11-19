# Company service — confirmed findings implementation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Authorization | Owner: "عدل جميع الملاحظات" following the read-only assessment |
| Scope | Six findings in `COMPANY_SERVICE_READ_ONLY_ASSESSMENT.md`; directly related Company writers and shared input validation |

## Frozen decisions

| Finding | Contract and owner |
|---|---|
| F1 — early child persistence | Resolve reusable default Customer group before any Company mutation and outside the Company transaction. |
| F2 — concurrent duplicate name/VAT | Keep the tenant/live-row duplicate rules. Protect check and persistence with Serializable isolation, including each Company import chunk; retain import partial-chunk semantics. Central middleware returns localized 409 on serialization conflicts; no automatic retry. |
| F3 — group type | Company create, update, group action and import accept Customer groups only. Null continues to mean default Customer group. |
| F4 — new driver number | One repository `SetNewDocumentNumbersAsync(entity.Drivers)` call uses the existing single-row generator for identity-0 Drivers with empty numbers. Existing numbers are preserved; no feature numbering loop/dictionary or generator injection. |
| F5 — nonpositive reference | Shared EF-model FK validation rejects supplied IDs <= 0. Null/absent optional FK remains valid; a new owned row's identity 0 remains valid. |
| F6 — billing minimum | Shared Add/Update billing DTOs require nonnegative credit period, limit, surcharges and customer discount, matching current Angular constraints; nullable fields remain optional. |

## Impact and alternatives

- Backend Pattern 2 with grandchildren: keep Company tracked snapshot reconciliation and existing generic validation.
- API shapes, permissions, reports, frontend fields, entities and schema stay compatible. Range validation tightens invalid-input acceptance for all shared billing consumers.
- TPT stores Company keys and tenant/delete scope in different tables; a same-table filtered tenant unique index cannot express the current key. Serializable is the existing project mechanism for check/save races. It covers reviewed application writers, not arbitrary SQL or future bypass writers; SQL contention and deadlock responses need owner runtime verification.
- Company import receives a persistence callback, so only its chunks adopt serialization and revalidation. Other imports retain their current path.
- No migration, build, test, runtime or database commands authorized for this task. Review is source-only.

## Reconciliation

## Implemented finding reconciliation

| Finding | Source result |
|---|---|
| F1 | `CompanyService.UpdateAsync` resolves the default group before loading/mutating the snapshot and before the transaction. No default-group helper runs after child removals. |
| F2 | `CompanyWriteScope` encloses Company Add/Update checks and persistence at Serializable isolation. Company import rechecks name/VAT inside a separate scope for each chunk; success counts follow commit, failures clear rolled-back tracked rows. Middleware handles API deadlock/concurrency failures as localized 409; import retains its failed-chunk result contract. |
| F3 | `PartnerRules.IsCustomerGroupAsync` is used in Add, Update, group action and Company import. Import's group lookup is Customer-only. |
| F4 | Removed the initial local dictionary/loop after owner feedback. Repository `SetNewDocumentNumbersAsync` reuses `ICodeCreateService.GenerateDocumentNumberAsync<T>()`; Company makes one call for its new Drivers. It never traverses a saved Company graph. |
| F5 | `Service.MissingReferenceAsync` rejects supplied foreign key IDs <=0, including nested optional IDs; null remains optional and new owned-row identity 0 is unaffected. |
| F6 | All nine billing numeric inputs carry matching nonnegative ranges in both shared Add/Update VMs; nullable fields remain optional and decimal limits are culture invariant. |

### Shared owners and compatibility

- Reused: base `InvalidInputAsync`, tracked `ReconcileOwned`/`ReconcileReference`, existing code generator, repository tenant/live filters, and central exception middleware.
- Added: Company write scope (API + import), shared Customer group predicate, and repository new-row numbering entry point.
- Company import alone opts into the generic chunk persistence callback. Other import persistence behavior is unchanged. Its validation reads now use tenant/live `Query` instead of report access, and compare `CompanyName`, not the display `Name` alias.
- Existing AutoMapper maps update each retained row's fields. The Company/Driver profiles intentionally ignore owned navigations; reconciliation preserves tracked identities, checks ownership, and removes omitted grandchildren. Ordinary AutoMapper mapping clears an existing collection; this alone does not perform the current soft-delete and business-reference rules. No package or new mapping engine was introduced.
- No entity, EF configuration, API route or frontend source was changed by this task. No migration is required. Existing working-tree edits were preserved; the large HEAD diffs in Company/base service include earlier work.

### Source-only verification

- Scoped control flow and source diffs inspected, including failure/commit paths, the import callback, generator entry points, interface implementation and DataAnnotations.
- `git diff --check`: passed.
- Both resource XML files parse; no duplicate keys; both new keys exist in English and Arabic.
- `Check-BookReferences.ps1`: passed after book + skill changes.
- Initial `Generate-SigmaRecipes.ps1 -Check`: all eight packets current. After canonical blocks changed, all eight packets report stale fingerprints. Follow canonical books; packets require regeneration and semantic review under project governance. Generated files were not edited.
- No build, tests, lint, browser, runtime, database command, migration, model-snapshot edit, commit or push was run. No subagents were used for this tightly linked fix.

### Owner verification pending

1. Force a failed final Company edit with omitted Drivers/Contacts and null ContactGroupId; verify no child removals persist.
2. Concurrent Company Add/Update and Company-import chunks with identical name or VAT; verify at most one conflicting write commits and errors are understandable. Also check SQL lock contention.
3. Reject non-Customer groups through create, edit, group action and import.
4. Add multiple Drivers through Company PUT; verify each new Driver has a number and all saved numbers remain unchanged.
5. Reject zero/negative Branch, ContactGroup and nested optional FK IDs; accept optional null and new owned-row identity 0.
6. Reject negative billing values and accept zero/null where allowed; compile affected backend projects.

Residual limits: this change does not add optimistic editor versioning, repair old duplicate rows or missing numbers, replace the legacy generator, or protect arbitrary SQL/future writers that bypass the serialized scope. Billing attributes apply at the API model-validation boundary; non-API/import-specific DTOs retain their own validation contracts.
