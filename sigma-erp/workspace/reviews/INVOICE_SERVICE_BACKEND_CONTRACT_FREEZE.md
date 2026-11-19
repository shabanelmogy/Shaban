# InvoiceService Backend Contract Freeze

| Status | Frozen |
|---|---|
| Owner verification pending | yes |
| Scope | Backend invoice generation/update/delete and directly related consumers |
| Date | 2026-10-12 |
| Source boundary | `SiGma.Business/Services/VouchersServices/InvoiceService.cs` and direct contracts |
| Compatibility rule | Preserve `IInvoiceService`, `InvoiceController` routes, `GenerateInvoiceRequest`, and `LimousineInvoiceService` callers during this pass |
| Migration boundary | No entity/schema/migration changes |

## Frozen decisions

1. `InvoiceBase` remains the shared TPT root. The task separates application responsibilities, not persisted invoice tables.
2. `InvoiceType` is server-owned during update. A supplied value must match the concrete persisted invoice type; mismatch fails without mutation.
3. `GenerateInvoiceRequest` remains as a compatibility adapter. Its type-specific fields are interpreted only by the matching generation branch.
4. All generated invoice types participate in a shared invoice write lock. Limousine writers continue to participate in the existing `LimousineInvoice` lock so the partial-billing contract remains compatible.
5. Every requested customer/agreement/receipt reference must exist; an `Any` match is insufficient.
6. All invoice foreign keys, pricing, account links and fiscal period checks complete before the first invoice save. The existing transaction still covers invoice, JV, allocations and related flags.
7. Manual rental merge is restricted to rows with the same source identity (`CustomerId`, `AgreementNo`, `ProjectId`, `Rate`, agreement type/rule/period and plate). Cross-agreement aggregation is not retained because one invoice stores one agreement number.
8. Existing Agreement duplicate/`MarkInvoiced` semantics remain unchanged because the source still marks the multiple-invoice policy as a business decision.
9. `LimousineInvoiceService` continues to call the compatibility `IInvoiceService`; nested duplicate locks are removed only where the delegated service already owns the same write boundary.
10. `InvoiceBaseController` and its old service remain in place in this pass. They are not used as the new extension point, because consumer ownership outside the inspected backend is not proven.
11. AutoMapper write maps become one-way. No `ReverseMap` or polymorphic read-to-write map is retained in the touched invoice profile.
12. Accounting remains single-owner: `JournalVoucherResolver` stays the posting engine; no second JV builder is introduced.

## Direct consumers reviewed

| Consumer | Existing dependency | Compatibility action |
|---|---|---|
| `InvoiceController` | `IInvoiceService`, standard CRUD plus custom tax/JV routes | Keep interface and routes |
| `LimousineInvoiceService` | `IInvoiceService.GenerateInvoices/UpdateAsync/RemoveAsync` | Keep calls; remove redundant outer locks where safe |
| `JobService` | `IMiscellaneousInvoiceService` only | No change |
| Generic `InvoiceBaseController` | `IInvoiceBaseService` | Keep unchanged this pass |
| `InvoiceProfiler` | Invoice write/read maps | Replace with explicit one-way maps |

## Applicable guidance

Master Guide blocks 4/5/7; Backend blocks 1/3/4/5/8/14/15/18; generated `PHASE-01-domain-api.md` and `PHASE-06-final-reconciliation.md`. Recipe drift check returned OK for all generated packets before this freeze.

## Deferred decisions

- Whether one Agreement may receive multiple Rental/Lease invoices remains a business decision recorded in `InvoiceService` and is not changed here.
- Whether the legacy `InvoiceBaseController` has external consumers remains unproven; it is preserved pending a consumer inventory.

## Implementation note

### Invoice load failure source correction — 2026-10-13

Frozen source-supported slice: owner reports generic Unable to load invoices; actual HTTP status/response requested and still pending. Main hub maps HTTP bodies without Result.message to this fallback. Its GETInvoice sends Filters[fromDate]/Filters[toDate] through ListSmBase, whose copying setter violates the already-approved BE9 dictionary-binding identity rule. Replace only that shared request setter with an initialized case-insensitive nullable auto-property, preserving PageNo/PageSize/Filters names and types and existing empty/null compatibility. This follows actual SpecificationRequestDto reference and InvoiceService's post-binding private normalization. Do not suppress validation or remove date filters. Shared request consumers inherit the binding correction; no query/write/business change. This fixes a confirmed source defect but does not establish the owner's active failure status. SQL-schema failure is separately possible because list action hints always query RentalInvoiceItem; owner-run RentalInvoiceSourcePeriods handoff remains required, never bypass it or run a database/migration command here. Wait for HTTP response evidence for any dependent diagnosis.

Source-slice reconciliation: Implemented — source-only; Owner verification pending: yes. Active load-failure diagnosis: Uncertain pending HTTP status/response, not claimed resolved. ListSmBase auto-property preserves nullable request shape, default paging remains null and initial filters use OrdinalIgnoreCase. Complete tracked diff reviewed; scoped diff --check clean. Actual SpecificationRequestDto, FilterHelper, base GetManyAsync, Invoice/GetList path and InvoiceService normalized private dictionary compared; current date query fields/busy/failure fallback untouched. Existing BE9 rule/skill consumer evidence and CHANGELOG synchronized; all eight packets regenerated, refreshed backend.9 provenance and reference roles reviewed, all eight -Check OK. Read-only scoped migration inspection now finds owner-created20261013112011_refactor-rentalInvoice.cs creates RentalInvoiceItem (and associated Designer/snapshot source); this supersedes the earlier assumption that migration creation itself is still pending. Database application remains unknown; no migration or snapshot edited/run and no second migration recommended. Existing /UserGuide/invoice load/retry/filter guidance remains accurate, no frontend/guide/API/DTO/AutoMapper/financial change. No subagents for the small sequential correction. No build/test/lint/browser/runtime/database/migration/commit/push/deploy commands. Owner rebuild backend and retry request; HTTP400/empty validation body versus HTTP500/server exception or connection/auth failure determines remaining work. Suggested backend commit: `fix(query): preserve bound list filter dictionary identity`.

### Startup DI validation correction — 2026-10-13

Frozen before edit: owner runtime stack shows InvoiceAccountingMetadata registered as IEquatable<InvoiceAccountingMetadata> by DependencyResolver's broad AddClasses/AsImplementedInterfaces scoped scan. Actual public positional record synthesizes that interface; scanner excludes only Spec/Exception classes. Actual direct consumers read VoucherTypeName/JournalPattern and construct it positionally; no equality/with/deconstruction usage exists in the scoped services/contracts. Replace only this value carrier with a sealed class exposing constructor-set getter-only properties, retaining type/namespace/property names/two-argument construction. Do not inject/register VoucherTypeName or string, disable validation, or change the application-wide scanner. BE5/Phase05 provider trace owns the correction; record the reusable generated-interface scan trap in BE5 and skill after source review. No endpoint/schema/financial/UI change. Runtime confirmation owner-pending.

Final reconciliation: Implemented — source-only; Owner verification pending: yes. InvoiceAccountingMetadata.cs now declares a sealed getter-only class with no implemented interfaces, so AsImplementedInterfaces has no service contracts to register for that carrier. Original positional constructions and both consumed properties remain; no equality/deconstruction/with consumers were found. IInvoiceAccountingService and InvoiceAccountingService still provide the actual service interface/implementation under the unchanged scoped scan. Full untracked metadata source read separately (Git has no tracked diff); scoped diff --check clean. No fabricated enum/string registrations or disabled validation. Owning BE5 lesson, BE0 version0.78, CHANGELOG and skill/history updated together; all eight packets regenerated by the generator, refreshed BE0/BE5 provenance and existing wiring-reference roles reviewed, all eight -Check OK. Proportional discovery/freeze/Phase05provider/Phase06source reconciliation; no new UI/financial/schema/DTO/AutoMapper behavior or migration. Existing /UserGuide/invoice flow remains accurate, no backend-only guide content change. No build/tests/lint/runtime/browser/database/migration/snapshot/commit/push/deploy or subagents for this sequential single-type fix. Owner rebuild and start ServerAPI to confirm startup validation. Suggested backend commit: `fix(invoice): keep accounting metadata out of service scanning`.

### Next compiler-feedback correction — 2026-10-13

Status: Frozen; Owner verification pending: yes. User attachment reports Business CS1503 nullable identity, TaxAdvance WhereLedgerEffective CS1061 and downstream Sum/ServerAPI errors. Pre-edit source: ListBaseVm.Id is int?, projected entity-state keys int; TaxAdvanceService imports omit SiGma.Business.Extensions although the same-assembly internal extension is declared there and InvoiceActionService already imports it. Fix only the missing using and explicit nonnull row-id narrowing at dictionary lookup (no fabricated0). Filter null IDs before the state batch and skip empty batches. Preserve financial predicate and existing decimal Sum chain, which can regain inference after resolving the extension. All six IInvoiceService methods still declared/implemented; do not duplicate or alter them. Conformance: BE5/18 source contract/import and upstream-first diagnosis; actual ListBaseVm, extension namespace, InvoiceActionService state projection and ServerAPI ProjectReference are the compared sources. Source-only; no schema/API/user-flow change.

Reconciliation: Implemented — source-only; Owner verification pending: yes. Added one using to TaxAdvanceService. InvoiceActionService builds distinct int IDs from nonnull inherited identities, skips an empty batch and narrows each row.Id to int before TryGetValue. Null rows do not receive a guessed record's hints. Full action-service source and TaxAdvance import/Sum chain reviewed against the previously reconciled untracked service source; these two files are untracked, so Git cannot provide their diff. Scoped diff --check clean. All seven TaxAdvance WhereLedgerEffective calls now have the same-assembly namespace in scope; IQueryable extension signature and decimal AllocatedAmount confirm Sum source types without changing pricing/allocation arithmetic. No remaining region directives/merge markers in the inspected files. Existing six facade signatures remain. Owner must rebuild Business then ServerAPI to confirm compiler results; no compilation pass claimed. All eight packets current; no new reusable rule/book change. Discovery/freeze/source integration/reconciliation applied; UI/financial/schema/runtime changes not needed. In-app /UserGuide/invoice content remains accurate; no guide edit. No migrations, builds/tests/lint/browser/database/snapshot/commit/push/deploy or subagents for this small sequential repair. Suggested backend commit: `fix(invoice): resolve nullable action identity and allocation extension import`.

### Compiler-feedback correction — 2026-10-13

Frozen scope before edit: user reports CS1038 at TaxAdvanceService EOF and six downstream missing IInvoiceService members. Actual TaxAdvanceService has one unmatched #region privateMethods at524; remove that nonfunctional directive rather than change methods. Actual IInvoiceService declares all six reported methods and InvoiceService implements them; ServerAPI references the Business project. Under BE18 upstream-first compiler guidance, retain those contracts and fix the Business preprocessor error first. Source conformance: actual TaxAdvanceService directives versus the reported EOF; IInvoiceService signatures versus InvoiceService/InvoiceController calls. Source-only verification; owner rebuild required before confirming the downstream-error diagnosis. No UI/financial/API/schema/guide-content change.

Final reconciliation: Implemented — source-only; Owner verification pending: yes. Removed the orphan directive. Scoped directive scan now finds0regions/0endregions in TaxAdvanceService, InvoiceService, IInvoiceService and InvoiceController; no merge markers. All six requested signatures exist on the exact injected interface and the facade; Business ProjectReference is correct, so no duplicate methods/interface or controller workaround was added. TaxAdvanceService is an existing untracked refactor file: complete source was reviewed separately because Git diff cannot display it; scoped tracked diff --check clean, LF/CRLF notices informational. Other source/history retained. Existing /UserGuide/invoice guide still describes the unchanged TaxAdvance/Rental workflows; no user-flow change needs a content edit. All eight recipe checks OK; existing BE18/compiler guidance and skill already cover this failure, no new canonical rule. Proportional discovery/freeze/Phase05source wiring/Phase06 reconciliation; financial/UI/runtime phases inapplicable or pending. No schema change/migration; no subagents for a one-directive fix. No build/tests/lint/browser/database/migration/snapshot/commit/push/deploy. Owner rebuild Business first, then ServerAPI, and reassess remaining compiler errors. Suggested backend commit: `fix(invoice): remove unmatched tax advance region directive`.

The frozen contract was applied source-only. `TaxAdvanceService` now owns tax-advance behavior behind `ITaxAdvanceService`, `InvoiceAccountingService` owns shared JV construction/posting, and `InvoiceService` remains the compatibility façade for existing callers. No routes, persisted invoice hierarchy, or migrations changed.
