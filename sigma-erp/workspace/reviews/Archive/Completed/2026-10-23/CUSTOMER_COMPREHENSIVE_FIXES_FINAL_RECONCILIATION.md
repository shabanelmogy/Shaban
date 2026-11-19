# Individual / Company — comprehensive fixes final reconciliation

| Field | Value |
|---|---|
| Date | 2026-10-01 |
| Status | Implemented for frozen slices; source reconciliation complete |
| Owner verification pending | yes, except the reported unchanged-save scenario confirmed below |
| Authorization | Owner: implement every comprehensive finding; trace the full Update flow and fix unchanged saves |
| Contract | [Frozen fixes plan](<../../../CUSTOMER_COMPREHENSIVE_FIXES_PLAN.md>) and its integration amendments |
| Authority | Sigma AGENTS, Master, Backend Pattern 2, UI type 03 with nested type 01 drafts, canonical books and sigma-screen-refactor skill |

## Reported Update failure: cause, fix and owner evidence

The owner confirmed that changed Individual data saved successfully, while saving
the same data returned HTTP 400, `Updated Failed`. Supplier was named as another
affected screen. Source tracing located the shared cause:
`UnitOfWork.SaveChanges/SaveChangesAsync` interpreted EF's affected-row count
`> 0` as success. An unchanged tracked snapshot legitimately returns zero.

| Stage | Reconciled behavior |
|---|---|
| Frontend | Individual validates the loaded full snapshot and sends the ordinary editable payload. Supplier sends its existing update payload. No change-detection requirement is added to Save. |
| HTTP | Existing services send PUT; the shared interceptor presents failed API results. |
| Controller | Existing result handling converted the false service result into the reported 400. |
| Individual service | Resolve the customer group, enter the base unique-write guard, load the tracked aggregate, validate ownership, map editable fields and reconcile owned rows, then SaveUpdateAsync. |
| Supplier service | Its own tracked UpdateAsync bypasses the generic Update core. Its final save/result now reuses SaveUpdateAsync. |
| UnitOfWork | Await EF save and return true after successful completion, including zero affected rows, in both sync and async methods. |
| Failure handling | Existing tenant-ownership conflict returns false; other persistence/concurrency exceptions still propagate. Cancellation is not converted into success. |

This is not caused by omitted `SubscriptionId` or `No`: they are server-owned;
the traced mappings preserve them. The fix keeps their transport contract and
does not force graph-wide writes. The common boolean remains a completion result;
business checks for Add/Delete/actions remain in their existing owners.

**Owner evidence:** after repeating the Individual unchanged-save scenario, the
owner reported **"جربت اشتغل تمام"**. This confirms that reported scenario after
the fix. It is not evidence for every screen or the remaining acceptance cases.

Primary implementation paths:

- [UnitOfWork](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/UnitOfWork.cs>)
- [IUnitOfWork](<F:/My Work/Sigma/SigmaBackend/SiGma.Repos/UnitOfWork/IUnitOfWork.cs>)
- [Base service](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Bases/Service.cs>)
- [Individual service](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Customers/IndividualPartnerService.cs>)
- [Supplier service](<F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/SupplierServices/SupplierService.cs>)

## Comprehensive backend findings

Source audit: [backend review](<../../../CUSTOMER_COMPREHENSIVE_BACKEND_REVIEW.md>).

| Finding | Implemented disposition |
|---|---|
| BE-01 | Individual tracked UpdateCore validates both collections and address/billing reference ownership before mapping. |
| BE-02 | Reconcile request VMs onto retained tracked rows; ignore manually reconciled navigations in the Individual update profile. Existing child No is preserved. |
| BE-03 | Company and Individual import endpoints require authentication; no new role permission contract. |
| BE-04 | Company import persists advertised address fields and resolves a live country in the authenticated tenant. |
| BE-05 | Import boundary applies established billing constraints; decimal money inputs stay decimal. |
| BE-06 | Parse enum text and reject undefined numeric values; optional blank gender stays null. |
| BE-07 | Individual Add/Update persisted string limits match their columns and frontend controls. |
| BE-08 | Individual import rejects missing/default and future birth dates. Ordinary VMs retain their date attributes. |
| BE-09 | Import exceptions are logged server-side; clients receive safe localized messages and the existing partial-import result. |

The preceding five shared-write fixes remain in place: participating application
locks, one customer-group resolver, Added-row empty-only numbering, VM date rules,
and existing snapshot/save helpers. Generic detached update-engine repair and
count-based sequence redesign remain separate backlog work.

Backend files also include `IndividualPartnerProfiler`, `ImportDataService`,
`ImportDataController`, Individual Add/Update VMs, CompanyImportVM, shared
CustomerDocument Add/Update VMs, and GeneralMessage resources. Direct document
consumers in Booking, Equipment and Staff were reconciled with the nullable
required enum contract; their unrelated workflows were preserved.

## Comprehensive frontend findings

Source audit: [frontend review](<../../../CUSTOMER_COMPREHENSIVE_FRONTEND_REVIEW.md>).

| Finding | Implemented disposition |
|---|---|
| F01 | Individual successful-detail ready gate and explicit retry prevent a failed-load blank update. |
| F02 | Save checks whole-form invalidity; explicit complete summary specs include surcharges. |
| F03 | Shared parse/date/nonfuture validators reject invalid typed dates before payload conversion. |
| F04 | Individual Save/navigation/close are gated while detail loading, upload or cleanup is active. |
| F05 | Shared upload tracker retains active requests until every subscribed upload ends; cleanup waits for idle. |
| F06 | Individual retains original saved paths and compares them after successful persistence. Cleanup failure stays visible with retry. Standalone Driver screen is retired; nested draft uploads transfer to Company. |
| F07 | Shared document controls/payload/wire enum and backend VMs use the decided required fields, date order, lengths and CustomerDocuments folder. |
| F08 | API-optional email/gender/nationality remain optional; no invented two-character name minimum or default gender. |
| F09 | Individual UI page size is 10–100, matching the shared grid menu; backend remains 1–100. |
| F10 | Company CSV uses canonical isInactive with legacy header alias; invalid nonempty booleans/numbers produce cell errors instead of silent coercion. |
| F11 | Individual CSV uses the shared DMY/ISO date parser. |
| F12 | Import failures have one feedback owner; safe HTTP fallback and partial-result diagnostics remain visible. |
| F13 | Company forward step-header navigation uses the current-step validation gate. |
| F14 | Explicit specs, actual field IDs and row controls; otherDetail FieldError; existing contact mobileNo is editable so its error can be focused. |
| F15 | Neutral partnerForm enum ownership and Arabic gender keys cover current partner/draft consumers. |
| F16 | Legacy Company alias and standalone Driver/Contact screens/routes/providers retired. Live Driver service/models and agreement picker consumers retained. Explicit app compile roots reconciled. |
| F17 | Customer imports use shared title/list shell, fill table and bounded diagnostics, with busy/finalize guards. |
| F18 | Individual View uses saved labels without edit-only lookup requests; Edit merges saved selected options. |

Frontend implementation is owned by IndividualPartner, CompanyPartner and the
two customer import pages. Shared owners are `partner-editor` models,
`partner-editor-forms`, `customer-import`, `DocumentUploadTracker`, FileUploadService,
ImportCsvComponent, shared alert styles and vocabulary. Root routing, Layout
registration and `tsconfig.app.json` were reconciled with retired screens.

Owner-reported compiler errors were addressed in source: ES2018-compatible
Object.keys construction replaces Object.fromEntries; eight obsolete explicit
CompanyDriver/Contact roots were removed. Required draft validation-summary
countLabel is supplied. No compiler was run by the agent.

## Decisions, contracts and boundaries

- Existing Pattern 2 aggregates and routed step editors remain the selected shapes.
  No replacement form, grid, upload or import framework was created.
- Full snapshots retain saved child IDs, ownership and server-owned numbers. New
  rows use the existing numbering owner; document type/number/issue/expiry are
  required, issuer/path optional, expiry strictly after issue. Incomplete existing
  documents need real user completion.
- CSV is an alternate writer of ordinary constraints. Partial chunks remain
  deliberate; malformed supplied cells are reported before DTO construction.
- No new lifecycle, accounting calculation or posting is added to customer Save.
  List columns/ListVM fields are unchanged by these fixes; their prior alignment
  is recorded in the frontend audit rather than expanded here.
- **Pending card retention decision:** R3/backend backlog 28 is not implemented.
  Removing saved PAN/CVV and replacing them with last4 requires the owner decision
  under the Master data-destruction boundary and an owner-run backfill/migration.
  The sensitive card entity/DTO/UI contract remains unchanged in this scope.
- These fixes add no entity/schema/index change and need no new Add-Migration.
  Preexisting working-tree EF changes and their pending migrations are separate.
  Unrelated user changes were preserved.

## Verification, phases and remaining handoff

Phases 0/1: source evidence and frozen contract; phases 2/3: customer paging,
CSV, form/child/upload corrections; phase 5: routes/providers/compile roots and
direct shared DTO consumers; phase 6: scoped source reconciliation. Phase 4 has
no new customer domain transition in this contract. Screenshots establish no new
requirement in this follow-up; no missing workflow was invented.

Read-only source checks: scoped diff whitespace checks; live-import/route and
explicit compile-root existence searches; customer vocabulary parity; canonical
book/skill references. Scoped backend/frontend/documentation diff checks exit 0
(only existing LF/CRLF notices in source repositories). The five touched vocabulary
blocks have 248 English and 248 Arabic keys, zero missing and zero case-only
differences. Remaining explicit app roots exist; retired screen imports/routes
are absent. Book-reference checking resolves every checked reference.
No build, tests, lint, browser/runtime, SQL, migration,
model snapshot, commit, push or deployment was run by the agent. Owner's successful
unchanged save is recorded separately from these source checks.

All eight generated packets were stale at discovery. Canonical books were used;
generated files were not edited. Owner regeneration and semantic review remain
pending. Canonical Backend 0.68, UI 1.13 and skill were updated together, including
the shared save-completion rule in Backend blocks 5/14.

Remaining owner checks:

1. Compile/restore backend and frontend, including direct shared-document consumers.
2. Changed and unchanged saves in Company and Supplier; invalid input, duplicate,
   missing record and ownership failures must still fail. Check child IDs/No.
3. Concurrent participating API/import writes; lock wait, failure, rollback and
   caller-owned outer transactions.
4. CSV malformed cells, required DOB, address/country, partial chunks and safe errors.
5. Failed detail load/retry, parallel uploads, whole-row file removal, save/discard
   cleanup failure/retry without resaving or losing the editor.
6. Arabic/RTL, theme, narrow layouts, internal scroll and keyboard/error focus.

Earlier independent backend/frontend reviews produced the findings. Bounded
implementation agents were assigned nonoverlapping backend, Individual/shared
and Company ownership; usage limits interrupted those workers. Root completed
remaining implementation, shared integration, documentation and reconciliation.
Inherited models were used. No extra agents were spawned for the small no-op fix.

Suggested commits only:

- Backend: `fix(customers): reconcile owned updates and successful no-op saves`
- Frontend: `fix(customers): align validation uploads imports and live roots`
- Documentation: `docs(customers): reconcile findings and save completion rule`
